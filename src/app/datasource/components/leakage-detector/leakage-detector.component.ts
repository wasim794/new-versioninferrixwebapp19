import {Component, OnInit} from '@angular/core';
import {AttributeCode} from '../../model';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService, DataPointService} from "../../../core/services";
import {LeakageDetectorsModel, LeakageDetectorModel} from '../leakage-detector';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent, DatapointTableComponent],
  providers: [DictionaryService, DataPointService],
  selector: 'app-leakage-detector',
  templateUrl: './leakage-detector.component.html',
  styleUrls: []
})
export class LeakageDetectorComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new LeakageDetectorsModel();
  attributeCode:any=new  AttributeCode();
  declare datapointForm: boolean;
  UIDICTIONARY : any;
  datasourceTitleName:any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.subs.add(this.dataPointService.getSensorExportCode('water-leakage-detector').subscribe((data: any) => {
        this.attributeCode.codes = data;
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
