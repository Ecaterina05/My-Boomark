import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookmarkFormComponent } from './bookmark-form.component';
import { BookmarkService } from '../../../services/bookmark.service';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';
import { Bookmark } from '../../../models/bookmark.model';

describe('BookmarkFormComponent', () => {
  let bookmarkServiceMock: any;
  let routerMock: any;

  const mockBookmark: Bookmark = {
    id: '123',
    title: 'Test Book',
    author: 'Test Author',
    genre: { display: 'Romance', code: 9 },
    notes: 'Some notes',
    rating: 4,
    created: new Date().toISOString()
  };

  beforeEach(async () => {
    bookmarkServiceMock = {
      getBookmarkById: vi.fn().mockReturnValue(of(mockBookmark)),
      addBookmark: vi.fn(),
      updateBookmark: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookmarkFormComponent],
      providers: [
        { provide: BookmarkService, useValue: bookmarkServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null // default: create mode
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize empty form in create mode', () => {
    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.form).toBeDefined();
    expect(component.form.get('title')?.value).toBe('');
  });

  it('should set rating correctly', () => {
    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    component.setRating(5);

    expect(component.rating).toBe(5);
    expect(component.form.get('rating')?.value).toBe(5);
  });

  it('should navigate back on cancel', () => {
    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;

    component.onCancel();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not save if form is invalid', () => {
    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    component.onSave();

    expect(bookmarkServiceMock.addBookmark).not.toHaveBeenCalled();
  });

  it('should add bookmark in create mode when form is valid', () => {
    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    component.form.patchValue({
      title: 'New Book',
      author: 'New Author',
      genre: 9,
      notes: 'Notes',
      rating: 3
    });

    component.onSave();

    expect(bookmarkServiceMock.addBookmark).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should patch form and update in edit mode', async () => {
    // Override ActivatedRoute to simulate edit mode
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          paramMap: {
            get: () => '123'
          }
        }
      }
    });

    const fixture = TestBed.createComponent(BookmarkFormComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();

    expect(bookmarkServiceMock.getBookmarkById).toHaveBeenCalledWith('123');
    expect(component.form.get('title')?.value).toBe('Test Book');

    component.onSave();

    expect(bookmarkServiceMock.updateBookmark).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
