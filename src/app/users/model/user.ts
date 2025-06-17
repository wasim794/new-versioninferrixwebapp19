import {BasicModel} from '../../common/model/basicModel';

export class User extends BasicModel {
  username!: string;
  password!: string;
  email!: string;
  phone!: string;
  admin = false;
  disabled = false;
  lastLogin: any;
  receiveAlarmEmails!: number;
  receiveOwnAuditEvents = false;
  permissions!: string;
}
