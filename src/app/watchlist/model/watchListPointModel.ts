import {BasicModel} from '../../common/model/basicModel';
export abstract class WatchListPointModel extends BasicModel {
  deviceName!: string;
  settable!: boolean;
  status: any;
  time: any;
}
