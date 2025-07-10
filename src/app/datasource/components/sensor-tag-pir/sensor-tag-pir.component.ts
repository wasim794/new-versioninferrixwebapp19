import {DataSourceBase} from "../common/dataSourceBase";
import {Component, OnInit} from "@angular/core";
import {AttributeCode} from "../../model/attributeCode";
import {DataPointService} from "../../../core/services";
import {SensorTagPirDatasourceModel, SensorTagPirPointLocatorModel} from '../sensor-tag-pir';
import {SensorTagDatasourceService} from '../sensor-tag-pir/service/sensor-tag-datasource.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../../common/mat-module";
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from "../common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  standalone: true,
  providers: [SensorTagDatasourceService],
  imports:[CommonModule, MatModuleModule, DatapointTableComponent, ReactiveFormsModule, MeshNodesDatasourceFormComponent, MeshNodesDatapointsFormComponent, DatapointTableComponent],
  selector: 'app-sensor-tag-pir',
  templateUrl: './sensor-tag-pir.component.html',
  styleUrls: []
})
export class SensorTagPirComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new SensorTagPirPointLocatorModel();
  attributeCode!: AttributeCode;
  declare datapointForm: boolean;
  test: any;
  UIDICTIONARY : any;
  datasourceTitleName:any;


  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService,
              private _sensorTagDatasource: SensorTagDatasourceService) {
    super();
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.subs.add(this._sensorTagDatasource.sensorExportCode('sensor-tag-pir').subscribe((data: any) => {
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
