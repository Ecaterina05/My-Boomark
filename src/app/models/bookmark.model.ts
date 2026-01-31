export interface Bookmark {
  id: number;
  title: string;
  author: string;
  rating: number;
  genre: Genre;
  notes: string;
  created: string;
  createdKey: string;
}

export interface Genre {
  display: string;
  code: number;
}

export interface BookmarkFilters {
  search: SearchFilter;
  genres: Genre[];
  rating: number;
}

export interface SearchFilter {
  key: 'title' | 'author'
  text: string;
}
