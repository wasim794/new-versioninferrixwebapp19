import {Component, OnInit, ViewChild} from '@angular/core';
import {AttributeCode} from '../../model';
import {DataPointService, DictionaryService} from '../../../core/services';
import {DataSourceBase} from '../common/dataSourceBase';
import {DoorSensorModel, DoorSensorDetectorsModel} from '../door-sensor';
import {DoorSensorDatasourceService} from '../door-sensor/service/doorSensor-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, MeshNodesDatasourceFormComponent, MeshNodesDatapointsFormComponent],
  providers: [DoorSensorDatasourceService, DataPointService, DictionaryService],
  selector: 'app-door-sensor',
  templateUrl: './door-sensor.component.html',
  styleUrls: []
})
export class DoorSensorComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new DoorSensorDetectorsModel();
  attributeCode!: AttributeCode;
  declare datapointForm: boolean;
  UIDICTIONARY : any;
  datasourceTitleName:any;

  constructor(private dataPointService: DataPointService,
              public dictionaryService: DictionaryService, private _doorSensorDatasource: DoorSensorDatasourceService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
    this.subs.add(this.dataPointService.getSensorExportCode('sensor-tag-door').subscribe((data: any) => {
        this.attributeCode = data;
      })
    );

    this.datasourceTitleName = this.addCommonDataSourceName;

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
        // @ts-ignore
        this.pointLocator = this.dataPoint.pointLocator;
      })
    );
  }
}
