create function changer_date_livraison()
returns trigger as $function$
  begin
    update livraisons set jour = new.jour where jour = old.jour;
    return new;
  end;
$function$ language plpgsql;

create trigger change_date_planning
  after update on plannings
  for each row
  execute function changer_date_livraison();
