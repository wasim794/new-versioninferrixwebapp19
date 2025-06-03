import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login';

const routes: Routes = [

  {path: '', component: LoginComponent},
  {path: '**', redirectTo: ''}, // default route of the module
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
