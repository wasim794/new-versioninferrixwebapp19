import {BasicModel} from '../../common/model/basicModel';
import {WatchListPointModel} from './watchListPointModel';

export class WatchList extends BasicModel {
  userName!: string;
  pointModels!: WatchListPointModel[];
  readPermission!: string;
  editPermission!: string;
}
