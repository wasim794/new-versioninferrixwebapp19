// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
  {
    path: '', // Matches /events
    loadComponent: () => import('./event-management/event-mangement.component').then(m => m.EventMangementComponent),
    children: [
      { path: '', redirectTo: 'management', pathMatch: 'full' }, // Default to list
      {
        path: 'management', // Matches /events
        loadComponent: () => import('./event-management/event-mangement.component').then(m => m.EventMangementComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];