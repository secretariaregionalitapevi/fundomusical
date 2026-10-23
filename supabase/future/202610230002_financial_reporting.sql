-- NÃO APLICAR AUTOMATICAMENTE. Exige integração e autorização financeira prévias.
begin;
create table public.financial_reconciliation_batches (
  id uuid primary key default gen_random_uuid(), fund_id text not null references public.funds(id),
  event_id uuid, source text not null check(source in ('manual_verified','bank')),
  period_start timestamptz not null, period_end timestamptz not null check(period_end >= period_start),
  amount numeric(16,2) not null check(amount >= 0), count bigint not null check(count >= 0),
  reference text unique not null, reconciliation_status text not null check(reconciliation_status in ('pending','reconciled','rejected')),
  verified_by uuid references public.admin_profiles(auth_user_id), verified_at timestamptz,
  foreign key(event_id,fund_id) references public.events(id,fund_id),
  check(reconciliation_status <> 'reconciled' or (verified_by is not null and verified_at is not null))
);
create table public.financial_totals (
  id uuid primary key default gen_random_uuid(), fund_id text not null references public.funds(id), event_id uuid,
  total_amount numeric(16,2) not null check(total_amount >= 0), source text not null check(source in ('manual_verified','bank')),
  verified_by uuid not null references public.admin_profiles(auth_user_id), verified_at timestamptz not null,
  reconciliation_reference uuid not null references public.financial_reconciliation_batches(id),
  foreign key(event_id,fund_id) references public.events(id,fund_id)
);
alter table public.financial_totals enable row level security;
alter table public.financial_reconciliation_batches enable row level security;
revoke all on public.financial_totals, public.financial_reconciliation_batches from anon, authenticated;
grant select on public.financial_totals, public.financial_reconciliation_batches to authenticated;
create policy financial_totals_read on public.financial_totals for select to authenticated using(public.has_admin_role(array['approver','auditor']::public.admin_role[]));
create policy reconciliation_read on public.financial_reconciliation_batches for select to authenticated using(public.has_admin_role(array['approver','auditor']::public.admin_role[]));
-- Sem escrita pelo portal. Importador bancário e homologação ainda pendentes.
commit;
