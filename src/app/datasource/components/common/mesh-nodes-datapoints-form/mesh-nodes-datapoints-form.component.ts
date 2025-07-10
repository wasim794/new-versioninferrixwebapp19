import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataPointModel, AttributeCode} from '../../../model';
import {MeshNodesPointLocatorModel} from '../../../model/sensors/mesh-nodes-point-locator.model';
import {DatasourceService} from '../../../service/datasource.service';
import {CommonService} from '../../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {DictionaryService} from "../../../../core/services";
import {DATA_TYPES} from "../../../../common";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [CommonService, DatasourceService, DictionaryService],
  selector: 'app-sensor-datapoints-form',
  templateUrl: './mesh-nodes-datapoints-form.component.html',
  styleUrls: []
})
export class MeshNodesDatapointsFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Input() dataPoint!     : DataPointModel;
  @Input() pointLocator:any  = MeshNodesPointLocatorModel;
  @Input() attributeCode : any= new AttributeCode();
  @Output() updateTable  = new EventEmitter<any>();
  @Output() saveTable    = new EventEmitter<any>();
  @Output() hideShow     = new EventEmitter<any>();
  dataSourcePointError!   : any[];
  datapointButtonsView!   : boolean;
  dataTypes              = DATA_TYPES;
  saveSuccess            = 'Saved successfully';
  updateSuccess          = 'Updated successfully';
  settable!               : boolean;
  public messageError!    : boolean;
  attributeCodes         : boolean=true;
  enableAttribute        : boolean=true;
  attributeCodesSecond   : boolean=true;
  UIDICTIONARY           : any;

  constructor(private datasourceService: DatasourceService,
              private commonService    : CommonService,
              public dictionaryService : DictionaryService) {
    super();
  }

  ngOnInit() {
  this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
  this.setSettable();
  this.allAttribute();
  console.log(this.dataTypes);
            }

  allAttribute(){
    if(this.pointLocator.modelType =='STUDENT_ASSET_TAG.DS'
    || this.pointLocator.modelType =='SENSOR_TAG_TH_SHT21.PL'
    || this.pointLocator.modelType =='PEOPLE_COUNTER.PL'
    || this.pointLocator.modelType =='LIGHT_RELAY_CONTROLLER.PL'
      ) {
      this.attributeCodes = false

    }else
    {
      this.enableAttribute=true;
    }
   if(this.pointLocator.modelType   =='DOOR_SENSOR.PL'
     || this.pointLocator.modelType =='SENSOR_TAG_IAQ_V2.PL'
     || this.pointLocator.modelType =='SENSOR_TAG_PIR.PL'
     || this.pointLocator.modelType =='DISTANCE_SENSOR.PL'
     || this.pointLocator.modelType =='SENSOR_TAG_LUX.PL'
   ){
     this.attributeCodes=false
   }
   else{
     this.enableAttribute=false;
   }
   if(this.pointLocator.modelType   == 'MODBUS_CONTROLLER.PL'
     || this.pointLocator.modelType == 'INTERNAL.PL'){
     this.attributeCodes      = false;
     this.attributeCodesSecond= false;
   }
  }

  saveDataPoint() {
    this.dataPoint.pointLocator   = this.pointLocator;
    this.subs.add(this.datasourceService.saveDatapoint(this.dataPoint).subscribe(data => {
        this.datapointButtonsView = true;
        // @ts-ignore
        this.dataPoint = data;
        this.saveTable.emit(this.dataPoint);
        this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
      this.hideShow.emit(event);
      }, error => {
        this.dataSourcePointError = error.result.message;
        this.timeOutFunction();
      })
    );
  }



  updateDataPoint() {
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(this.datasourceService.updateDataPoint(this.dataPoint).subscribe(data => {
        // @ts-ignore
        this.updateTable.emit(data);
        this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
      this.hideShow.emit(event)
      }, error => {
        this.dataSourcePointError = error.result.message;
       this.timeOutFunction();
      })
    );
  }


  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }


  cancelDataPoint(event: any) {
    this.hideShow.emit(event);
  }

  setSettable() {
    (this.pointLocator.modelType     === 'FDU_CONTROLLER.PL'
      || this.pointLocator.modelType === 'LED_CONTROLLER.PL')?
      this.settable = true:""
  }


}
