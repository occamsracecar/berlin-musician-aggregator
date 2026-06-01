export type Entry = {
  id: string;
  board_name: string;
  title: string;
  description: string | null;
  original_url: string;
  published_at: string | null;
  listing_type: string | null;
  genres: string[];
  contact_url: string | null;
};
