import {SwitchDataModel} from './switch-data.model';

export interface SwitchSettingsModel {
  settingsType: 'SWITCH_SETTINGS';
  switchData: SwitchDataModel[];
}
