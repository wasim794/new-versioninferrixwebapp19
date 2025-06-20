import {Component, OnInit} from '@angular/core';
import {MeshNodesPointLocatorModel} from '../../model/sensors/mesh-nodes-point-locator.model';
import {AttributeCode} from '../../model';
import {DataPointService, DictionaryService} from '../../../core/services';
import {DataSourceBase} from '../common/dataSourceBase';
import {AssetTagDatasourceService} from '../../components/asset-tag';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [MatModuleModule],
  providers: [DataPointService, DictionaryService],
  selector: 'app-asset-tag',
  templateUrl: './asset-tag.component.html',
  styleUrls: []
})
export class AssetTagComponent extends DataSourceBase implements OnInit {
 public  pointLocator              : any;
 public  attributeCode!             : AttributeCode;
 declare public datapointForm: boolean;
 public  UIDICTIONARY              : any;
 public  datasourceTitleName       : any;
  declare datapoints: any;

  constructor(public dictionaryService   : DictionaryService,
              private dataPointService   : DataPointService,
              private _assetTagDatasource: AssetTagDatasourceService) {
    super();
  }

  ngOnInit() {
           this.dictionaryService.getUIDictionary('core').subscribe(data=>{
           this.UIDICTIONARY        = this.dictionaryService.uiDictionary;
           });
    //        this.subs.add(this._assetTagDatasource.sensorExportCode('student-tag').subscribe((data: AttributeCode) => {
    //        this.attributeCode       = data;
    //   })
    // );
           this.datasourceTitleName = this.addCommonDataSourceName;
  }

  hideShow(event: any) {
    this.datapointForm = false;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid         = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.dataPointService.getByXid(dataPointXid).subscribe(data => {
        this.datapointForm     = true;
        this.datapoints.datapointButtonsView = true;
        this.dataPoint         = data;
        this.pointLocator      = this.dataPoint.pointLocator;
      })
    );
  }
}
