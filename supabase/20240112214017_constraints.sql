alter table adherents
  add constraint adherents_depot_id_fkey
  foreign key (depot_id) references depots(depot_id) not valid;

alter table adherents validate constraint adherents_depot_id_fkey;

alter table fermetures
  add constraint fermetures_saison_id_fkey
  foreign key (saison_id) references saisons(saison_id) not valid;

alter table fermetures validate constraint fermetures_saison_id_fkey;

alter table frequences
  add constraint frequences_jardin_id_fkey
  foreign key (jardin_id) references jardins(jardin_id) not valid;

alter table frequences validate constraint frequences_jardin_id_fkey;
