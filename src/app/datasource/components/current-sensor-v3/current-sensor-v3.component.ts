import {Component, OnInit} from '@angular/core';
import {AttributeCode} from '../../model';
import {DataPointService} from '../../../core/services';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService} from "../../../core/services";
import {CurrentV3SensorModel, CurrentV3SensorsLocatorModel} from '../current-sensor-v3';
import {CurrentV3DatasourceService} from '../current-sensor-v3/service/currentV3-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
    providers: [CurrentV3DatasourceService, DictionaryService],
    imports: [CommonModule, MatModuleModule],
  selector: 'app-current-sensor-v3',
  templateUrl: './current-sensor-v3.component.html',
  styleUrls: []
})
export class CurrentSensorV3Component extends DataSourceBase implements OnInit {
  pointLocator : any = new CurrentV3SensorsLocatorModel();
  attributeCode!: AttributeCode;
  declare datapointForm: boolean;
  UIDICTIONARY : any;

  constructor(private dataPointService   : DataPointService,
             private _CurrentV3Datasource: CurrentV3DatasourceService,
             public dictionaryService    : DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
           this.UIDICTIONARY = this.dictionaryService.uiDictionary;
          });
    this.subs.add(this.dataPointService.getSensorExportCode('current-sensor-v3').subscribe((data: any) => {
        this.attributeCode = data;
      })
    );
  }

  hideShow(event: any) {
    this.datapointForm = false;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.dataPointService.getByXid(dataPointXid).subscribe(data => {
        this.datapointForm = true;
        this.datapoints.datapointButtonsView = true;
        this.dataPoint = data;
        this.pointLocator = this.dataPoint.pointLocator;
      })
    );
  }

}
