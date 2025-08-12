import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LightCommissioningComponent} from './light-commissioning.component';
import {
  CommissionedNodesComponent,
  DiControllerNodeSettingsComponent,
  DigitalInputControllerProfileComponent,
  DiscoveredNodesComponent,
  FilterNodesComponent,
  FilterProfileComponent,
  GradeMappingSettingsComponent,
  LedControllerProfileComponent,
  ProfilesComponent,
  ReadCommissionedNodeSettingsComponent,
  SettingsComponent,
  VirtualSwitchComponent,
  WristbandComponent,
  RelayControllerProfileComponent,
  WristBandControllerNodeSettingComponent,
  RelayControllerNodeSettingComponent
} from './pages';
// import {RelayControllerProfileComponent} from './pages/relay-controller-profile/relay-controller-profile.component';
// import {
//   WristBandControllerNodeSettingComponent
// } from './pages/wrist-band-controller-node-setting/wrist-band-controller-node-setting.component';
// import {
//   RelayControllerNodeSettingComponent
// } from './pages/relay-controller-node-setting/relay-controller-node-setting.component';

const routes: Routes = [
  {path: 'commissioning', component: LightCommissioningComponent},
  {path: 'profiles', component: ProfilesComponent},
  {path: 'commissioned-nodes', component: CommissionedNodesComponent},
  {path: 'discovered-nodes', component: DiscoveredNodesComponent},
  {path: 'led-controller-profile', component: LedControllerProfileComponent},
  {path: 'relay-controller-profile', component: RelayControllerProfileComponent},
  {path: 'digital-input-controller-profile', component: DigitalInputControllerProfileComponent},
  {path: 'filter-profile', component: FilterProfileComponent},
  {path: 'filter-node', component: FilterNodesComponent},
  {path: 'read-node-details', component: ReadCommissionedNodeSettingsComponent},
  {path: 'relay-node-details', component: RelayControllerNodeSettingComponent},
  {path: 'digital-input-controller-node-details', component: DiControllerNodeSettingsComponent},
  {path: 'wrist-band-controller-node-details', component: WristBandControllerNodeSettingComponent},
  {path: 'grade-mapping', component: GradeMappingSettingsComponent},
  {path: 'wristband', component: WristbandComponent},
  {path: 'virtual-switch', component: VirtualSwitchComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class LightCommissioningRoutingModule {
}
