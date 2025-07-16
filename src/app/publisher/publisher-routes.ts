// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const publisherRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./publisher-list/publisher-list.component').then(m => m.PublisherListComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./publisher-list/publisher-list.component').then(m => m.PublisherListComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];