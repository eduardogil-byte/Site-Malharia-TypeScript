create or replace function public.health_check()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select 'ok'::text;
$$;

revoke all
on function public.health_check()
from public;

grant execute
on function public.health_check()
to anon, authenticated;