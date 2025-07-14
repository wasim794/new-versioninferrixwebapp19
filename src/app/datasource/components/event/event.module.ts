import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EventRoutingModule} from './event-routing.module';
import {EventsListComponent} from './events-list/events-list.component';
import {MatModuleModule} from '../common/mat-module';
import {SearchEventComponent} from './search-event/search-event.component';

@NgModule({
  declarations: [EventsListComponent, SearchEventComponent],
  entryComponents: [SearchEventComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModuleModule
  ]
})
export class EventModule {
}
