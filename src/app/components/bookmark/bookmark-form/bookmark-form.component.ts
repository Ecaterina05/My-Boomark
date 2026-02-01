import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { bookGenres } from '../../../../assets/constants';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Bookmark } from '../../../models/bookmark.model';
import { BookmarkService } from '../../../services/bookmark.service';

@Component({
  selector: 'app-bookmark-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './bookmark-form.component.html',
  styleUrl: './bookmark-form.component.scss',
})
export class BookmarkFormComponent implements OnInit {
  bookmarkId!: string | null;
  form!: FormGroup;

  genreFilterCtrl = new FormControl('');
  bookGenres = bookGenres;

  rating = 0;
  hoverRating = 0;

  selectedBookmark!: Bookmark;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private bookmarkService: BookmarkService,
    private router: Router
  ) { }

  ngOnInit() {
    this.bookmarkId = this.route.snapshot.paramMap.get('id');

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: [null, Validators.required],
      notes: [''],
      rating: [0]
    });

    if (this.bookmarkId) {
      this.bookmarkService.getBookmarkById(this.bookmarkId).subscribe(selectedBookmark => {
        if (selectedBookmark) {
          this.selectedBookmark = selectedBookmark;
          this.form.patchValue({
            title: selectedBookmark.title,
            author: selectedBookmark.author,
            genre: selectedBookmark.genre.code,
            notes: selectedBookmark.notes
          });
          this.setRating(selectedBookmark.rating);
        }
      });
    }
  }

  setRating(star: number) {
    this.rating = star;
    this.form.get('rating')?.setValue(star);
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const selectedGenre = this.bookGenres.find(g => g.code === this.form.value.genre);

    const bookmark: Bookmark = {
      title: this.form.value.title,
      author: this.form.value.author,
      genre: selectedGenre!,
      notes: this.form.value.notes,
      rating: this.form.value.rating,
      created: this.selectedBookmark?.created || (new Date()).toISOString()
    };

    if (this.bookmarkId) {
      bookmark.id = this.bookmarkId;
      this.bookmarkService.updateBookmark(bookmark);
    } else {
      this.bookmarkService.addBookmark(bookmark);
    }

    this.router.navigate(['/']);
  }
}
