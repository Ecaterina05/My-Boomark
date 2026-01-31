import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Bookmark } from '../../../models/bookmark.model';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../../services/bookmark.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BookmarkFiltersService } from '../../../services/bookmark-filters.service';

@Component({
  selector: 'app-bookmark-list',
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './bookmark-list.component.html',
  styleUrl: './bookmark-list.component.scss',
})
export class BookmarkListComponent {
  bookmarks!: Bookmark[];
  isLoading!: Observable<boolean>;

  constructor(
    private bookmarkService: BookmarkService,
    private filtersService: BookmarkFiltersService
  ) { }

  ngOnInit() {
    this.bookmarkService.loadBookmarks();

    combineLatest([
      this.bookmarkService.bookmarks$,
      this.filtersService.filters$
    ]).pipe(
      map(([bookmarks, filters]) => {
        const filtered = bookmarks.filter((book: any) => {
          const searchText = filters.search.text?.toLowerCase() || '';
          const searchKey = filters.search.key.toLowerCase();
          const searchMatch = searchText
            ? book[searchKey]?.toLowerCase().includes(searchText)
            : true;

          const genres = filters.genres || [];
          const genreMatch = genres.length ? genres.find(x => x.code === book.genre.code) : true;

          const rating = filters.rating || 0;
          const ratingMatch = rating ? book.rating === rating : true;

          return searchMatch && genreMatch && ratingMatch;
        });

        return this.groupByRelativeDate(filtered);
      })
    ).subscribe(result => {
      this.bookmarks = result;
      this.bookmarkService.loadingSubject.next(false);
    });

    this.isLoading = this.bookmarkService.loading$;
  }

  editBook(book: Bookmark) {

  }

  deleteBook(book: Bookmark) {

  }

  groupByRelativeDate(bookmarks: Bookmark[]) {
    bookmarks.sort((a, b) =>
      b.created.substring(0, 10).localeCompare(a.created.substring(0, 10)));

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayJustDate = this.onlyDate(today).substring(0, 10);
    const yesterdayJustDate = this.onlyDate(yesterday).substring(0, 10);

    bookmarks.forEach(book => {
      const bookDate = this.onlyDate(book.created);

      if (bookDate === todayJustDate) {
        book.createdKey = 'Today'
      } else if (bookDate === yesterdayJustDate) {
        book.createdKey = 'Yesterday'
      } else {
        book.createdKey = 'Older'
      }
    })
    return bookmarks;
  }

  onlyDate(date: string | Date): string {
    if (date instanceof Date) {
      date = date.toISOString();
    }
    return date.substring(0, 10);
  }
}
