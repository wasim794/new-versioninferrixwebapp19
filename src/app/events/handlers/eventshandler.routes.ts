// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const eventsHandlerRoutes: Routes = [
  {
    path: '', // Matches /events
    loadComponent: () => import('./event-handler/event-handler.component').then(m => m.EventHandlerComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /events
        loadComponent: () => import('./event-handler/event-handler.component').then(m => m.EventHandlerComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];