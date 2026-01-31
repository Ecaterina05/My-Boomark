export interface Bookmark {
  id: number;
  title: string;
  author: string;
  rating: number;
  genre: Genre;
  notes: string;
  created: string;
}

interface Genre {
  display: string;
  code: number;
}
