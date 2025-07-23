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
    path: 'events',
    canActivate: [AuthGuard],
    loadChildren: () => import('./event/event.routes').then(m => m.eventRoutes),
  },

{
    path: 'event',
    canActivate: [AuthGuard],
    loadChildren: () => import('./event-management/eventmaanagment.routes').then(m => m.eventsRoutes),
  },
  {
    path: 'event-handler',
    canActivate: [AuthGuard],
    loadChildren: () => import('./events/handlers/eventshandler.routes').then(m => m.eventsHandlerRoutes),
  },

  {
    path: 'datapoint',
    canActivate: [AuthGuard],
    loadChildren: () => import('./datapoint/datapoints.routes').then(m => m.datapointsRoutes),
  },
  
  
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () => import('./users/user.routes').then(m => m.usersRoutes),
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


  {
    path: 'publisher',
    canActivate: [AuthGuard],
    loadChildren: () => import('./publisher/publisher-routes').then(m => m.publisherRoutes),
  },

  {
    path: 'mesh-console',
    canActivate: [AuthGuard],
    loadChildren: () => import('./mesh-console/mesh-console-routes').then(m => m.meshConsoleRoutes),
  },

  
  
  

    
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // ... other routes
];