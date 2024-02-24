create table jardins (
  jardin_id bigint not null,
  jardin text,
  adresse_id bigint,
  tva text,
  contact_id bigint
);

alter table jardins alter column jardin_id add generated by default as identity (
  sequence name jardin_id_seq
  start with 1
  increment by 1
  no minvalue
  no maxvalue
  cache 1
);

alter table only jardins
  add constraint jardins_pkey primary key (jardin_id);


alter table jardins enable row level security;

create policy "Lecture publique"
  on jardins
  as permissive
  for select
  to public
  using (true);

-- adresses

create extension postgis schema extensions;

create table adresses (
  adresse_id bigint not null,
  jardin_id bigint,
  adresse text,
  codepostal text,
  ville text,
  localisation geometry(point, 4326) default null::geometry
);

alter table adresses alter column adresse_id add generated by default as identity (
  sequence name adresse_id_seq
  start with 1
  increment by 1
  no minvalue
  no maxvalue
  cache 1
);

create index adresses_localisation_idx
  on adresses
  using gist (localisation);

alter table only adresses
  add constraint adresses_pkey primary key (adresse_id);

alter table adresses
  add constraint adresses_jardin_id_fkey
  foreign key (jardin_id) references jardins(jardin_id) not valid;

alter table adresses
  validate constraint adresses_jardin_id_fkey;

alter table jardins
  add constraint jardins_adresse_id_fkey
  foreign key (adresse_id) references adresses(adresse_id) on delete set null not valid;

alter table jardins
  validate constraint jardins_adresse_id_fkey;


alter table adresses enable row level security;

create policy "Lecture publique"
on adresses
as permissive
for select
to public
using (true);


-- contacts

create table contacts (
  contact_id bigint not null,
  jardin_id bigint,
  contact text,
  telephone text,
  email text
);

alter table contacts alter column contact_id add generated by default as identity (
  sequence name contact_id_seq
  start with 1
  increment by 1
  no minvalue
  no maxvalue
  cache 1
);

alter table only contacts
  add constraint contacts_pkey primary key (contact_id);

alter table contacts
  add constraint contacts_jardin_id_fkey
  foreign key (jardin_id) references jardins(jardin_id) not valid;

alter table contacts
  validate constraint contacts_jardin_id_fkey;

alter table jardins
  add constraint jardins_contact_id_fkey
  foreign key (contact_id) references contacts(contact_id) on delete set null not valid;

alter table jardins
  validate constraint jardins_contact_id_fkey;

alter table contacts enable row level security;

create policy "Lecture publique"
on contacts
as permissive
for select
to public
using (true);