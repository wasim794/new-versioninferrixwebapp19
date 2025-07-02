import {Component, OnInit} from '@angular/core';
import {AttributeCode} from '../../model';import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService, DataPointService} from "../../../core/services";
import {InternalDatasourceModel,
  InternalDatasourceLocatorModel} from '../internal-datasource';
  import {LeakageDatasourceService} from '../internal-datasource/service/leakage-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import {MeshNodesDatasourceFormComponent, MeshNodesDatapointsFormComponent, DatapointTableComponent} from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, MeshNodesDatasourceFormComponent,
     MeshNodesDatapointsFormComponent, DatapointTableComponent],
  providers: [LeakageDatasourceService],
  selector: 'app-internal-datasource',
  templateUrl: './internal-datasource.component.html',
  styleUrls: []
})
export class InternalDatasourceComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new InternalDatasourceLocatorModel();
  attributeCode:any=  new AttributeCode();
  override datapointForm:boolean=false;
  datapointFormName:any;
  datasourceTitleName:any;
  UIDICTIONARY : any;

  constructor(public dictionaryService: DictionaryService, private sataPointService: DataPointService) {
    super();
  }

  ngOnInit() {
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    this.datapointFormName = this.datapointForms;
    this.datasourceTitleName = this.addCommonDataSourceName;
  }

  hideShow(event: any) {
    this.datapointForm = false;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.sataPointService.getByXid(dataPointXid).subscribe(data => {
        this.datapointForm = true;
        this.datapoints.datapointButtonsView = true;
        this.dataPoint = data;
        this.pointLocator = this.dataPoint.pointLocator;
      })
    );
  }
}
