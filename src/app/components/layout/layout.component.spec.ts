import { TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { BookmarkFiltersService } from '../../services/bookmark-filters.service';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('LayoutComponent', () => {
  let filtersServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    filtersServiceMock = {
      getFilters: vi.fn().mockReturnValue({
        search: { key: 'author', text: '' },
        genres: [],
        rating: 0
      }),
      setFilters: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: BookmarkFiltersService, useValue: filtersServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set placeholder on init', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;

    component.searchBy = 'author';
    component.ngOnInit();

    expect(component.searchPlaceholder).toBe('Search author...');
  });

  it('should call setFilters when searching', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;

    component.searchBy = 'title';
    component.searchText = 'Harry';
    component.onSearch();

    expect(filtersServiceMock.setFilters).toHaveBeenCalled();
  });

  it('should update genres in filters when selecting genres', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;

    component.selectedGenres = [{ display: 'Romance', code: 1 }];
    component.onSelectGenres();

    expect(filtersServiceMock.setFilters).toHaveBeenCalled();
  });

  it('should reset rating when toggle is off', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;

    component.myRating = false;
    component.rating = 3;

    component.onToggleChange();

    expect(component.rating).toBe(0);
  });

  it('should set rating and update filters', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;

    component.setRating(4);

    expect(component.rating).toBe(4);
    expect(filtersServiceMock.setFilters).toHaveBeenCalled();
  });

  it('should navigate to add bookmark page', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const component = fixture.componentInstance;

    component.onBookmarkAdd();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/bookmarks/new']);
  });
});
