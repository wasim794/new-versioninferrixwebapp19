import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ProvisionComponent, UnprovisionComponent } from '../adappt-integration';
const routes: Routes = [
    {path: 'adapt/provision', component: ProvisionComponent},
    {path: 'adapt/un-provision', component: UnprovisionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdaptIntegrationRoutingModule {
}
