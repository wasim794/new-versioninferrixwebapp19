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
  
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadComponent: () => import('./users/users-list/users-list.component').then(m => m.UsersListComponent),
    children: [
      { path: 'list',
        loadComponent: () => import('./users/users-list/users-list.component').then(m => m.UsersListComponent), }
    ],
  },
  {
    path: 'stack-monitor',
    canActivate: [AuthGuard],
    loadComponent: () => import('./stack-monitor/stack-monitor.component').then(m => m.StackMonitorComponent),
    children: [
      { path: 'detail',
        loadComponent: () => import('./stack-monitor/stack-monitor.component').then(m => m.StackMonitorComponent), }
    ],
  },

  {
    path: 'device-management',
    canActivate: [AuthGuard],
    loadComponent: () => import('./device-management-system/device-management-system.component').then(m => m.DeviceManagementSystemComponent),
  },

  {
    path: 'datapoint',
    canActivate: [AuthGuard],
    loadComponent: () => import('./datasource/components/common/datapoint-properties/datapoint-properties.component').then(m => m.DatapointPropertiesComponent),
    children: [
      { path: 'detail',
        loadComponent: () => import('./datasource/components/common/datapoint-properties/datapoint-properties.component').then(m => m.DatapointPropertiesComponent), }
    ],
  },
  

    
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // ... other routes
];