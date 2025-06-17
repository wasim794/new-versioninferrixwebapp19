import {DatasourceModel} from '../../../model/datasourceModel';

export class BacnetDataSourceModel extends DatasourceModel {
  localDeviceConfig!: string;
  covSubscriptionTimeoutMinutes!: number;
}
