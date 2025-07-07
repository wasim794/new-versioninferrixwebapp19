import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {CommonService} from '../../../../services/common.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import { DataPointService, DictionaryService } from '../../../../core/services';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';


@Component({
  standalone: true,
  providers: [DictionaryService, CommonService, DataPointService],
  imports: [CommonModule, MatModuleModule],
  selector: 'app-meta-data-point',
  templateUrl: './scripting-dialog.component.html',
  styleUrls: []
})
export class ScriptingDialogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(MatTable) table!       : MatTable<any>;
  dataPointsTableColumns           : string[] = ['Name', 'Update', 'action'];
  dataSource                       : any = [];
  xid!                              : string;
  variableName!                     : string;
  contextUpdate!                    : boolean;
  public scriptingDatasourcemodels: any = [];
  visibles!                         : boolean;
  edits!                            : boolean;
  public name!                      : string;
  UIDICTIONARY                     : any;

  constructor(
    public dialogRef                    : MatDialogRef<ScriptingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _commonService              : CommonService,
    private _dataPointService           : DataPointService,
    public dictionaryService            : DictionaryService,
    private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.getDictionaryUI();
    this.xid = this.data.datapointValue;
    this.dataSource = this.data.allDataPoints;
    this.data.action=='view'?this.visibles = false:this.visibles=true;
    this.getDataPointByID(this.xid);
  }

  getDictionaryUI(){
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }
  getDataPointByID(xid: any){
    this.subs.add(this._dataPointService.getByXid(xid).subscribe(data=>{
    this.name = data.extendedName;
    }));
  }

  savePublish() {
    const newObj = {
      xid: this.xid,
      variableName: this.variableName,
      contextUpdate: this.contextUpdate
    };

    if (!this.dataSource) {
    this.dataSource = [];
    this.dialogRef.close(this.dataSource);
    }
    this.scriptingDatasourcemodels.push(newObj);
    if (!this.dataSource) {
    this.dataSource = [];
    }
    const randomElementIndex = Math.floor(Math.random() * this.scriptingDatasourcemodels.length);
    this.dataSource.push(this.scriptingDatasourcemodels[randomElementIndex]);
    this.table.renderRows();
    this._commonService.notification('Your selected data has been added successfully');
    this.dialogRef.close(this.dataSource);
  }

  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }

  edit(element: any){
    this.variableName  = element.variableName;
    this.contextUpdate = element.contextUpdate;
    this.xid           = element.xid;
    this.edits         = true;
    this.visibles      = true
    this.getDataPointByID(this.xid);
  }
  updatePublish() {
    const elementsToUpdate = this.dataSource.filter((h: any) => h.xid == this.xid);
    elementsToUpdate.forEach((element: any) => {
      element.variableName = this.variableName; // Update the value property
    });
    this.dialogRef.close(this.dataSource);
  }
    closeModel(){
    this.dialogRef.close(this.dataSource);
  }

}
