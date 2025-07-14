import {Component, OnInit} from '@angular/core';
import {AttributeCode} from '../../model';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService, DataPointService} from "../../../core/services";
import {IaqSensorLocatorModel, IaqSensorModel} from '../iaq-sensor';
import {IaqSensorService} from '../iaq-sensor/service/iaqSensor.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, MeshNodesDatasourceFormComponent, MeshNodesDatapointsFormComponent],
  providers: [IaqSensorService, DataPointService, DictionaryService],
  selector: 'app-iaq-sensor',
  templateUrl: './iaq-sensor.component.html',
  styleUrls: []
})
export class IaqSensorComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new IaqSensorLocatorModel();
  attributeCode!: AttributeCode;
  declare datapointForm: boolean;
  UIDICTIONARY : any;
  datasourceTitleName: any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.subs.add(this.dataPointService.getSensorExportCode('sensor-tag-iaq').subscribe((data: any) => {
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
    }));
  }
}
