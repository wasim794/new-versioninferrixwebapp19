// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./users-list/users-list.component').then(m => m.UsersListComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./users-list/users-list.component').then(m => m.UsersListComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];