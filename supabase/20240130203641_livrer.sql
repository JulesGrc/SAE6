create function livrer()
 returns table (preparation_id bigint, preparation text,
 tournee_id bigint, tournee text,
 depot_id bigint, depot text,
livraison_id bigint,
adherent text, produit text)
 language plpgsql
as $function$
declare
  _preparation_id bigint;
 _semaine int;
 _jour date;
begin

select p.preparation_id,  DATE_PART('week',l.jour), jour
into _preparation_id, _semaine, _jour
from livraisons l
join distributions d on d.distribution_id = l.distribution_id
join tournees t on t.tournee_id = d.tournee_id
join preparations p on p.preparation_id = t.preparation_id
where livre = 'à livrer'
order by jour asc
limit 1;

return query select p.preparation_id, p.preparation,
t.tournee_id,t.tournee,
t2.depot_id , t2.depot,
l.livraison_id,
h.adherent,
p3.produit
from preparations p
join tournees t on t.preparation_id = p.preparation_id
join distributions d on d.tournee_id = t.tournee_id
join depots t2 on t2.depot_id = d.depot_id
join livraisons l on l.distribution_id  = d.distribution_id
join abonnements a on a.abonnement_id = l.abonnement_id
join adherents h on h.adherent_id = a.adherent_id
join paniers p2 on a.panier_id = p2.panier_id
join produits p3 on p3.produit_id = p2.produit_id
where p.preparation_id = _preparation_id
and DATE_PART('week',l.jour) = _semaine
order by t.ordre, d.ordre;

end; $function$;
