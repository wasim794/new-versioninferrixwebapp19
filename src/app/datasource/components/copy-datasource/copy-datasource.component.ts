import {Component, Inject, OnInit, EventEmitter, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CopyDataSourceModel} from '../../../core/models/dataSource';
import {DataSourceService} from '../../../core/services';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  providers: [DataSourceService, CommonService],
  imports: [CommonModule, MatModuleModule],
  selector: 'app-copy-datasource',
  templateUrl: './copy-datasource.component.html',
  styleUrls: []
})
export class CopyDatasourceComponent implements OnInit {
  model!: CopyDataSourceModel;
  xid: any;
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  copyName:any;
  UIDICTIONARY : any;

  constructor(
    public dialogRef: MatDialogRef<CopyDatasourceComponent>, public dictionaryService: DictionaryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: DataSourceService,
    private _commonService: CommonService
  ) {
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.model = this.data.alldata;
    this.xid = this.data.alldata.xid;
    this.copyName = this.data.alldata.name;
  }

  saveCopyData(xid: any) {
    let param = '';
    if (this.copyName) {
      param = param + 'copyName=' + this.copyName;
    }
    if (this.model.points) {
      param = param + '&copyPoints=' + this.model.points;
    }
    if (this.model.enabled) {
      param = param + '&enabled=' + this.model.enabled;
    }

    this._service.copy(xid, param).subscribe((data) => {

      this._commonService.notification(
        'Copy Datasource ' + this.model.name + ' ' + this.saveSuccess
      );
      this.dialogRef.close('close');

    },error => {
      error.result.message.forEach((value:any)=>{
        this._commonService.notification(value.message)

        return;

      })
    });
  }

}
