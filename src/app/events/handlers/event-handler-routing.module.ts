import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventHandlerComponent} from './event-handler/event-handler.component';

const routes: Routes = [
  {path: 'list', component: EventHandlerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class EventHandlerRoutingModule {
}
