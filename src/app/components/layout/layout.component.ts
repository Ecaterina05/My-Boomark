import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { bookGenres } from '../../../assets/constants';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { BookmarkFiltersService } from '../../services/bookmark-filters.service';
import { Genre } from '../../models/bookmark.model';

@Component({
  selector: 'app-layout-component',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInput,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatSlideToggleModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  searchBy: string = 'author';
  searchText: string = '';
  searchPlaceholder: string = '';

  genres = bookGenres;
  selectedGenres: Genre[] = [];

  myRating = false;

  rating = 0;
  hoverRating = 0

  constructor(private filtersService: BookmarkFiltersService) { }

  ngOnInit() {
    this.onSelectSearchBy();
  }

  onSelectSearchBy() {
    this.searchPlaceholder = 'Search ' + this.searchBy + '...';
    this.onSearch();
  }

  onSearch() {
    const current = this.filtersService.getFilters();
    this.filtersService.setFilters({
      ...current,
      search: { key: this.searchBy, text: this.searchText }
    });
  }

  onSelectGenres() {
    const current = this.filtersService.getFilters();
    this.filtersService.setFilters({
      ...current,
      genres: this.selectedGenres
    });
  }

  onToggleChange() {
    if (!this.myRating) {
      this.rating = 0;
      this.setRating(this.rating);
    }
  }

  setRating(value: number) {
    this.rating = this.rating === value ? 0 : value;

    const current = this.filtersService.getFilters();
    this.filtersService.setFilters({
      ...current,
      rating: value
    });
  }
}
