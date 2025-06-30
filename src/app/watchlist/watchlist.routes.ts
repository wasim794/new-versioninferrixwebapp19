// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const watchlistRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./watchlist-list/watchlist-list.component').then(m => m.WatchlistListComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./watchlist-list/watchlist-list.component').then(m => m.WatchlistListComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];