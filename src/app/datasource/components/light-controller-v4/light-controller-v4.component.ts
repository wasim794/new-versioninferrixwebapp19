import {Component, OnInit} from '@angular/core';
import {AttributeCode} from '../../model';
import {LightControllerV4LocatorModel, LightControllerV4Model} from '../light-controller-v4';
import {LightControllerV4DatasourceService} from '../light-controller-v4/service/light-controller-v4-datasource.service';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService, DataPointService} from "../../../core/services";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent, DatapointTableComponent],
  providers: [LightControllerV4DatasourceService, DataPointService, DictionaryService],

  selector: 'app-light-controller-v4',
  templateUrl: './light-controller-v4.component.html',
  styleUrls: []
})
export class LightControllerV4Component extends DataSourceBase implements OnInit {

  pointLocator: any = new LightControllerV4LocatorModel();
  attributeCode:any = new AttributeCode();
  declare datapointForm: boolean;
  UIDICTIONARY : any;
  datasourceTitleName: any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService,
              private _lightControllerV4service: LightControllerV4DatasourceService
  ) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('dataSource').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.subs.add(this.dataPointService.getSensorExportCode('light-controller-v4').subscribe((data: any) => {
        this.attributeCode.codes = data;
      })
    );

    this.datasourceTitleName = this.addCommonDataSourceName;

  }

  cancelDataPoint() {
    this.datapointForm = false;
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
