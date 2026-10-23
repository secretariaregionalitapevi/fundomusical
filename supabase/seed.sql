-- Apenas fundo institucional de finalidade; sem usuários, conta ou Pix.
insert into public.funds(id,purpose_code,description,status)
values('fundo-musical-itapevi','FUNDO_MUSICAL','Fundo Musical da Regional Itapevi — piloto em homologação','inactive') on conflict do nothing;
-- Agenda fictícia é rascunho e nunca aparece como evento real.
insert into public.events(id,fund_id,title,event_date,region,status)
values('11111111-1111-4111-8111-111111111111','fundo-musical-itapevi','EXEMPLO FICTÍCIO — ensaio sem data definida',null,'REGIÃO FICTÍCIA','draft') on conflict do nothing;
