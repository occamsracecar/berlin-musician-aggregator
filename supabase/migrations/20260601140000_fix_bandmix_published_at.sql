-- Bandmix stores relative activity labels, not scrape timestamps.
UPDATE public.entries
SET published_at = CASE
  WHEN description ~* 'Activity: Aktiv innerhalb 24 Stunden'
    THEN (now() AT TIME ZONE 'utc' - interval '1 day')::date + time '12:00' AT TIME ZONE 'utc'
  WHEN description ~* 'Activity: Aktiv während der letzten Woche'
    THEN (now() AT TIME ZONE 'utc' - interval '7 days')::date + time '12:00' AT TIME ZONE 'utc'
  WHEN description ~* 'Activity: Aktiv in den letzten 2 Wochen'
    THEN (now() AT TIME ZONE 'utc' - interval '14 days')::date + time '12:00' AT TIME ZONE 'utc'
  WHEN description ~* 'Activity: Aktiv innerhalb eines Monats'
    THEN (now() AT TIME ZONE 'utc' - interval '30 days')::date + time '12:00' AT TIME ZONE 'utc'
  WHEN description ~* 'Activity: Aktiv vor mehr als einem Monat'
    THEN (now() AT TIME ZONE 'utc' - interval '90 days')::date + time '12:00' AT TIME ZONE 'utc'
  ELSE published_at
END
WHERE board_name = 'bandmix.de'
  AND description ~* 'Activity: Aktiv ';
