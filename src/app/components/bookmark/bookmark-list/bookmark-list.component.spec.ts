import { TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { BookmarkListComponent } from './bookmark-list.component';
import { BookmarkService } from '../../../services/bookmark.service';
import { BookmarkFiltersService } from '../../../services/bookmark-filters.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { Bookmark } from '../../../models/bookmark.model';

describe('BookmarkListComponent', () => {
  let bookmarkServiceMock: any;
  let filtersServiceMock: any;
  let dialogMock: any;
  let routerMock: any;

  const mockBookmarks: Bookmark[] = [
    {
      id: '1',
      title: 'Book A',
      author: 'Author A',
      rating: 3,
      genre: { display: 'Romance', code: 9 },
      notes: 'Notes',
      created: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    bookmarkServiceMock = {
      loadBookmarks: vi.fn(),
      bookmarks$: new BehaviorSubject<Bookmark[]>(mockBookmarks),
      loading$: of(false),
      deleteBookmark: vi.fn()
    };

    filtersServiceMock = {
      filters$: of({
        search: { key: 'title', text: '' },
        genres: [],
        rating: 0
      })
    };

    dialogMock = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(true)
      })
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookmarkListComponent],
      providers: [
        { provide: BookmarkService, useValue: bookmarkServiceMock },
        { provide: BookmarkFiltersService, useValue: filtersServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BookmarkListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call loadBookmarks on init', () => {
    const fixture = TestBed.createComponent(BookmarkListComponent);
    fixture.componentInstance.ngOnInit();

    expect(bookmarkServiceMock.loadBookmarks).toHaveBeenCalled();
  });

  it('should navigate to edit page', () => {
    const fixture = TestBed.createComponent(BookmarkListComponent);
    const component = fixture.componentInstance;

    component.editBook(mockBookmarks[0]);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/bookmarks/edit', '1']);
  });

  it('should open dialog and delete when confirmed', () => {
    const fixture = TestBed.createComponent(BookmarkListComponent);
    const component = fixture.componentInstance;

    component.deleteBook(mockBookmarks[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(bookmarkServiceMock.deleteBookmark).toHaveBeenCalledWith('1');
  });

  it('should not delete when dialog is cancelled', async () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false)
    });

    const fixture = TestBed.createComponent(BookmarkListComponent);
    const component = fixture.componentInstance;

    component.deleteBook(mockBookmarks[0]);

    expect(bookmarkServiceMock.deleteBookmark).not.toHaveBeenCalled();
  });

  it('should group bookmarks by date', () => {
    const fixture = TestBed.createComponent(BookmarkListComponent);
    const component = fixture.componentInstance;

    const result = component.groupByRelativeDate([...mockBookmarks]);

    expect(result[0].createdKey).toBeDefined();
  });

  it('should return only date string', () => {
    const fixture = TestBed.createComponent(BookmarkListComponent);
    const component = fixture.componentInstance;

    const date = component.onlyDate(new Date());

    expect(date.length).toBe(10);
  });
});
