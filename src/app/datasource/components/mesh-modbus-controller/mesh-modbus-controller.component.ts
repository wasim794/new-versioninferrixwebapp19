import {Component, OnInit} from '@angular/core';
import {DataPointService} from '../../../core/services';
import {AttributeCode} from '../../model';
import {DataSourceBase} from '../common/dataSourceBase';
import {DictionaryService} from "../../../core/services";
import {MeshModbusDatasourceModel, MeshModbusPointlocatorModel} from '../mesh-modbus-controller';
import {MeshModbusDatasourceService} from '../mesh-modbus-controller/service/mesh-modbus-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';


@Component({
  standalone: true,
  providers: [MeshModbusDatasourceService],
  imports:[CommonModule, MatModuleModule, MeshNodesDatasourceFormComponent, MeshNodesDatapointsFormComponent, DatapointTableComponent],
  selector: 'app-mesh-modbus-controller',
  templateUrl: './mesh-modbus-controller.component.html',
  styleUrls: []
})
export class MeshModbusControllerComponent extends DataSourceBase implements OnInit {
  pointLocator: any = new MeshModbusPointlocatorModel();
  attributeCode:any= new AttributeCode();
  declare datapointForm: boolean;
  UIDICTIONARY : any;
  datasourceTitleName: any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService,
              private MeshModbusDatasource: MeshModbusDatasourceService) {
    super();
  }

  ngOnInit() {
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
        this.pointLocator = this.dataPoint.pointLocator;
      })
    );
  }
}
