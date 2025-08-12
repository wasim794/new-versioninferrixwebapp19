import {ControllerProfileModel} from '../controller-profile.model';
import {AbstractNodeModel} from './abstract-node.model';
import { ControllerProfile } from '..';

export interface ControllerNodeModel extends AbstractNodeModel {
  profile: ControllerProfile;
}
