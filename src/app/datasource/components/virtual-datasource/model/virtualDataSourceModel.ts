import {DatasourceModel} from '../../../model/datasourceModel';

export class VirtualDataSourceModel extends DatasourceModel {
  override enabled =  false;
  override modelType = 'VIRTUAL.DS';
}

