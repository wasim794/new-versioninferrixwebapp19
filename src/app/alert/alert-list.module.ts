import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertListRoutingModule} from './alert-list-routing.module';
import {AlertEditComponent, AlertListComponent} from '../alert';
import {FormsModule} from '@angular/forms';
import {UsersService} from '../users/service';
import {LayoutModule} from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatModuleModule} from '../common/mat-module';

@NgModule({
  declarations: [AlertListComponent, AlertEditComponent],
  imports: [AlertListRoutingModule,
    CommonModule, FormsModule, MatModuleModule,
    LayoutModule, FlexLayoutModule
  ],
  entryComponents: [AlertEditComponent],
  providers: [
    UsersService
  ],
})
export class AlertListModule {
}
