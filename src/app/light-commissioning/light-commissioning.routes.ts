// import {NgModule} from '@angular/core';
// import {CommonModule} from '@angular/common';
// import {LayoutModule} from '@angular/cdk/layout';
// import {FlexLayoutModule} from '@angular/flex-layout';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {MatSortModule} from '@angular/material/sort';
// import {MatModuleModule} from '../common/mat-module';
// import {LightCommissioningRoutingModule} from './light-commissioning-routing.module';
// import {LightCommissioningComponent} from './light-commissioning.component';
// import {
//   CommissionedNodesComponent,
//   DiControllerNodeSettingsComponent,
//   DigitalInputControllerProfileComponent,
//   DiscoveredNodesComponent,
//   FilterNodesComponent,
//   FilterProfileComponent,
//   GradeMappingSettingsComponent,
//   LedControllerProfileComponent,
//   ProfilesComponent,
//   ReadCommissionedNodeSettingsComponent,
//   SettingsComponent,
//   VirtualSwitchComponent,
//   WristbandComponent,
//   ProfilepushsystemComponent,
//   RelayControllerProfileComponent,
//   WristBandControllerNodeSettingComponent,
//   VirtualSwitchFormComponent,
//   RelayControllerNodeSettingComponent,
//   SettingSwitchFormComponent
// } from './pages';
// import {
//   BandSettingsComponent,
//   GpioSettingsComponent,
//   HoldTimeOneComponent,
//   HoldTimeOneRelayComponent,
//   HoldTimeTwoComponent,
//   LuxFormComponent,
//   PirFormComponent,
//   SwitchFormComponent,
// } from './components';
// import { RetransmissionpSettingsComponent } from './components/retransmissionp-settings/retransmissionp-settings.component';

// @NgModule({
//   declarations: [
//     LightCommissioningComponent,
//     ProfilesComponent,
//     CommissionedNodesComponent,
//     DiscoveredNodesComponent,
//     LedControllerProfileComponent,
//     LuxFormComponent,
//     PirFormComponent,
//     SwitchFormComponent,
//     ReadCommissionedNodeSettingsComponent,
//     BandSettingsComponent,
//     GpioSettingsComponent,
//     DigitalInputControllerProfileComponent,
//     FilterProfileComponent,
//     FilterNodesComponent,
//     GradeMappingSettingsComponent,
//     DiControllerNodeSettingsComponent,
//     RelayControllerProfileComponent,
//     HoldTimeOneComponent,
//     HoldTimeTwoComponent,
//     WristbandComponent,
//     WristBandControllerNodeSettingComponent,
//     RelayControllerNodeSettingComponent,
//     HoldTimeOneRelayComponent,
//     VirtualSwitchComponent,
//     VirtualSwitchFormComponent,
//     SettingSwitchFormComponent,
//     SettingsComponent,
//     ProfilepushsystemComponent,
//     RetransmissionpSettingsComponent

//   ],
//   entryComponents: [SettingSwitchFormComponent, ProfilepushsystemComponent],
//   imports: [
//     LightCommissioningRoutingModule,
//     CommonModule,
//     LayoutModule,
//     FlexLayoutModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatSortModule,
//     MatModuleModule,
//   ]

// })
// export class LightCommissioningModule {
// }



import { Routes } from '@angular/router';

export const lightCommissioningRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./light-commissioning.component').then(m => m.LightCommissioningComponent),
    children: [
      { path: '', redirectTo: 'commissioning', pathMatch: 'full' }, // Default to list
      {
        path: 'commissioning', // Matches /datasource/list
        loadComponent: () => import('./light-commissioning.component').then(m => m.LightCommissioningComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
  {
    path: 'profiles',
    loadComponent: () => import('./pages/profiles/profiles.component').then(m => m.ProfilesComponent),
  },
  {
    path: 'commissioned-nodes',
    loadComponent: () => import('./pages/commissioned-nodes/commissioned-nodes.component').then(m => m.CommissionedNodesComponent),
  },
  {
    path: 'discovered-nodes',
    loadComponent: () => import('./pages/discovered-nodes/discovered-nodes.component').then(m => m.DiscoveredNodesComponent),
  },
    {
    path: 'led-controller-profile',
    loadComponent: () => import('./pages/led-controller-profile/led-controller-profile.component').then(m => m.LedControllerProfileComponent),
    },
     {
      path: 'relay-controller-profile',
      loadComponent: () => import('./pages/relay-controller-profile/relay-controller-profile.component').then(m => m.RelayControllerProfileComponent),
     },
     {
      path: 'digital-input-controller-profile',
      loadComponent: () => import('./pages/digital-input-controller-profile/digital-input-controller-profile.component').then(m => m.DigitalInputControllerProfileComponent),
     },
     {
      path: 'filter-profile',
      loadComponent: () => import('./pages/filter-profile/filter-profile.component').then(m => m.FilterProfileComponent),
     },
     {
      path: 'filter-node',
      loadComponent: () => import('./pages/filter-nodes/filter-nodes.component').then(m => m.FilterNodesComponent),
     },
     {
      path: 'grade-mapping',
      loadComponent: () => import('./pages/grade-mapping-settings/grade-mapping-settings.component').then(m => m.GradeMappingSettingsComponent),
     },
     {
      path: 'read-node-details',
      loadComponent: () => import('./pages/led-controller-node-settings/led-controller-node-settings.component').then(m => m.ReadCommissionedNodeSettingsComponent),
     },
     {
      path: 'relay-node-details',
      loadComponent: () => import('./pages/relay-controller-node-setting/relay-controller-node-setting.component').then(m => m.RelayControllerNodeSettingComponent),
     },
     {
      path: 'digital-input-controller-node-details',
      loadComponent: () => import('./pages/di-controller-node-settings/di-controller-node-settings.component').then(m => m.DiControllerNodeSettingsComponent),
     },
     {
      path: 'wrist-band-controller-node-details',
      loadComponent: () => import('./pages/wrist-band-controller-node-setting/wrist-band-controller-node-setting.component').then(m => m.WristBandControllerNodeSettingComponent),
     }, 
     {
     path: 'wristband',
      loadComponent: () => import('./pages/wristband/wristband.component').then(m => m.WristbandComponent),
      },
    {
      path: 'virtual-switch',
      loadComponent: () => import('./pages/virtual-switch/virtual-switch.component').then(m => m.VirtualSwitchComponent),
    },
    {
      path: 'settings',
      loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    },

    {
      path: 'hold-time-one',
      loadComponent: () => import('./components/hold-time-one/hold-time-one.component').then(m => m.HoldTimeOneComponent),
    },
    {
      path: 'hold-time-one-relay',
      loadComponent: () => import('./components/hold-time-one-relay/hold-time-one-relay.component').then(m => m.HoldTimeOneRelayComponent),
    },
    {
      path: 'gpio-settings',
      loadComponent: () => import('./components/gpio-settings/gpio-settings.component').then(m => m.GpioSettingsComponent),
    },
    {
      path: 'band-settings',
      loadComponent: () => import('./components/band-settings/band-settings.component').then(m => m.BandSettingsComponent),
    }
];