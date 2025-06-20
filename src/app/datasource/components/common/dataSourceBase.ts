import {EventEmitter, Output, ViewChild, Component, Input} from '@angular/core';
import {DatapointTableComponent} from './datapoint-table';
import {DataPointModel} from '../../model';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {MeshNodesDatasourceFormComponent} from './mesh-nodes-datasource-form';
import {MeshNodesDatapointsFormComponent} from './mesh-nodes-datapoints-form';
import {MeshNodesDatasourceModel} from '../../model/sensors/mesh-nodes-datasource.model';

@Component({
  template: ''
})
export abstract class DataSourceBase extends UnsubscribeOnDestroyAdapter {
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  @Input() datapointForm: any;
  datapointForms: boolean=false;
  @ViewChild(MeshNodesDatapointsFormComponent, {static: true})
  public datapoints!: MeshNodesDatapointsFormComponent;
  @ViewChild(MeshNodesDatasourceFormComponent, {static: true})
  public datasource!: MeshNodesDatasourceFormComponent;
  @ViewChild(DatapointTableComponent, { static: true })
  public datapointTableComponent!: DatapointTableComponent;
  tabIndex = 0;
  dataPoint: any = new DataPointModel();
  currentDatapointIndex: any;
  addCommonDataSourceName!:string;


  constructor() {
    super();
  }

  addNewDatasource(dsType: any) {
    this.datasource.addNew(dsType);
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  getDataSource(datasource: MeshNodesDatasourceModel, index: number, editForm: any) {
    this.datapointForm = false;
    this.datapointForms = true;
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);

    }
    this.dataPoint.dataSourceXid = datasource.xid;
    // this.datasource.setData(datasource);
    this.getDataPoints(datasource);
     this.addCommonDataSourceName = datasource.name;

  }

  addNewDatapoint(dsXid: any, index: any) {
    console.log(dsXid);
    if (!dsXid) {
      alert('Add datasource first');
       return false;
    }
    this.datapointForm = true;
    this.datapoints.datapointButtonsView = false;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.dataPoint.dataSourceXid = dsXid;
    return true;
  }

  getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource);
  }

  dpTableAfterSaved(datapoint: any) {
    this.datapointTableComponent.addDatapointToTable(this.dataPoint);
  }

  dpTableAfterUpdated(datapoint: any) {
    this.dataPoint = datapoint;
    this.datapointTableComponent.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
    this.datapointTableComponent.dataPoints.filter = '';
    this.datapointTableComponent.updatedData(this.dataPoint.xid);
  }

  sendSavedDatasource(data: MeshNodesDatasourceModel) {
    this.getDataPoints(data);
    this.addedSavedDatasource.emit(data);
  }

  sendUpdatedDatasource(data: any) {
    this.addedUpdatedDatasource.emit(data);
  }
}
