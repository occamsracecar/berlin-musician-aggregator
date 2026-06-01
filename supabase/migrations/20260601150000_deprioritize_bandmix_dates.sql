-- Push Bandmix listings back one week so they rank lower in date-sorted browse.
UPDATE public.entries
SET published_at = published_at - interval '7 days'
WHERE board_name = 'bandmix.de'
  AND published_at IS NOT NULL;
