import {Component, OnInit} from '@angular/core';
import {MeshNodesPointLocatorModel} from '../../model/sensors/mesh-nodes-point-locator.model';
import {AttributeCode} from '../../model';
import {DataPointService} from '../../../core/services';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService} from "../../../core/services";
import {IaqSensor2Model, IaqSensor2LocatorModel} from '../iaq-sensor-v2';
import {IaqSensor2Service} from '../iaq-sensor-v2/service/iaqSensor2.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, MeshNodesDatasourceFormComponent, MeshNodesDatapointsFormComponent],
  providers: [IaqSensor2Service, DataPointService, DictionaryService],
  selector: 'app-iaq-sensor-v2',
  templateUrl: './iaq-sensor-v2.component.html',
  styleUrls: []
})
export class IaqSensorV2Component extends DataSourceBase implements OnInit {
  pointLocator: any = new IaqSensor2LocatorModel();
  attributeCode!: AttributeCode;
  declare datapointForm:boolean;
  datapointFormTab:any;
  UIDICTIONARY : any;
  datasourceTitleName: any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
  this.dictionaryService.getUIDictionary('core').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
    this.datapointFormTab = this.datapointForms;
    this.subs.add(this.dataPointService.getSensorExportCode('sensor-tag-iaq-v2').subscribe((data: any) => {
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
