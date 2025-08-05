import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BacnetSenderModel} from '../../../shared/model/pages/bacnet-sender.model';
import {BacnetSenderPointModel} from '../../../shared/model/pages/bacnet-sender-point.model';
import {TimePeriodModel} from '../../../../core/models/timePeriod';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {NOTIFY_TYPE} from '../../../shared/dropdown/bacnet-sender-dropdown.data';
import {AnalogIntrinsicAlarmModel} from '../../../shared/model/pages/analog-intrinsic-alarm.model';
import {BinaryIntrinsicAlarmModel} from '../../../shared/model/pages/binary-intrinsic-alarm.model';
import {MultistateIntrinsicAlarmModel} from '../../../shared/model/pages/multistate-intrinsic-alarm.model';
import {CommonService} from '../../../../services/common.service';
import {MatTable} from '@angular/material/table';
import {DataPointService, DictionaryService} from '../../../../core/services';
import {DataPointModel} from '../../../../core/models/dataPoint';
import {IntrinsicAlarmModel} from '../../../shared/model/pages/intrinsic-alarm.model';
import {BacnetService, BacnetSenderPointService, BacnetSenderService, BacnetSenderDropdownData, BacnetLocalDeviceModel  } from '../../../../bacnet';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';


@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, ReactiveFormsModule],
  providers: [BacnetService, BacnetSenderPointService, BacnetSenderService,],
  selector: 'app-publisher-bacnet-form',
  templateUrl: './bacnet-sender.component.html'
})

