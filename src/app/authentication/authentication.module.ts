import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationRoutingModule} from './authentication-routing.module';
import {LoginComponent} from './login';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "./service";
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule
  ],
  declarations: [
   
  ],
  providers: [
    AuthenticationService
  ]
})
export class AuthenticationModule {
}
