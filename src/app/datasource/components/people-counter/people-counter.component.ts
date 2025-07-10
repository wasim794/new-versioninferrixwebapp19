import {DataSourceBase} from "../common/dataSourceBase";
import {Component, OnInit} from "@angular/core";
import {AttributeCode} from "../../model";
import {DictionaryService, DataPointService} from "../../../core/services";
import {PeopleCounterLocatorModel, PeopleCounterDatasourceModel} from '../people-counter';
import {PeopleCounterDatasourceService} from '../people-counter/service/people-counter-datasource.service';
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from "../common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatModuleModule } from "../../../common/mat-module";

@Component({
  standalone: true,
  imports: [CommonModule, MatMenuModule, DatapointTableComponent, ReactiveFormsModule, MeshNodesDatasourceFormComponent,
    MeshNodesDatapointsFormComponent, MatModuleModule],
  providers: [DictionaryService, DataPointService, PeopleCounterDatasourceService],
  selector: 'app-people-counter',
  templateUrl: './people-counter.component.html',
  styleUrls: []
})
export class PeopleCounterComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new PeopleCounterLocatorModel();
  attributeCode:any = new AttributeCode();
  declare datapointForm: boolean;
  test: any;
  datasourceTitleName:any;
  datasourceName:any =  new PeopleCounterDatasourceModel();
  UIDICTIONARY:any;

  constructor(private dataPointService: DataPointService,
              public dictionaryService: DictionaryService,
              private _peopleCounterDatasource: PeopleCounterDatasourceService) {
    super();
  }

  ngOnInit() {
    this.subs.add(this._peopleCounterDatasource.sensorExportCode('people-counter').subscribe((data: any) => {
        this.attributeCode = data;
      })
    );
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
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
