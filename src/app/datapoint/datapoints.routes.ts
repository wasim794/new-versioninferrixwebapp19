// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const datapointsRoutes: Routes = [
  {
    path: 'detail', // Matches /datasource
    loadComponent: () => import('./datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
  },
];