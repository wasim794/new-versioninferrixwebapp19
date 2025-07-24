import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AlertListComponent} from '../alert';

const routes: Routes = [
  {path: 'list', component: AlertListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertListRoutingModule {
}
