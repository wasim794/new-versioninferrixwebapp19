import { Routes } from '@angular/router';
import { Route } from '@angular/router'; // Import Route
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login.component').then(mod => mod.LoginComponent),
  },

   {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'watchlist',
    canActivate: [AuthGuard],
    loadComponent: () => import('./watchlist/watchlist-list/watchlist-list.component').then(m => m.WatchlistListComponent),
    children: [
      { path: 'list',
        loadComponent: () => import('./watchlist/watchlist-list/watchlist-list.component').then(m => m.WatchlistListComponent), }
    ],
  },

  {
    path: 'datasource',
    canActivate: [AuthGuard],
    loadComponent: () => import('./datasource/datasource-list/datasource-list.component').then(m => m.DatasourceListComponent),
    children: [
      { path: 'list',
        loadComponent: () => import('./datasource/datasource-list/datasource-list.component').then(m => m.DatasourceListComponent), }
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // ... other routes
];