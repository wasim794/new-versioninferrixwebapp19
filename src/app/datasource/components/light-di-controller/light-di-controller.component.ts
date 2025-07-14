import {Component, OnInit} from '@angular/core';
import {AttributeCode} from '../../model';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService, DataPointService} from "../../../core/services";
import {LightDiControllerLocatorModel, LightDiControllerModel} from '../light-di-controller';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  providers: [DictionaryService, DataPointService],
  imports: [CommonModule, MatModuleModule, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent, DatapointTableComponent],
  selector: 'app-light-di-controller',
  templateUrl: './light-di-controller.component.html',
  styleUrls: []
})
export class LightDiControllerComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new LightDiControllerLocatorModel();
  attributeCode:any = new AttributeCode();
  declare datapointForm: boolean;
  UIDICTIONARY : any;
   datasourceTitleName:any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService) {

    super();
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('dataSource').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
    this.subs.add(this.dataPointService.getSensorExportCode('light-di-controller').subscribe((data: any) => {
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
