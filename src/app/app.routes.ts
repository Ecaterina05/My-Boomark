import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { BookmarkListComponent } from './components/bookmark/bookmark-list/bookmark-list.component';
import { BookmarkFormComponent } from './components/bookmark/bookmark-form/bookmark-form.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: BookmarkListComponent },
      { path: 'bookmarks/new', component: BookmarkFormComponent },
      { path: 'bookmarks/edit/:id', component: BookmarkFormComponent }
    ]
  }
];

