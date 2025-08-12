import {AbstractNodeModel} from './abstract-node.model';
import {WristBandProfile} from '../wrist-band-profile';

export interface WristBandNodeModel extends AbstractNodeModel {
  profile: WristBandProfile;
}
