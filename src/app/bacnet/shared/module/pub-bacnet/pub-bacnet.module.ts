import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BacnetSenderComponent} from '../../../pages/publisher/bacnet-sender/bacnet-sender.component';
import {MatModuleModule} from '../../../../common/mat-module';

@NgModule({
    imports: [
        CommonModule,
        MatModuleModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class PubBacnetModule { }
