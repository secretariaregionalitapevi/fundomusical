-- Aplicar apenas em projeto Supabase isolado e revisado. Nenhuma conta real nesta migração.
begin;
create type public.admin_role as enum ('viewer','editor','approver','auditor');
create type public.config_status as enum ('draft','pending','approved','unavailable');

create table public.funds (
  id text primary key check (id = 'fundo-musical-itapevi'),
  purpose_code text unique not null check (purpose_code = 'FUNDO_MUSICAL'),
  description text not null, status text not null default 'inactive' check (status in ('inactive','active')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.admin_profiles (
  auth_user_id uuid primary key references auth.users(id),
  role public.admin_role not null, status text not null default 'inactive' check(status in ('inactive','active')),
  created_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(), fund_id text not null references public.funds(id),
  title text not null check(length(title) between 4 and 140), event_date date,
  region text not null check(length(region) between 2 and 100),
  status text not null default 'draft' check(status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(id,fund_id)
);
create table public.recipient_config_versions (
  id uuid primary key default gen_random_uuid(), fund_id text not null references public.funds(id),
  purpose_code text not null default 'FUNDO_MUSICAL' check(purpose_code = 'FUNDO_MUSICAL'),
  regional_id text not null default 'regional-itapevi' check(regional_id = 'regional-itapevi'),
  beneficiary_legal_name text not null check(length(beneficiary_legal_name) between 3 and 140),
  beneficiary_document text not null check(beneficiary_document ~ '^[A-Z0-9]{12}[0-9]{2}$'),
  pix_key text not null check(length(pix_key) between 1 and 140),
  bank_name text, source_type text not null check(source_type in ('dedicated_account','classified_dynamic')),
  provider text not null default 'disabled', status public.config_status not null default 'pending',
  version bigint generated always as identity unique,
  requested_by uuid not null references public.admin_profiles(auth_user_id),
  approved_by uuid references public.admin_profiles(auth_user_id), approval_evidence_ref text,
  approved_at timestamptz, expires_at timestamptz not null,
  segregation_approved boolean not null default false,
  checksum text not null check(checksum ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  check(approved_by is null or approved_by <> requested_by),
  check(status <> 'approved' or (approved_by is not null and approved_at is not null and approval_evidence_ref is not null and segregation_approved)),
  check(length(coalesce(approval_evidence_ref,'')) <= 200)
);
create unique index one_active_recipient on public.recipient_config_versions(fund_id) where status = 'approved';
create table public.recipient_change_approvals (
  id uuid primary key default gen_random_uuid(), config_id uuid unique not null references public.recipient_config_versions(id),
  requested_by uuid not null references public.admin_profiles(auth_user_id),
  approved_by uuid not null references public.admin_profiles(auth_user_id),
  decision text not null check(decision in ('approved','rejected')),
  evidence_ref text not null check(length(evidence_ref) between 4 and 200),
  created_at timestamptz not null default now(), check(requested_by <> approved_by)
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(), actor uuid not null references public.admin_profiles(auth_user_id),
  action text not null, resource_type text not null, resource_id text not null,
  redacted_diff jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.aggregate_metrics_daily (
  id uuid primary key default gen_random_uuid(), fund_id text not null references public.funds(id),
  day date not null, event_id uuid, channel text not null check(channel in ('direct','qr','nfc','whatsapp')),
  page_views bigint not null default 0 check(page_views >= 0), copy_clicks bigint not null default 0 check(copy_clicks >= 0),
  foreign key(event_id,fund_id) references public.events(id,fund_id),
  unique nulls not distinct (day,fund_id,event_id,channel)
);

-- Função central: sem recursão RLS; não retorna dados, apenas bool sobre o próprio usuário.
create function public.has_admin_role(allowed public.admin_role[]) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt()->>'aal') = 'aal2',false) and exists (
    select 1 from public.admin_profiles p where p.auth_user_id = (select auth.uid())
      and p.status = 'active' and p.role = any(allowed)
  );
$$;
revoke all on function public.has_admin_role(public.admin_role[]) from public, anon;
grant execute on function public.has_admin_role(public.admin_role[]) to authenticated;

alter table public.funds enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.events enable row level security;
alter table public.recipient_config_versions enable row level security;
alter table public.recipient_change_approvals enable row level security;
alter table public.audit_events enable row level security;
alter table public.aggregate_metrics_daily enable row level security;
revoke all on public.funds, public.admin_profiles, public.events, public.recipient_config_versions, public.recipient_change_approvals, public.audit_events, public.aggregate_metrics_daily from anon, authenticated;
grant select on public.funds, public.admin_profiles, public.events, public.recipient_config_versions, public.recipient_change_approvals, public.audit_events, public.aggregate_metrics_daily to authenticated;

create policy profiles_self_read on public.admin_profiles for select to authenticated using (
  auth_user_id = (select auth.uid()) and (select auth.jwt()->>'aal') = 'aal2' and status='active'
);
create policy funds_admin_read on public.funds for select to authenticated using (public.has_admin_role(array['viewer','editor','approver','auditor']::public.admin_role[]));
create policy events_admin_read on public.events for select to authenticated using (public.has_admin_role(array['viewer','editor','approver','auditor']::public.admin_role[]));
create policy configs_admin_read on public.recipient_config_versions for select to authenticated using (public.has_admin_role(array['viewer','editor','approver','auditor']::public.admin_role[]));
create policy approvals_admin_read on public.recipient_change_approvals for select to authenticated using (public.has_admin_role(array['editor','approver','auditor']::public.admin_role[]));
create policy audit_restricted_read on public.audit_events for select to authenticated using (public.has_admin_role(array['approver','auditor']::public.admin_role[]));
create policy metrics_admin_read on public.aggregate_metrics_daily for select to authenticated using (public.has_admin_role(array['viewer','editor','approver','auditor']::public.admin_role[]));

-- Alterações apenas por RPCs limitadas, com RBAC + AAL2 e auditoria transacional.
create function public.propose_recipient(legal_name text, document_number text, key_value text, arrangement text, valid_until timestamptz, evidence_ref text)
returns uuid language plpgsql security definer set search_path = '' set timezone = 'UTC' as $$
declare config_id uuid;
begin
  if not public.has_admin_role(array['editor']::public.admin_role[]) then raise exception 'forbidden'; end if;
  if valid_until <= now() or length(evidence_ref) not between 4 and 200 then raise exception 'invalid evidence or expiry'; end if;
  insert into public.recipient_config_versions(fund_id,beneficiary_legal_name,beneficiary_document,pix_key,source_type,requested_by,expires_at,approval_evidence_ref,checksum)
    values('fundo-musical-itapevi',legal_name,document_number,key_value,arrangement,auth.uid(),valid_until,evidence_ref,
      encode(sha256(convert_to(jsonb_build_array('fundo-musical-itapevi','FUNDO_MUSICAL','regional-itapevi',legal_name,document_number,key_value,arrangement,valid_until)::text,'UTF8')),'hex')) returning id into config_id;
  insert into public.audit_events(actor,action,resource_type,resource_id) values(auth.uid(),'recipient.proposed','recipient_config',config_id::text);
  return config_id;
end;
$$;
create function public.decide_recipient(config_id uuid, approve boolean, evidence_ref text, segregation_verified boolean)
returns void language plpgsql security definer set search_path = '' set timezone = 'UTC' as $$
declare proposal public.recipient_config_versions;
begin
  if not public.has_admin_role(array['approver']::public.admin_role[]) then raise exception 'forbidden'; end if;
  -- Um lock por fundo serializa trocas concorrentes e a versão ativa.
  perform 1 from public.funds where id='fundo-musical-itapevi' for update;
  select * into proposal from public.recipient_config_versions where id = config_id for update;
  if not found or proposal.status <> 'pending' or proposal.requested_by = auth.uid() then raise exception 'invalid decision'; end if;
  if evidence_ref is null or length(evidence_ref) not between 4 and 200 then raise exception 'evidence required'; end if;
  if approve is null or segregation_verified is null then raise exception 'decision required'; end if;
  if approve and (not segregation_verified or proposal.expires_at <= now()) then raise exception 'unapproved segregation or expiry'; end if;
  if proposal.checksum <> encode(sha256(convert_to(jsonb_build_array(proposal.fund_id,proposal.purpose_code,proposal.regional_id,proposal.beneficiary_legal_name,proposal.beneficiary_document,proposal.pix_key,proposal.source_type,proposal.expires_at)::text,'UTF8')),'hex') then raise exception 'checksum mismatch'; end if;
  if approve then update public.recipient_config_versions set status='unavailable' where fund_id=proposal.fund_id and status='approved'; end if;
  insert into public.recipient_change_approvals(config_id,requested_by,approved_by,decision,evidence_ref)
    values(proposal.id,proposal.requested_by,auth.uid(),case when approve then 'approved' else 'rejected' end,evidence_ref);
  update public.recipient_config_versions set status=case when approve then 'approved'::public.config_status else 'unavailable'::public.config_status end,
    approved_by=auth.uid(), approved_at=now(), approval_evidence_ref=evidence_ref, segregation_approved=segregation_verified where id=proposal.id;
  insert into public.audit_events(actor,action,resource_type,resource_id,redacted_diff)
    values(auth.uid(),'recipient.decided','recipient_config',proposal.id::text,jsonb_build_object('approved',approve));
end;
$$;
create function public.create_music_event(event_title text, event_day date, event_region text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if not public.has_admin_role(array['editor']::public.admin_role[]) then raise exception 'forbidden'; end if;
  insert into public.events(fund_id,title,event_date,region) values('fundo-musical-itapevi',event_title,event_day,event_region) returning id into result;
  insert into public.audit_events(actor,action,resource_type,resource_id) values(auth.uid(),'event.drafted','event',result::text);
  return result;
end;
$$;
revoke all on function public.propose_recipient(text,text,text,text,timestamptz,text) from public, anon;
revoke all on function public.decide_recipient(uuid,boolean,text,boolean) from public, anon;
revoke all on function public.create_music_event(text,date,text) from public, anon;
grant execute on function public.propose_recipient(text,text,text,text,timestamptz,text), public.decide_recipient(uuid,boolean,text,boolean), public.create_music_event(text,date,text) to authenticated;
commit;
