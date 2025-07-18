import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventMangementComponent} from '../event-management/event-management';
import {EventManagementRoutingModule} from '../event-management/event-management-routing.module';
import {MatModuleModule} from '../common/mat-module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LayoutModule} from '@angular/cdk/layout';
import {SearchEventComponent} from '../event/search-event/search-event.component';

@NgModule({
  declarations: [EventMangementComponent],
  imports: [
    CommonModule,
    EventManagementRoutingModule,
    MatModuleModule,
    FlexLayoutModule,
    LayoutModule
  ]
})
export class EventManagementModule {
}
