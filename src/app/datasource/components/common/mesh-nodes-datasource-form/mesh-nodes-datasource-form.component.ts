import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MeshNodesDatasourceModel} from '../../../model/sensors/mesh-nodes-datasource.model';
import {CommonService} from '../../../../services/common.service';
import {DatasourceService} from '../../../service/datasource.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {BacnetService, BacnetLocalDeviceModel} from '../../../../bacnet';
import {TimePeriodModel} from '../../../../core/models/timePeriod';
import {DictionaryService} from "../../../../core/services";
import {POLLING_PERIOD_TYPE} from "../../../../common";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [CommonService, DatasourceService, DictionaryService],
  selector: 'app-sensor-datasource-form',
  templateUrl: './mesh-nodes-datasource-form.component.html',
  styleUrls: []
})
export class MeshNodesDatasourceFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Output() savedDatasource            = new EventEmitter<any>();
  @Output() updatedDatasource          = new EventEmitter<any>();
  datasource: MeshNodesDatasourceModel = new MeshNodesDatasourceModel();
  permissions!                          : string;
  editPermission                       : any = [];
  modelType!: string;
  saveSuccess                          = 'Saved Successfully';
  updateSuccess                        = 'Updated Successfully';
  isEdit!                               : boolean;
  pollingPeriodType                    = POLLING_PERIOD_TYPE;
  timePeriod                           : any;
  timePeriodType                       : any;
  bacnetModel!                          : BacnetLocalDeviceModel<any>[];
  timePeriodModel                      = new TimePeriodModel;
  dataSourceError!                      : any[];
  visibility!                           : boolean;
  isAnchorOn!                           : boolean;
  public messageError!                  : boolean;
  public hideAddress!                   : boolean;
  public charCode                      : any;
  UIDICTIONARY                         : any;
  validValueMsg                        = "Please enter valid value";


  constructor(private commonService    : CommonService,
              private datasourceService: DatasourceService,
              public bacnetService     : BacnetService,
              public dictionaryService : DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
  }

  addNew(dsType: any) {
    dsType==='INTERNAL.DS' || 'MESH_SWITCH.DS'?this.hideAddress=true:this.hideAddress=false;
    this.modelType = dsType;
    this.setDefaultPermission();
    this.showInputs();
  }

  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }

  setData(dataSource: { modelType: string; xid: string; }) {
    dataSource.modelType    === 'INTERNAL.DS'
    || dataSource.modelType === 'MESH_SWITCH.DS'?this.hideAddress=false:this.hideAddress=true;
    this.isEdit = true;
    this.setDefaultPermission();
    this.subs.add(this.datasourceService.getDataSource(dataSource.xid).subscribe(data => {
        this.datasource = data;
        this.modelType = this.datasource.modelType;
        this.showInputs();
        this.EnableAnchorNode();
        if (this.datasource.editPermission) {
          this.editPermission = this.datasource.editPermission.split(',');
        }
      }, err => console.log(err))
    );
  }

  showInputs() {
  (this.modelType === 'SENSOR_TAG_DOOR_SENSOR.DS'
      || this.modelType === 'LIGHT_CONTROLLER_V4.DS'
      || this.modelType === 'WATER_LEAKAGE_DETECTOR.DS'
      || this.modelType === 'MESH_EXTENDER.DS'
      || this.modelType === 'LIGHT_DI_CONTROLLER.DS'
      || this.modelType === 'SENSOR_TAG_IAQ.DS'
      || this.modelType === 'SENSOR_TAG_TH_SHT21.DS'
      || this.modelType === 'CURRENT_SENSOR_V3.DS'
      || this.modelType === 'LIGHT_RELAY_CONTROLLER.DS'
      || this.modelType === 'MODBUS_CONTROLLER.DS'
      || this.modelType === 'DISTANCE_SENSOR.DS'
      || this.modelType === 'PEOPLE_COUNTER.DS'
      || this.modelType === 'SENSOR_TAG_PIR.DS'
      || this.modelType === 'SENSOR_TAG_LUX.DS'
      || this.modelType === 'SENSOR_TAG_IAQ_V2.DS'
      || this.modelType === 'MESH_CONTROLLER.DS'
      || this.modelType === 'STUDENT_ASSET_TAG.DS'
      || this.modelType === 'SENSOR_TAG_STROKE_COUNT.DS'
    ) ? this.visibility = true:
      this.visibility = false;
  }


  saveDatasource(): void {
      delete this.datasource.connectionDescription;
      this.datasource.modelType = this.modelType;
      if (this.editPermission) {
        this.datasource.editPermission = this.editPermission.toString();
      }
      this.subs.add(this.datasourceService.saveDatasource(this.datasource).subscribe(data => {
          this.isEdit = true;
          this.commonService.notification('Datasource ' + this.datasource.name + ' ' + this.saveSuccess);
          this.savedDatasource.emit(data);
        }, error => {
          this.dataSourceError = error.result.message;
          this.timeOutFunction();
        })
      );
  }

  updateDatasource() {
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(this.datasourceService.updatedataSource(this.datasource).subscribe(data => {
      this.updatedDatasource.emit(data);
      this.commonService.notification('Datasource ' + this.datasource.name + ' ' + this.updateSuccess);
    }, error => {
      this.dataSourceError = error.result.message;
      this.timeOutFunction();
    }));
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  //validation start here


  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 32 && (charCode < 33 || charCode > 57)) {
      this.commonService.notification(this.validValueMsg);
      return false;
    } else {
      return true;
    }
  }

  allowOnlyLetters(e: { which: any; }, t: any) {
    if (e) {
      this.charCode = e.which;
    } else {
      return true;
    }
    if ((this.charCode > 64 && this.charCode < 91) || (this.charCode > 96 && this.charCode < 123) || (this.charCode == 32)) {
      return true;
    } else {

      this.commonService.notification(this.validValueMsg);
      return false;
    }
  }

  onAnchorMode(event: any) {
    this.isAnchorOn = this.datasource.anchorNode === true;
  }

  EnableAnchorNode() {
    this.isAnchorOn = this.datasource.anchorNode === true;
  }
}
