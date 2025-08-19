import { Component, Inject, OnInit, EventEmitter, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ModbusDataModel } from "../../../../models";
import { CommonService } from "../../../../../services/common.service";
import { ModbusDeviceDetailService } from "../../../../service/modbus-device-detail.service";
import {DictionaryService} from "../../../../../core/services/dictionary.service";

@Component({
  selector: "app-copy-modbus",
  templateUrl: "./copy-modbus.component.html",
  styleUrls: [],
})
export class CopyModbusComponent implements OnInit {
  model: ModbusDataModel;
  id: any;
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  saveSuccess = "saved successfully";
  copyName: any;
  copyType: any;
  UIDICTIONARY:any;

  constructor(
    public dialogRef: MatDialogRef<CopyModbusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ModbusDeviceDetailService,
    private _commonService: CommonService,
    public dictionaryService: DictionaryService
  ) {}

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
        this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.model = this.data.copyData;
    this.id = this.data.copyData.id;
    this.copyName = this.data.copyData.name;
    this.copyType = this.data.copyData.type;
  }

  CopyData(xid) {
    let param = "";
    if (this.copyName) {
      param = param + "copyName=" + this.copyName;
    }
    if (this.copyType) {
      param = param + "&type=" + this.copyType;
    }

    this._service.copy(xid, param).subscribe(
      (data) => {
        this._commonService.notification(
          "Copy Datasource " + this.copyName + " " + this.saveSuccess
        );
        this.dialogRef.close("close");
      },
      (error) => {
        if (this.copyType == "") {
          this._commonService.notification(error.localizedMessage);
          return;
        }
        if (error.localizedMessage === "Internal Server Error") {
          this._commonService.notification(
            "This type " + this.copyType + " is already in use"
          );
          return;
        }
        error.result.message.forEach((value) => {
          const typeCopy = { nameType: this.copyType };
          const returnedTarget = Object.assign(value, typeCopy);
          this._commonService.notification(
            "1-" +
            returnedTarget.message +
            "" +
            " " +
            "2- This type " +
            returnedTarget.nameType +
            " is already in use"
          );
          return;
        });
      }
    );
  }
}
