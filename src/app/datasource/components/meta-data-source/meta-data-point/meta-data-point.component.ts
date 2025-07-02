import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../../../../services/common.service';
import { DataPointService } from '../../../../core/services';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from '../../../../common';
import {DictionaryService} from "../../../../core/services/dictionary.service";

@Component({
  selector: 'app-meta-data-point',
  templateUrl: './meta-data-point.component.html',
  styleUrls: []
})
export class MetaDataPointComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  dataPointsTableColumns: string[] = ['DeviceName','DataType', 'dataPointName', 'variableName', 'action'];
  dataSource:any=[];
  xid:string;
  name:string;
  variableName:string;
  contextUpdate:boolean;
  edits:boolean;
  visibles:boolean;
  closeData:any;
  public metaPointLocatorModels=[];
  UIDICTIONARY : any;

  constructor(
    public dialogRef: MatDialogRef<MetaDataPointComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _commonService: CommonService,
    public dictionaryService: DictionaryService,
    private _dataPointService: DataPointService,  private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.xid = this.data.datapointValue;
    this.data.action=='view'?this.visibles = false:this.visibles=true;
    this.getDataPointByID(this.xid);
    this.dataAddonMatchValue();
  }


  getDataPointByID(xid){
    this.subs.add(this._dataPointService.getByXid(xid).subscribe(data=>{
      this.name = data.extendedName;

    }));
  }

  dataAddonMatchValue (){
    let existingArray = this.data.allDataPoints;
    let idsToAddData = this.data.datapointAdded;
    idsToAddData.forEach(idData => {
      let matchedObject = existingArray.find(obj => obj.xid === idData.xid);
      if (matchedObject) {
        matchedObject['variableName'] = idData.variableName;
      }
    });
    this.dataSource = existingArray;

  }

  savePublish() {
   if((this.xid==undefined) || (this.variableName==undefined) || (this.contextUpdate==undefined)) {
     alert("all filed required");
     return;
   }
   else {
     if (!this.metaPointLocatorModels) {
       this.metaPointLocatorModels = [];
     }
     const newObj = {
       xid: this.xid,
       variableName: this.variableName,
       contextUpdate: this.contextUpdate
     };
     this.data.datapointAdded = [];
     this.data.datapointAdded.push(newObj);
     if (!this.dataSource) {
       this.dataSource = [];
       this._commonService.notification('Your selected data has been added successfully');
       this.dialogRef.close(this.data.datapointAdded);
     }
     const randomElementIndex = Math.floor(Math.random() * this.metaPointLocatorModels.length);
     this.dataSource.push(this.metaPointLocatorModels[randomElementIndex]);
     this.table.renderRows();
     this._commonService.notification('Your selected data has been added successfully');
     this.dialogRef.close(this.data.datapointAdded);
   }
  }
  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }
  edit(element){
    const matched = this.data.datapointAdded.filter(h => h.xid == element.xid);
    matched.forEach(element=>{
      this.variableName = element.variableName;
      this.contextUpdate = element.contextUpdate;
      this.xid = element.xid;
    })

    this.edits = true;
    this.visibles=true
    this.getDataPointByID(this.xid);
  }
  closeModel(){
    this.data.action==='add'? this.closeData = 'close': this.closeData =this.data.datapointAdded;
    this.dialogRef.close(this.closeData);
  }
  updatePublish() {
    const elementsToUpdate = this.data.datapointAdded.filter(h => h.xid == this.xid);
    elementsToUpdate.forEach(element => {
      element.variableName = this.variableName;
    });
    this.dialogRef.close(this.data.datapointAdded);
  }

  }
