import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PermissionComponent} from './permission.component';
import {DatasourceService} from '../datasource/service/datasource.service';
import {FormsModule} from '@angular/forms';
import {FilterPipe} from '../common/pipe/FilterPipe';
import {MatModuleModule} from '../common/mat-module';
import {PermissionDatapointDailogComponent} from './permission-datapoint-dailog/permission-datapoint-dailog.component';


@NgModule({
  declarations: [PermissionComponent, FilterPipe, PermissionDatapointDailogComponent],
  providers: [DatasourceService],
  exports: [
    PermissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatModuleModule
  ],
  entryComponents: [PermissionDatapointDailogComponent]
})
export class PermissionModule {
}
