create function preparer(_semaine int)
 returns table (_preparation_id bigint, _preparation text, _produit text, _nombre bigint)
 language plpgsql
as $function$
begin

return query select p.preparation_id, p.preparation,
p3.produit, count(p3.produit_id)
from preparations p
join tournees t on t.preparation_id = p.preparation_id
join distributions d on d.tournee_id = t.tournee_id
join depots t2 on t2.depot_id = d.depot_id
join livraisons l on l.distribution_id  = d.distribution_id
join abonnements a on a.abonnement_id = l.abonnement_id
join adherents h on h.adherent_id = a.adherent_id
join paniers p2 on a.panier_id = p2.panier_id
join produits p3 on p3.produit_id = p2.produit_id
where
DATE_PART('week',l.jour) = _semaine
group by p.preparation_id, p.preparation, p3.produit;

end; $function$;
