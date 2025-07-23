import {Component, OnInit, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {DictionaryService} from '../../../core/services';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import { MatDialogRef } from '@angular/material/dialog';
import {ThermostatDatasourceModel} from "../../../datasource/components";
import {ThermostatService} from "../../shared/services";
import {CommonService} from '../../../services/common.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {LOCK_UNLOCK, COMMONACTIONS, MODE, FAN_SPEED} from '../../shared';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.component.html'
})
export class ThermostatComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public UIDICTIONARY:any;
  displayedColumns: string[] = ['S.No.', 'Address', 'Name', 'Actions'];
  dataSource: any = new MatTableDataSource<ThermostatDatasourceModel>();
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [8, 15, 20];
  thermostatDS = 'THERMOSTAT.DS';


  constructor(private dictionaryService:DictionaryService, public thermostatService: ThermostatService,
              private _commonService:CommonService, public dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary("menu").subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = `limit(${this.limit},${this.offset})&type=${this.thermostatDS}`;
    this.getThermostatData(param);

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getThermostatData(params:string) {
    this.subs.add(this.thermostatService.getThermostatMeshOn(params).subscribe(data => {
      this.dataSource = data;
    }))
  }
  getNextPage(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = `limit(${this.limit},${this.offset})&type=${this.thermostatDS}`;
    this.getThermostatData(param);
  }

  startActions(element, actions) {
    const dialogBox = this.dialog.open(ContentDialog, {
      data: {
        element: element,
        action: actions
      }
    });
    dialogBox.afterClosed().subscribe(result => {
      result=='success'? this._commonService.notification("Successfully applied"):'';

    });
  }


}

///*START DIALOG CONTAINER HTML*///

@Component({
  selector: 'content-dialog',
  templateUrl: 'content-dialog.html',
})
export class ContentDialog extends UnsubscribeOnDestroyAdapter implements OnInit {
  UIDICTIONARY       :any;
  actionsMode        :any;
  inputTextHideSHow  :boolean;
  inputSelectHideSHow:boolean;
  hidetemp:boolean;
  actionTypesSelect  :any;
  actionTypesInput   :string;
  constructor(private dictionaryService:DictionaryService, public dialogRef: MatDialogRef<ContentDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any, private thermostatService: ThermostatService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.dictionaryService.getUIDictionary("menu").subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.dropDownConditions();
  }

  dropDownConditions() {
    const trueFunction = () => ({ inputSelectHideSHow: true, inputTextHideSHow: false });
    const falseFunction = () => ({ inputSelectHideSHow: false, inputTextHideSHow: true });

    const actionMap: {
      [key: string]: { actionsMode?: any; inputSelectHideSHow: boolean; inputTextHideSHow: boolean }
    } = {
      powerONOFF: { actionsMode: COMMONACTIONS, ...trueFunction() },
      automaticManual: { actionsMode: COMMONACTIONS, ...trueFunction() },
      energySavings: { actionsMode: COMMONACTIONS, ...trueFunction() },
      lockUnlocks: { actionsMode: LOCK_UNLOCK, ...trueFunction() },
      onlyMode: { actionsMode: MODE, ...trueFunction() },
      fan: { actionsMode: FAN_SPEED, ...trueFunction() },
      temp: { ...falseFunction() },
      echotemp: { ...falseFunction() },
      syncter: { ...falseFunction() }
    };
    const conditions = actionMap[this.data.action] || { inputSelectHideSHow: false, inputTextHideSHow: false };
    this.actionsMode = conditions.actionsMode || this.actionsMode;
    this.inputSelectHideSHow = conditions.inputSelectHideSHow;
    this.inputTextHideSHow = conditions.inputTextHideSHow;
  }

  startActions() {
    const xid = this.data.element.xid;
    const actionsData = this.data.action;
    const actionTypeValues = this.actionTypesSelect;
    const actionTypeValuesInput = this.actionTypesInput;

    const actionHandlers = {
    powerONOFF     : this.powerONOFFActions.bind(this),
    lockUnlocks    : this.lockUnlockActions.bind(this),
    onlyMode       : this.onlyModeActions.bind(this),
    fan            : this.fanActions.bind(this),
    energySavings  : this.energySavingsActions.bind(this),
    automaticManual: this.automaticManualActions.bind(this),
    };

    if (actionHandlers[actionsData]) {
      actionHandlers[actionsData](xid, actionTypeValues);
    }
    else if(actionsData=='temp'){
      this.tempActions(xid, actionTypeValuesInput);
    }
    else if(actionsData==='echotemp'){
      this.echoTempActions(xid, actionTypeValuesInput);
    }
    else if(actionsData==='syncter'){
      this.syncThermostats(xid, actionTypeValuesInput);
    }
  }

  private powerONOFFActions(xid, boolean){
    this.subs.add(this.thermostatService.powerOnOff(xid, boolean).
    subscribe(data=>{
     this.dialogRef.close("success");
    }))
  }

  private lockUnlockActions(xid, boolean){
    this.subs.add(this.thermostatService.lockUnlock(xid, boolean).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private onlyModeActions(xid, string){
    this.subs.add(this.thermostatService.modeCommand(xid, string).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private fanActions(xid, string){
    this.subs.add(this.thermostatService.fanCommand(xid, string).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private energySavingsActions(xid, boolean){
    this.subs.add(this.thermostatService.energySaving(xid, boolean).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private automaticManualActions(xid, boolean){
    this.subs.add(this.thermostatService.automaticManual(xid, boolean).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private tempActions (xid, string){
    this.subs.add(this.thermostatService.targetTemperature(xid, string).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private echoTempActions (xid, string){
    this.subs.add(this.thermostatService.ecoModeTargetTemperature(xid, string).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }

  private syncThermostats (xid, string){
    this.subs.add(this.thermostatService.syncThermostat(xid, string).subscribe(data=>{
      this.dialogRef.close("success");
    }));
  }


}


