import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventHandlerRoutingModule} from './event-handler-routing.module';
import {EventHandlerComponent} from './event-handler/event-handler.component';
import {EmailComponent} from './handler-type';
import {ProcessComponent} from './handler-type';
import {SmsComponent} from './handler-type';
import {SetPointComponent} from './handler-type';
import {FormsModule} from '@angular/forms';
import {UsersService} from '../../users/service';
import {BasicFormComponent} from './common';
import {TreeModule} from 'angular-tree-component';
import {LayoutModule} from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EventTypeTreeViewComponent} from './common';
import {MatModuleModule} from '../../common/mat-module';
import {EventHandlerEditComponent} from './event-handler/event-handler-edit/event-handler-edit.component';
import {MatTreeModule} from '@angular/material/tree';

@NgModule({
  declarations: [
    EventHandlerComponent,
    EmailComponent,
    ProcessComponent,
    SmsComponent,
    SetPointComponent,
    BasicFormComponent,
    EventTypeTreeViewComponent,
    EventHandlerEditComponent
  ],
  imports: [
    CommonModule,
    EventHandlerRoutingModule,
    FormsModule,
    TreeModule.forRoot(),
    MatModuleModule,
    LayoutModule,
    FlexLayoutModule,
    MatTreeModule,
  ],
  entryComponents: [EmailComponent, ProcessComponent, SetPointComponent, SmsComponent],
  providers: [
    UsersService
  ],
})
export class EventHandlerModule {
}
