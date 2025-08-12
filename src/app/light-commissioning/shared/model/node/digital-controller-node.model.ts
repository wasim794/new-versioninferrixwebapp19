import {DigitalControllerProfileModel} from '../digital-controller-profile.model';
import {DigitalControllerProfile} from '../digital-controller-profile';
import {AbstractNodeModel} from './abstract-node.model';

export interface DigitalControllerNodeModel extends AbstractNodeModel {
  profile: DigitalControllerProfile;
}
