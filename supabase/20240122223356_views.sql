create view view_nb_adherents_par_jardin
as select j.jardin_id,
    j.jardin,
    count(a.*) as nb_adherents
  from jardins j
    left join adherents a on a.jardin_id = j.jardin_id
  group by j.jardin_id;

create view view_nb_depots_par_jardin
as select j.jardin_id,
    j.jardin,
    count(d.*) as nb_depots
  from jardins j
    left join depots d on d.jardin_id = j.jardin_id
  group by j.jardin_id;

create view view_jardins_details
as select j.jardin_id,
    j.jardin,
    j.tva,
    a.adresse,
    a.codepostal,
    a.ville,
    a.localisation,
    c.contact,
    c.telephone,
    c.email
  from jardins j
    left join adresses a on a.adresse_id = j.adresse_id
    left join contacts c on c.contact_id = j.contact_id;

create view view_depots_details
as select d.depot_id,
    d.jardin_id,
    d.depot,
    d.capacite,
    a.adresse,
    a.codepostal,
    a.ville,
    a.localisation,
    c.contact,
    c.telephone,
    c.email
  from depots d
    left join adresses a on a.adresse_id = d.adresse_id
    left join contacts c on c.contact_id = d.contact_id;

create view view_calendriers_details
as select c.calendrier_id,
    c.calendrier,
    s.saison,
    f.frequence,
    count(p.*) as count,
    sum(p.quantite) as sum
  from calendriers c
    left join plannings p on p.calendrier_id = c.calendrier_id
    join saisons s on s.jardin_id = c.jardin_id and p.jour >= s.date_debut and p.jour <= s.date_fin
    join frequences f on f.frequence_id = p.frequence_id
  group by c.calendrier_id, s.saison_id, s.saison, p.frequence_id, f.frequence;

create view check_adherents_adhesions
as select a.adherent_id,
    a.adherent
  from adherents a
    join adhesions d on a.adherent_id = d.adherent_id
  where a.jardin_id <> d.jardin_id;
