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
    loadChildren:() => import('./watchlist/watchlist.routes').then(m => m.watchlistRoutes),
  },

  {
    path: 'datasource',
    canActivate: [AuthGuard],
    loadChildren: () => import('./datasource/datasource.routes').then(m => m.datasourceRoutes),
  },
  {
    path: 'datapoint',
    canActivate: [AuthGuard],
    loadChildren: () => import('./datapoint/datapoints.routes').then(m => m.datapointsRoutes),
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
    loadChildren: () => import('./stack-monitor/stackmonitor.routes').then(m => m.stackmonitorRoutes),
  },

  {
    path: 'device-management',
    canActivate: [AuthGuard],
    loadComponent: () => import('./device-management-system/device-management-system.component').then(m => m.DeviceManagementSystemComponent),
  },

  
  

    
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // ... other routes
];