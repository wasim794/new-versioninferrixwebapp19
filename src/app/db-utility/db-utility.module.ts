import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DbUtilityComponent} from './db-utility.component';
import {MatModuleModule} from '../common/mat-module';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [DbUtilityComponent],
    imports: [
        CommonModule,
        MatModuleModule,
        FormsModule,
        MatProgressSpinnerModule,
    ],
  entryComponents: [DbUtilityComponent]
})
export class DbUtilityModule {
}
