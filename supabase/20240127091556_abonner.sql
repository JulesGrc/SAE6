create function public.abonner(_adherent_id bigint, _panier_id bigint, _distribution_id bigint, _date date, _quantite int default 0)
 returns bigint
 language plpgsql
as $function$
declare
  _jardin_id bigint;
  _saison_id bigint;
  _frequence_id bigint;
  _calendrier_id bigint;
  _abonnement_id bigint;
  _date_debut date;
  _date_fin date;
begin

  select a.jardin_id, a.saison_id, s.date_debut, s.date_fin
    into _jardin_id, _saison_id, _date_debut, _date_fin
    from adhesions a
    join saisons s on s.saison_id = a.saison_id
    where a.adherent_id = _adherent_id
    and _date between s.date_debut and s.date_fin;

  if not found then
    raise 'Pas d adhesion pour cet adherent';
  end if;

  select frequence_id into _frequence_id
  from paniers
  where panier_id = _panier_id;

  if not found then
    raise 'Pas de panier';
  end if;

 select calendrier_id into _calendrier_id
    from tournees
    join distributions on distributions.tournee_id = tournees.tournee_id
    where distribution_id = _distribution_id;

   if not found then
     raise 'Pas de calendrier';
   end if;

  if _quantite = 0 then
    select count(*) into _quantite
    from plannings
    where quantite > 0
    and frequence_id = _frequence_id
    and calendrier_id = _calendrier_id
    and jour between _date and _date_fin;
  end if;

  if _quantite = 0 then
    select quantite into _quantite from paniers where panier_id = _panier_id;
  end if;

  insert into abonnements
    (adherent_id, panier_id, montant, nombre, date_debut, saison_id)
    select _adherent_id, _panier_id, prix, _quantite, _date_debut, _saison_id
      from paniers
      where panier_id = _panier_id
    returning abonnement_id into _abonnement_id;

  insert into livraisons
  (jardin_id, abonnement_id, distribution_id, qte, jour)
  select _jardin_id, _abonnement_id, _distribution_id, quantite, jour
    from plannings
    where quantite > 0
    and frequence_id = _frequence_id
    and calendrier_id = _calendrier_id
    and jour between _date and _date_fin;

   return _abonnement_id;
end; $function$;
