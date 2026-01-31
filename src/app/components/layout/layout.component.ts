import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { bookGenres } from '../../../assets/constants';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';

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
  selectedGenres: any[] = [];

  myRating = false;

  filters: any = new BehaviorSubject<any>({
    search: {
      key: '',
      text: ''
    },
    genres : [],
    rating : 0
  });

  rating = 0;
  hoverRating = 0

  ngOnInit() {
    this.onSelectSearchBy();
  }

  onSelectSearchBy() {
    this.searchPlaceholder = 'Search ' + this.searchBy + '...';
  }

  onSearch() {
    this.filters.getValue().search = {
      key: this.searchBy,
      text: this.searchText
    }
  }

  onSelectGenres() {
    this.filters.getValue().genres = this.selectedGenres;
  }

  onToggleChange() {
    if (!this.myRating) {
      this.rating = 0;
    }
  }

  setRating(value: number) {
    this.rating = this.rating === value ? 0 : value;
    this.filters.getValue().rating = this.rating;
  }
}
