import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookmarkFilters } from '../models/bookmark.model';

@Injectable({ providedIn: 'root' })
export class BookmarkFiltersService {
  filters$ = new BehaviorSubject<BookmarkFilters>({
    search: { key: 'author', text: '' },
    genres: [],
    rating: 0
  });

  setFilters(filters: any) {
    this.filters$.next(filters);
  }

  getFilters() {
    return this.filters$.getValue();
  }
}
