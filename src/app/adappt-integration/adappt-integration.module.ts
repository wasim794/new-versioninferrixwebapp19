import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdapptIntegrationComponent} from './adappt-integration.component';
import {AdaptIntegrationRoutingModule} from './adappt-integration.routing.module';
import { MatModuleModule } from '../common/mat-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MqttSettingComponent, ProvisionComponent, UnprovisionComponent, AdapptIntegrationService } from '../adappt-integration';

@NgModule({
  declarations: [AdapptIntegrationComponent , MqttSettingComponent , ProvisionComponent, UnprovisionComponent],
  entryComponents: [
    AdapptIntegrationComponent
  ],
  imports: [
    CommonModule,
    AdaptIntegrationRoutingModule,
    MatModuleModule,
    FlexLayoutModule,
    LayoutModule,
  ],
  providers: [
    AdapptIntegrationService
  ],
})
export class AdapptIntegrationModule { }
