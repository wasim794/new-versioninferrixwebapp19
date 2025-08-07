import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SchedulerComponent} from './scheduler.component';

const routes: Routes = [
  {path: 'list', component: SchedulerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule {
}
