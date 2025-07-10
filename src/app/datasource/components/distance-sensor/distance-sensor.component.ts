import {DataSourceBase} from "../common/dataSourceBase";
import {Component, OnInit} from "@angular/core";
import {AttributeCode} from "../../model";
import {DataPointService, DictionaryService} from  "../../../core/services";
import {DistanceSensorModel, DistanceSensorsLocatorModel} from '../distance-sensor';
import {DistanceDatasourceService} from '../distance-sensor/service/distance-datasource.service';

import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../../common/mat-module";
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from "../common";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonService } from "../../../services/common.service";

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, ReactiveFormsModule, MeshNodesDatasourceFormComponent,
       MeshNodesDatapointsFormComponent],
  providers: [DictionaryService, CommonService, DistanceDatasourceService, DataPointService],
  selector: 'app-distance-sensor',
  templateUrl: './distance-sensor.component.html',
  styleUrls: []
})
export class DistanceSensorComponent extends DataSourceBase implements OnInit {
  pointLocator         : any = new DistanceSensorsLocatorModel();
  attributeCode        : any = new AttributeCode();
  declare datapointForm        : boolean;
  UIDICTIONARY         : any;
  datasourceTitleName  : any;

  constructor(private dataPointService    : DataPointService,
              public dictionaryService    : DictionaryService,
              private _distanceDatasource : DistanceDatasourceService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.subs.add(this.dataPointService.getSensorExportCode('distance-sensor').subscribe((data: any) => {
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
      this.pointLocator = this.dataPoint.pointLocator;
    }));
  }

}
