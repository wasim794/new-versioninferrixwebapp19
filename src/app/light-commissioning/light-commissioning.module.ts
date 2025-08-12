import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import {MatModuleModule} from '../common/mat-module';
import {LightCommissioningRoutingModule} from './light-commissioning-routing.module';
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
  ProfilepushsystemComponent,
  RelayControllerProfileComponent,
  WristBandControllerNodeSettingComponent,
  VirtualSwitchFormComponent,
  RelayControllerNodeSettingComponent,
  SettingSwitchFormComponent
} from './pages';
import {
  BandSettingsComponent,
  GpioSettingsComponent,
  HoldTimeOneComponent,
  HoldTimeOneRelayComponent,
  HoldTimeTwoComponent,
  LuxFormComponent,
  PirFormComponent,
  SwitchFormComponent,
} from './components';
import { RetransmissionpSettingsComponent } from './components/retransmissionp-settings/retransmissionp-settings.component';

@NgModule({
  declarations: [
    LightCommissioningComponent,
    ProfilesComponent,
    CommissionedNodesComponent,
    DiscoveredNodesComponent,
    LedControllerProfileComponent,
    LuxFormComponent,
    PirFormComponent,
    SwitchFormComponent,
    ReadCommissionedNodeSettingsComponent,
    BandSettingsComponent,
    GpioSettingsComponent,
    DigitalInputControllerProfileComponent,
    FilterProfileComponent,
    FilterNodesComponent,
    GradeMappingSettingsComponent,
    DiControllerNodeSettingsComponent,
    RelayControllerProfileComponent,
    HoldTimeOneComponent,
    HoldTimeTwoComponent,
    WristbandComponent,
    WristBandControllerNodeSettingComponent,
    RelayControllerNodeSettingComponent,
    HoldTimeOneRelayComponent,
    VirtualSwitchComponent,
    VirtualSwitchFormComponent,
    SettingSwitchFormComponent,
    SettingsComponent,
    ProfilepushsystemComponent,
    RetransmissionpSettingsComponent

  ],
  entryComponents: [SettingSwitchFormComponent, ProfilepushsystemComponent],
  imports: [
    LightCommissioningRoutingModule,
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatModuleModule,
  ]

})
export class LightCommissioningModule {
}
