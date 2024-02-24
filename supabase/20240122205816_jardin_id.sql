alter table adhesions
  add constraint adhesions_saison_id_fkey
  foreign key (saison_id) references saisons(saison_id) on delete cascade not valid;

alter table adhesions
  validate constraint adhesions_saison_id_fkey;

alter table preparations
  add constraint preparations_jardin_id_fkey
  foreign key (jardin_id) references jardins(jardin_id) on delete cascade not valid;

alter table preparations
  validate constraint preparations_jardin_id_fkey;