export class BacnetSenderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public bacnetSenderModel:any = new BacnetSenderModel();
  public bacnetSenderPointModel: any = new BacnetSenderPointModel();
  public analogIntrinsicAlarm: any = new AnalogIntrinsicAlarmModel();
  public binaryIntrinsicAlarm:any = new BinaryIntrinsicAlarmModel();
  public multistateIntrinsic:any = new MultistateIntrinsicAlarmModel();
  public intrinsicAlarms:any = new IntrinsicAlarmModel();
  public localDeviceModels!: BacnetLocalDeviceModel<any>[];
  private dataPointXidArray = [];
  myControl = new FormControl('');
  public form!: FormGroup;
  @ViewChild(MatTable) table!: MatTable<any>;
  public isEdit!: boolean;
  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();
  public selectionValue: any;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  deleteSuccessMsg = "is delete successfully";
  public dataPointModels: DataPointModel[] = [];
  bacnetPointsColumn: string[] = ['Name', 'InstanceNumber', 'ObjectName', 'ObjectType', 'Actions'];
  showDataPointFields!: boolean;
  isEditDataPoint!: boolean;
  bacnetSenderError!: any[];
  public dropdownData = new BacnetSenderDropdownData();
  options: DataPointModel[] = this.dataPointModels;
  searchDatapoint: any;
  dataTypes: any;
  searchDatasource!: string;
  selectionData!: boolean;
  value: any;
  dataPointXID: any;
  xid:any;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  public messageError!: boolean;
  public dataSources:any;
  public pointValues :boolean =false;
  public bacnetTitles:boolean = false;
  UIDICTIONARY : any;
  NOTIFY_TYPES=NOTIFY_TYPE;
  alarmValues: any[] = [''];
  faultValues: any[] = [''];

  constructor(
    public dictionaryService: DictionaryService,
    private bacnetService: BacnetService,
    private _service: BacnetSenderService,
    private _commonService: CommonService,
    private datapointService: DataPointService,
    public bacnetSenderPoint: BacnetSenderPointService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);
    this.bacnetSenderModel = new BacnetSenderModel();
    this.bacnetSenderModel.snapshotSendPeriod = new TimePeriodModel();
    this.getBacnetLocalDevices();
    this.getDataPoint(param);
  }




  autoSearch() {
    if (this.searchDatasource === '') {
      this.selectionData = false;
    } else {
      this.selectionData = true;
      const param = 'like(name,%2A' + this.searchDatasource + '%2A)|like(deviceName,%2A' + this.searchDatasource + '%2A)';
      //return false;
      this.getDataPoint(param);
    }
  }
  getNext(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getDataPoints(param);
  }

  selectedValue(dataPoint: any) {
    this.addDataPoint(dataPoint);
    this.selectionData = false;
  }


  onInputChange(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    const param = 'like(name,%2A' + filterValue + '%2A)|like(deviceName,%2A' + filterValue + '%2A)';
    //return false;
    this.getDataPoint(param);
  }


  deviceChange(selectedOption: any, event: any): void {
    if (event.isUserInput) {
      // console.log(selectedOption);
      this.addDataPoint(selectedOption.xid);
      // this.profileId = selectedOption.id;

    }
  }

  getDataPoint(pushData: any) {
    this.subs.add(this.datapointService.get(pushData).subscribe(data => {
      this.dataPointModels = data;
      console.log(this.dataPointModels);
      // console.log("step 1data", this.dataPointModels);
      // if (this.bacnetSenderModel.points.length > 0) {
      //   this.bacnetSenderModel.points.forEach(value => {
      //       this.dataPointXidArray.push(value.dataPointXid);
      //     }
      //   );
      //   this.dataPointXidArray.forEach(xid => {
      //     this.dataPointModels = this.dataPointModels.filter(h => h.xid !== xid);
      //   });
      //   this.dataPointXidArray = [];
      // } else {
      //   this.dataPointModels = data;
      //   if (this.dataPointModels.length === 0) {
      //     this.selectionData = false;
      //   }
      // }
    }));
  }

  addDataPoint(xid: any) {
    this.dataPointXID= xid;
    this.subs.add(this.bacnetService.getBacnetPublisherPoint(xid).subscribe((model) => {
      this.showDataPointFields = true;
      this.isEditDataPoint = true;
      this.bacnetSenderPointModel = model;
    }));
  }

  private separateCallAlarmConfig(alarmData: any) {
    let modelCategories: any;
    // console.log("sep",alarmData);

    if (
      this.bacnetSenderPointModel.objectType === 'ANALOG_INPUT' ||
      this.bacnetSenderPointModel.objectType === 'ANALOG_VALUE'
    ) {
      modelCategories = alarmData;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.highLimit = this.analogIntrinsicAlarm.highLimit;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.lowLimit = this.analogIntrinsicAlarm.lowLimit;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.deadband = this.analogIntrinsicAlarm.deadband;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.faultHighLimit = this.analogIntrinsicAlarm.faultHighLimit;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.faultLowLimit = this.analogIntrinsicAlarm.faultLowLimit;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.modelType = this.analogIntrinsicAlarm.modelType;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.limitEnable = this.analogIntrinsicAlarm.limitEnable;

    } else if (
      this.bacnetSenderPointModel.objectType === 'BINARY_INPUT' ||
      this.bacnetSenderPointModel.objectType === 'BINARY_VALUE'
    ) {
      modelCategories = alarmData;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.alarmValue = this.binaryIntrinsicAlarm.alarmValue;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.modelType = this.binaryIntrinsicAlarm.modelType;
      // console.log(modelCategories);
    } else if (
      this.bacnetSenderPointModel.objectType === 'MULTISTATE_INPUT' ||
      this.bacnetSenderPointModel.objectType === 'MULTISTATE_VALUE'
    ) {
      modelCategories = alarmData;
      this.multistateIntrinsic.alarmValues = this.alarmValues.filter((val) => val !== '');
      this.multistateIntrinsic.faultValues = this.faultValues.filter((val) => val !== '');
      this.bacnetSenderPointModel.intrinsicAlarmConfig.alarmValues = this.multistateIntrinsic.alarmValues;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.faultValues = this.multistateIntrinsic.faultValues;
      this.bacnetSenderPointModel.intrinsicAlarmConfig.modelType = this.multistateIntrinsic.modelType;

      // console.log(modelCategories);
    }

    // Ensure intrinsicAlarmConfig exists before assigning values
    this.bacnetSenderPointModel.intrinsicAlarmConfig = modelCategories;

    // console.log(this.bacnetSenderPointModel);
  }



  private separateCallAlarmConfigEdits(alarmData: any) {
    // console.log("pEidts", alarmData);
    let modelCategories: any;

    if (
      this.bacnetSenderPointModel.objectType === 'ANALOG_INPUT' ||
      this.bacnetSenderPointModel.objectType === 'ANALOG_VALUE'
    ) {
      modelCategories = { ...this.analogIntrinsicAlarm };
      modelCategories = alarmData;
      this.analogIntrinsicAlarm = alarmData;
      // console.log("Anolog", modelCategories);
      // this.bacnetSenderModel.points[0].intrinsicAlarmConfig = { ...this.analogIntrinsicAlarm };
    } else if (
      this.bacnetSenderPointModel.objectType === 'BINARY_INPUT' ||
      this.bacnetSenderPointModel.objectType === 'BINARY_VALUE'
    ) {
      modelCategories = { ...this.binaryIntrinsicAlarm };
      modelCategories = alarmData;
      this.binaryIntrinsicAlarm = alarmData;
      // console.log("BInary", modelCategories);
      // console.log(modelCategories);
    } else if (
      this.bacnetSenderPointModel.objectType === 'MULTISTATE_INPUT' ||
      this.bacnetSenderPointModel.objectType === 'MULTISTATE_VALUE'
    ) {

      modelCategories = { ...this.multistateIntrinsic };
      modelCategories = alarmData;
      this.alarmValues = alarmData.alarmValues;
      this.faultValues= alarmData.faultValues;
      // console.log(this.multistateIntrinsic.alarmValues, this.multistateIntrinsic.faultValues);
    }
    this.bacnetSenderPointModel.intrinsicAlarmConfig = {
      ...(this.bacnetSenderPointModel.intrinsicAlarmConfig || {}),
      ...modelCategories,
    };

    // console.log(this.bacnetSenderPointModel);
  }

  saveDataPoint() {
      // this.isEditDataPoint = true;
      // this.showDataPointFields = false;
      this.bacnetSenderPointModel.publisherXid = this.xid;
      this.bacnetSenderPointModel.dataPointXid = this.dataPointXID;
      this.bacnetSenderPointModel.name = this.bacnetSenderPointModel.dataPointName;
     // console.log(this.bacnetSenderPointModel.intrinsicAlarmConfig);
      this.separateCallAlarmConfig(this.bacnetSenderPointModel.intrinsicAlarmConfig);

      // console.log("test after config", this.bacnetSenderPointModel);
    // return;
      this.subs.add(this.bacnetSenderPoint.create(this.bacnetSenderPointModel).subscribe(data=>{
      this._commonService.notification(data.name+' '+this.saveSuccessMsg);
        this.showDataPointFields = false;
      this.getPubBacnet(this.bacnetSenderPointModel.publisherXid);
      this.table.renderRows();
      const param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getDataPoints(param);
    }))

  }

  updateDataPoints(){
    this.isEditDataPoint = true;
    this.showDataPointFields = false;
    this.bacnetSenderPointModel.publisherXid = this.xid;
    this.bacnetSenderPointModel.name = this.bacnetSenderPointModel.dataPointName;
   // console.log(this.bacnetSenderPointModel.intrinsicAlarmConfig);
    this.separateCallAlarmConfig(this.bacnetSenderPointModel.intrinsicAlarmConfig);
   // console.log(this.bacnetSenderPointModel);
    this.subs.add(this.bacnetSenderPoint.update(this.bacnetSenderPointModel).subscribe(data=>{
      this._commonService.notification(data.name+' '+this.updateSuccessMsg);
      this.getPubBacnet(this.bacnetSenderPointModel.publisherXid);
      this.table.renderRows();
      const param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getDataPoints(param);
    }))

  }

  editDataPoint(model: BacnetSenderPointModel) {
    this.showDataPointFields = true;
    this.isEditDataPoint = false;
    this.bacnetSenderPointModel = model;
    this.bacnetSenderPointModel.dataPointName = model.name;
    this.bacnetSenderPointModel.name = this.bacnetSenderPointModel.dataPointName;
   // console.log("data edits", this.bacnetSenderPointModel.intrinsicAlarmConfig);
    this.separateCallAlarmConfigEdits(this.bacnetSenderPointModel.intrinsicAlarmConfig);
  }





  getDataPoints(param: any) {
    let params = param+'&like(publisherXid,%2A' + this.xid + '%2A)';
    this.bacnetSenderPoint.get(params).subscribe(data=>{
      this.dataSources = data;
      console.log(this.dataSources);
    });
  }
  getPubBacnet(xid: any) {
    this.pointValues = true;
    this.xid= xid;
    this.isEdit = true;
    this.subs.add(this._service.getByXid(xid).subscribe(data => {
      this.bacnetSenderModel = data;
    }, err => console.log(err)));
   this.bacnetTitles = true;
  }


  savePublisherBacnet() {
      this.subs.add(this._service.create(this.bacnetSenderModel).subscribe(data => {
      this._commonService.notification(this.bacnetSenderModel.name + ' ' + this.saveSuccessMsg);
      this.responsePublisherSave.emit(data);
      this.isEdit = true;
    }, error => {
      // console.log(error),
      this.bacnetSenderError = error.result.message;
      this.timeOutFunction();
    }));
  }


  updatePublisherBacnet() {
    delete this.bacnetSenderModel.connectionDescription;
    delete this.bacnetSenderModel.description;
    delete this.bacnetSenderModel.eventAlarmLevels;
    this.bacnetSenderModel.xid =  this.xid;
    this.bacnetSenderModel.points=[];
    this.subs.add(this._service.update(this.bacnetSenderModel).subscribe(data => {
      this.isEdit = true;
      this._commonService.notification(this.bacnetSenderModel.name + ' ' + this.updateSuccessMsg);
      this.responsePublisherUpdate.emit(data);
    }, error => {
      this.bacnetSenderError = error.result.message;
      this.timeOutFunction();
    }));

  }

  filtersPublisher(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchDatapoint) {
        const param =
          "like(name,%2A" +
          this.searchDatapoint +
          "%2A)";
        this.getDataPoints(param);
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getDataPoints(param);
      }
    }
  }

  cancelButton() {
    this.showDataPointFields = false;
  }

  getBacnetLocalDevices() {
    this.subs.add(this.bacnetService.get().subscribe(data => {
      this.localDeviceModels = data;
      console.log("items localbacnegt", this.localDeviceModels);
      if (data) {
        this._commonService.hideloader();
      }
    }));
  }


  remove(datapoint: any) {
    this._commonService.openConfirmDialog('Are you want to delete ', datapoint.name).afterClosed().subscribe(response => {
      if (response) {
        this.bacnetSenderModel.points = this.bacnetSenderModel.points.filter((item: any) => item.dataPointXid !== datapoint.dataPointXid);
        this.subs.add(
          this.bacnetSenderPoint
            .delete(datapoint.xid)
            .subscribe((data) => {
              this._commonService.notification(
                datapoint.name + " " + this.deleteSuccessMsg
              );

            })
        );

      }
    });
  }



  addInputAlarm() {
    this.alarmValues.push(''); // Add a new empty input field
   // console.log(this.alarmValues);
    this.multistateIntrinsic.alarmValues = this.alarmValues;
   // console.log(this.multistateIntrinsic.alarmValues);
  }

  removeInput(index: number) {
    if (this.alarmValues.length > 1) {
      this.alarmValues.splice(index, 1); // Remove the input field at the specified index
    }
  }


  addInputFaultValues() {
    this.faultValues.push(''); // Add a new empty input field
   // console.log(this.faultValues);
    this.multistateIntrinsic.faultValues = this.faultValues;
    //console.log(this.multistateIntrinsic.faultValues);
  }


  removeInputfaultValue(index: number) {
    if (this.faultValues.length > 1) {
      this.faultValues.splice(index, 1); // Remove the input field at the specified index
    }
  }


  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }
}

