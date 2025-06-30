// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const datasourceRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./datasource-list/datasource-list.component').then(m => m.DatasourceListComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./datasource-list/datasource-list.component').then(m => m.DatasourceListComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];