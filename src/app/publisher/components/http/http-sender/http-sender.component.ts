import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TimePeriodModel} from '../../../../core/models/timePeriod';
import {HttpSenderModel, HttpSenderPointModel} from '../model';
import {CommonService} from '../../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {HttpSenderService, HttpSenderPointService} from '../service';
import {HttpSenderDropdownData} from '../shared/http-sender-dropdown.data';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {ReactiveFormsModule, FormControl} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import {DatapointsListComponent} from '../../../datapoints-list/datapoints-list.component';

@Component({
  standalone: true,
    imports:[CommonModule, MatModuleModule, ReactiveFormsModule, DatapointsListComponent],
  selector: 'app-http-sender',
  templateUrl: './http-sender.component.html',
  styleUrls: []
})
export class HttpSenderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  staticHeadersKey!: string;
  staticHeadersValue!: string;
  staticParametersKey!: string;
  staticParametersValue!: string;
  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();
  dataPointXID: any;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  public httpSenderModel:any = HttpSenderModel;
  public httpSenderPoint:any = new HttpSenderPointModel();
  public isEdit!: boolean;
  public dropdownData = new HttpSenderDropdownData();
  error:any = [];
  eventsTableColumns: string[] = ['eventType', 'level', 'description'];
  staticHeadersColumns: string[] = ['Key', 'Value'];
  public messageError!: boolean;
  pointValues: boolean=false;
  UIDICTIONARY : any;
  httpTitle: boolean = false;



  constructor(
    private _service: HttpSenderService,
    public dictionaryService: DictionaryService,
    private _commonService: CommonService,
    public httpSenderPointService :HttpSenderPointService
  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.httpSenderModel = new HttpSenderModel();
    this.httpSenderModel.snapshotSendPeriod = new TimePeriodModel();
    this._service.httpSenderPointModel = [];
  }

  addStaticHeader() {
    const key = this.staticHeadersKey;
    const value = this.staticHeadersValue;

    if (!key || !value) {
      alert('key and value both are required');
      return;
    }
    for (let i = 0; i < this.httpSenderModel.staticHeaders.length; i++) {
      if (this.httpSenderModel.staticHeaders[i].key === key) {
        alert('Key already exist : ' + '\'' + key + '\'');
        return;
      }
    }
    this.httpSenderModel.staticHeaders.push({key: key, value: value});
    this.httpSenderModel.staticHeaders.sort();
  }

  removeStaticHeader(index: any) {
    this.httpSenderModel.staticHeaders.splice(index, 1);
  }

  addStaticParameter() {
    const key = this.staticParametersKey;
    const value = this.staticParametersValue;
    if (!key || !value) {
      alert('key and value both are required');
      return;
    }
    for (let i = 0; i < this.httpSenderModel.staticParameters.length; i++) {
      if (this.httpSenderModel.staticParameters[i].key === key) {
        alert('Key already exist : ' + '\'' + key + '\'');
        return;
      }
    }
    this.httpSenderModel.staticParameters.push({key: key, value: value});
    this.httpSenderModel.staticParameters.sort();
  }

  removeStaticParameter(index: any) {
    this.httpSenderModel.staticParameters.splice(index, 1);
  }

  getHttSenderPublisher(xid: string) {
    this.pointValues = true;
    this.dataPointXID = xid;
    this.isEdit = true;
    this.subs.add(this._service.getByXid(xid).subscribe(data => {
      this.httpSenderModel = new HttpSenderModel(data);
      this.httpSenderPointService.httpSenderPointModel = this.httpSenderModel.points;
      this.httpTitle = true;
    }, err => console.log(err)));
  }



  saveHttpSender() {
    this.error = [];
    this.httpSenderModel.points = [];
    this.subs.add(this._service.create(this.httpSenderModel).subscribe(data => {
        this.httpSenderModel = new HttpSenderModel(data);
        this._service.httpSenderPointModel = this.httpSenderModel.points;
        this._commonService.notification(this.httpSenderModel.name + ' ' + this.saveSuccessMsg);
        this.responsePublisherSave.emit();
      }, error => {
        this.error = error.result.message;
      this.timeOutFunction();
      })
    );
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  updateHttpSender() {
    this.error = [];
    this.httpSenderModel.points = [];
    this.subs.add(this._service.update(this.httpSenderModel).subscribe(data => {
        this.httpSenderModel = new HttpSenderModel(data);
        this._service.httpSenderPointModel = this.httpSenderModel.points;
        this._commonService.notification(this.httpSenderModel.name + ' ' + this.updateSuccessMsg);
        this.responsePublisherUpdate.emit();
      }, error => {
        this.error = error.result.message;
      this.timeOutFunction();
      })
    );
  }
}
