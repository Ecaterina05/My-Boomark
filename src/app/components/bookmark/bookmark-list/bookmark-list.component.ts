import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Bookmark } from '../../../models/bookmark.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../../services/bookmark.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { bookGenres } from '../../../../assets/constants';

@Component({
  selector: 'app-bookmark-list',
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './bookmark-list.component.html',
  styleUrl: './bookmark-list.component.scss',
})
export class BookmarkListComponent {
  bookmarks!: Bookmark[];
  isLoading!: Observable<boolean>;

  genres = bookGenres;

  constructor(private bookmarkService: BookmarkService) { }

  ngOnInit() {
    this.bookmarkService.loadBookmarks();

    this.bookmarkService.bookmarks$.subscribe(result => {
      this.bookmarks = result;
    })
    this.isLoading = this.bookmarkService.loading$;
  }

  editBook(book: Bookmark) {

  }

  deleteBook(book: Bookmark) {

  }
}
