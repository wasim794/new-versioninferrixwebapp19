import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DataPointModel } from "../../../core/models/dataPoint";
import { BacnetSenderModel } from "../../../bacnet/shared/model/pages/bacnet-sender.model";
import { TimePeriodModel } from "../../../core/models/timePeriod";
import { MqttSenderPointModel, MqttSenderModel } from "./model";
import {
  MqttSenderPointService,
  MqttService,
} from "../../service";
import { DataPointService } from "../../../core/services";
import { CommonService } from "../../../services/common.service";
import { EventAlarmLevels } from "../../../common/model/eventAlarmLevels";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UnsubscribeOnDestroyAdapter } from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import { UPDATE_EVENTS } from "../../shared";
import {
  PUBLISHER_TOPIC_TYPE,
  QOS_TYPE,
  SUBSCRIBERS_TOPIC_TYPE,
} from "./dropdown.data";
import { TIME_PERIOD_TYPES } from "../../../common";
import { DictionaryService } from "../../../core/services/dictionary.service";
import {BacnetSenderDropdownData} from '../../../bacnet/shared/dropdown/bacnet-sender-dropdown.data';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpSenderPointModel} from "../http";
import {ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
    imports:[CommonModule, MatModuleModule, ReactiveFormsModule],
    providers: [DataPointService, MqttService, MqttSenderPointService, CommonService],
  selector: "app-mqtt",
  templateUrl: "./mqtt.component.html",
  styleUrls: [],
})
export class MqttComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  mqttSender: any = new MqttSenderModel();
  public bacnetSenderModel!: BacnetSenderModel;
  dataPoint: any = new DataPointModel();
  displayedColumns: string[] = [
    "position",
    "name",
    "publish_Topic_type",
    "publish_Topic",
    "subscribe_Topic",
    "subscribe_Topic_type",
    "qos_Type",
    "action",
  ];
  public updateEvents = UPDATE_EVENTS;
  mqttPointModel: MqttSenderPointModel = new MqttSenderPointModel();
  public publisherTopicType = PUBLISHER_TOPIC_TYPE;
  public subscriberTopicType = SUBSCRIBERS_TOPIC_TYPE;
  public qosType = QOS_TYPE;
  public showCertificate!: boolean;
  public eventAlarmLevels: any = EventAlarmLevels;
  public sendPeriod = new TimePeriodModel();
  public timePeriodTypes = TIME_PERIOD_TYPES;
  public dropdownData = new BacnetSenderDropdownData();
  pubXid: any;
  tabIndex = 0;
  dataPointXid: any;
  isEdit!: boolean;
  isupdate!: boolean;
  publisherData!: any;
  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();
  saveSuccessMsg = "is saved successfully";
  updateSuccessMsg = "is updated successfully";
  deleteSuccessMsg = "is delete successfully";
  numericValueMsg = "Please enter numeric value";
  index = 1;
  public form:any = FormGroup;
  public publishList!: FormArray;
  error!: any[];
  nodata: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs:any= new Observable;
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [9, 15, 20];
  dataTypes: any;
  searchDatasource: any;
  selectionData!: boolean;
  searchDatapoint: any;
  public dataPointModels: DataPointModel[] = [];
  private dataPointXidArray: any = [];
  dataSource: any = [];
  dataSources: MatTableDataSource<any> = new MatTableDataSource<HttpSenderPointModel[]>([]);
  mqttDataList: any = [];
  options: DataPointModel[] = this.dataPointModels;
  public selectionValue: any;
  @ViewChild(MatTable) table!: MatTable<any>;
  public messageError!: boolean;
  alertMessage = "All input data must be filled out";
  pointValues: boolean=false;
  hideAndShowDignostic: boolean =false;
  UIDICTIONARY : any;
  mqttSenderTitle:boolean = false;

  constructor(
    private _mqttService: MqttService,
    public dictionaryService: DictionaryService,
    private datapointServices: DataPointService,
    private _commonService: CommonService,
    public mqttSenderPointService: MqttSenderPointService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('mqtt').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);
    this.form = this.fb.group({
      publish: this.fb.array([this.createPublish()]),
    });
    this.isupdate = false;
    this.addPublish();
    this.publishList = this.form.get("publish") as FormArray;
    this.dataSources.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  autoSearch(event: any) {
    this.searchDatasource = this.form.value.publish[0].dataPointXid;
    if (this.searchDatasource === "") {
      this.selectionData = false;
    } else {
      this.selectionData = true;
      const param =
        "like(name,%2A" +
        this.searchDatasource +
        "%2A)|like(deviceName,%2A" +
        this.searchDatasource +
        "%2A)";
      this.getDataPoint(param);
    }
  }

  selectedValue(dataPoint: any) {
    this.selectionData = false;
    this.searchDatasource = dataPoint.xid;
    this.selectionValue = dataPoint.name + "-" + dataPoint.dataSourceName;
  }
  selectTab(index: number): void {
    this.tabIndex = index;
  }

  getDataPoint(pushData: any) {
    this.subs.add(
      this.datapointServices.get(pushData).subscribe((data) => {
        this.dataPointModels = data;
        if (this.bacnetSenderModel.points.length > 0) {
          this.bacnetSenderModel.points.forEach((value) => {
            this.dataPointXidArray.push(value.dataPointXid);
          });
          this.dataPointXidArray.forEach((xid: any) => {
            this.dataPointModels = this.dataPointModels.filter(
              (h) => h.xid !== xid
            );
          });
          this.dataPointXidArray = [];
        } else {
          this.dataPointModels = data;
          if (this.dataPointModels.length === 0) {
            this.selectionData = false;
            this.nodata = "No data found";
          }
        }
      })
    );
  }

  getDataPointSelectBYID(xid: any){
    this.datapointServices.getByXid(xid).subscribe(data=>{
      this.selectionValue = data.name+"-"+data.dataSourceName;
    })
  }

  edit(element: any) {
    this.mqttDataList = [element];
    this.mqttDataList.forEach((elements: any) => {
      this.getDataPointByID(elements.xid);
    });
    this.form.get("publish").patchValue(this.mqttDataList);
    this.isupdate = true;
  }

  cancelPublish() {
    this.form.reset();
    this.isupdate = false;
  }

  get publish(): FormArray {
    return this.form.get("publish") as FormArray;
  }
  getDataPointByID(xid: any) {
    this.mqttSenderPointService.getByXid(xid).subscribe((data: any) => {
      this.mqttPointModel = data;
      this.dataPointXid = data.xid;
      this.getDataPointSelectBYID( data.dataPointXid);
    });
  }

  getDataPoints(param: any) {
    let params = param+'&like(publisherXid,%2A' + this.pubXid + '%2A)';
    this.mqttSenderPointService.get(params).subscribe((data: any)=>{
      this.dataSource = data;
    });
  }

  savePublish() {
    this.publish.value.forEach((newD: any) => {
      this.mqttPointModel = newD;
    });
    this.mqttPointModel.dataPointXid = this.searchDatasource;
    this.mqttPointModel.publisherXid = this.mqttSender.xid;
    this.mqttPointModel.modelType = "MQTT_SENDER.POINT";
    this.subs.add(
      this.mqttSenderPointService
        .create(this.mqttPointModel)
        .subscribe((data: any) => {
          this._commonService.notification(
            this.mqttPointModel.name + " " + this.saveSuccessMsg
          );
          this.getMqtt(this.mqttPointModel.publisherXid);
          const param = 'limit(' + this.limit + ',' + this.offset + ')';
          this.getDataPoints(param);
        })
    );
  }

  updatePublish() {
    this.publish.value.forEach((items: any) => {
      this.mqttPointModel = items;
    });
    if (this.searchDatasource) {
      this.mqttPointModel.dataPointXid = this.searchDatasource;
    }
    this.mqttPointModel.xid = this.dataPointXid;
    this.mqttPointModel.publisherXid = this.mqttSender.xid;
    this.subs.add(
      this.mqttSenderPointService
        .update(this.mqttPointModel)
        .subscribe((data: any) => {
          this._commonService.notification(
            this.mqttPointModel.name + " " + this.updateSuccessMsg
          );
          this.getMqtt(this.mqttPointModel.publisherXid);
          const param = 'limit(' + this.limit + ',' + this.offset + ')';
          this.getDataPoints(param);
        })
    );
  }

  removeData(element: any) {
    this.dataSource.pop();
    this.table.renderRows();
    this.subs.add(
      this.mqttSenderPointService
        .delete(element.xid)
        .subscribe((data: any) => {
          this._commonService.notification(
            element.name + " " + this.deleteSuccessMsg
          );
        })
    );
  }

  getNext(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getDataPoints(param);
  }

  enableDignostic(event: any){
   event.checked==true?this.hideAndShowDignostic =true:this.hideAndShowDignostic=false;
  }

  filterPublisher(event: any) {
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
  useCertificate(event: any) {
    this.showCertificate = event.checked;
    if (event.checked) {
      this.mqttSender.userName = "";
      this.mqttSender.userPassword = "";
    } else {
      this.mqttSender.privateKey = "";
      this.mqttSender.x509CaCrt = "";
      this.mqttSender.x509ClientCrt = "";
    }
  }

  getMqtt(pubXid: any) {
    this.isEdit = true;
    this.pointValues = true;
    this.pubXid = pubXid;
    this.subs.add(
      this._mqttService.getByXid(pubXid).subscribe(
        (data) => {
          this.mqttSender = data;
          this.showCertificate = this.mqttSender.awsIot;
          this.eventAlarmLevels = this.mqttSender.eventAlarmLevels;
          this.sendPeriod = this.mqttSender.snapshotSendPeriod;
          this.mqttSender.enableDiagnosticPublish==true?this.hideAndShowDignostic =true:this.hideAndShowDignostic=false;
          while (this.publishList.length !== 0) {
            this.publishList.removeAt(0);
          }
        },
        (err) => console.log(err)
      )
    );
    this.isEdit = true;
    this.mqttSenderTitle = true;
  }

  saveMqttPublisher() {
    this.error = [];
    this.mqttSender.points = [];
    this.mqttSender.snapshotSendPeriod = this.sendPeriod;
    this.subs.add(
      this._mqttService.create(this.mqttSender).subscribe(
        (data) => {
          this.publisherData = data;
          this._commonService.notification(
            this.publisherData.name + " " + this.saveSuccessMsg
          );
          this.responsePublisherSave.emit(data);
          this.isEdit = true;
          this.getMqtt(this.publisherData.xid);
        },
        (error) => {
          if (error.Message === undefined) {
            this._commonService.notification(this.alertMessage);
          } else {
            this.error = error.Message;
            this.timeOutFunction();
          }
        }
      )
    );
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 1000);
  }

  updateMqttPublisher() {
    this.error = [];
    delete this.mqttSender.eventAlarmLevels;
    this.mqttSender.points = [];
    this.subs.add(
      this._mqttService.update(this.mqttSender).subscribe(
        (data) => {
          this.publisherData = data;
          this._commonService.notification(
            this.publisherData.name + " " + this.updateSuccessMsg
          );
          this.responsePublisherUpdate.emit(data);
          this.getMqtt(this.publisherData.xid);
        },
        (error) => {
          if (error.Message === undefined) {
            this._commonService.notification(this.alertMessage);
          } else {
            this.error = error.Message;
            this.timeOutFunction();
          }
        }
      )
    );
  }

  createPublish(): FormGroup {
    return this.fb.group({
      name: [null],
      publishTopic: [null],
      publishTopicType: [null],
      subscribeTopic: [null],
      subscribeTopicType: [null],
      publishQosType: [null],
      dataPointXid: [null],
      enabled: [null],
      modelType: ["MQTT_SENDER.POINT"],
    });
  }

  addPublish() {
    this.publishList.push(this.createPublish());
  }

  get publishFormGroup() {
    return this.form.get("publish") as FormArray;
  }

  isNumber(evt: any) {
    evt = evt ? evt : window.event;
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 32 && (charCode < 33 || charCode > 57)) {
      this._commonService.notification(this.numericValueMsg);
      return false;
    } else {
      return true;
    }
  }
}
