import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { Bookmark } from '../models/bookmark.model';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private bookmarksSubject = new BehaviorSubject<Bookmark[]>([]);
  bookmarks$ = this.bookmarksSubject.asObservable();

  public loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private apiUrl = 'http://localhost:3000/bookmarks';

  constructor(private http: HttpClient) {}

  loadBookmarks() {
    this.loadingSubject.next(true);
    this.http.get<Bookmark[]>(this.apiUrl).pipe(
      delay(500),
      tap(bookmarks => {
        this.bookmarksSubject.next(bookmarks);
      }),
      catchError(err => {
        console.error(err);
        this.loadingSubject.next(false);
        return of([]);
      })
    ).subscribe();
  }

  addBookmark(bookmark: Bookmark) {
    this.http.post<Bookmark>(this.apiUrl, bookmark).pipe(
      tap(newBookmark => {
        const current = this.bookmarksSubject.value;
        this.bookmarksSubject.next([...current, newBookmark]);
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    ).subscribe();
  }

  updateBookmark(bookmark: Bookmark) {
    this.http.put<Bookmark>(`${this.apiUrl}/${bookmark.id}`, bookmark).pipe(
      tap(updated => {
        const current = this.bookmarksSubject.value.map(b =>
          b.id === updated.id ? updated : b
        );
        this.bookmarksSubject.next(current);
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    ).subscribe();
  }

  deleteBookmark(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.bookmarksSubject.value.filter(b => b.id !== id);
        this.bookmarksSubject.next(current);
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    ).subscribe();
  }
}
