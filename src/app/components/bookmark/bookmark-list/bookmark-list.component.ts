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
import Fuse from 'fuse.js';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bookmark-list',
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './bookmark-list.component.html',
  styleUrl: './bookmark-list.component.scss',
})
export class BookmarkListComponent {
  bookmarks!: Observable<Bookmark[]>;
  isLoading!: Observable<boolean>;

  constructor(
    private bookmarkService: BookmarkService,
    private filtersService: BookmarkFiltersService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.bookmarkService.loadBookmarks();

    this.bookmarks = combineLatest([
      this.bookmarkService.bookmarks$,
      this.filtersService.filters$
    ]).pipe(
      map(([bookmarks, filters]) => {
        let searched: Bookmark[] = bookmarks;

        const searchText = filters.search.text?.trim();
        if (searchText) {
          const fuse = new Fuse(bookmarks, {
            keys: [filters.search.key],
            threshold: 0.35,
            ignoreLocation: true,
          });

          searched = fuse.search(searchText).map(r => r.item);
        }

        const filtered = searched.filter((book: any) => {
          const genres = filters.genres || [];
          const genreMatch = genres.length ? genres.find(x => x.code === book.genre.code): true;

          const rating = filters.rating || 0;
          const ratingMatch = rating ? book.rating === rating : true;

          return genreMatch && ratingMatch;
        });

        return this.groupByRelativeDate(filtered);
      })
    );

    this.isLoading = this.bookmarkService.loading$;
  }

  editBook(book: Bookmark) {

  }

  deleteBook(book: Bookmark) {
    if (!book.id) return;

    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Bookmark',
        message: `Are you sure you want to delete "${book.title + ' by ' + book.author}"?`
      }
    }).afterClosed().subscribe(result => {
      if (result && book.id) this.bookmarkService.deleteBookmark(book.id);
    });
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
