create function adherer()
 returns integer
 language plpgsql
as $function$
declare
  _saison_id bigint;
  _nb bigint;
begin

select saison_id into _saison_id
  from saisons s
  order by date_debut desc;

with insertion as (
  insert into adhesions (jardin_id, adherent_id, date_adhesion, montant, saison_id)
  select a.jardin_id, a.adherent_id, now(), 30, _saison_id
  from adherents a
  where a.date_sortie is null returning *)
select count(*) into _nb from insertion;

return _nb;

end; $function$
;
