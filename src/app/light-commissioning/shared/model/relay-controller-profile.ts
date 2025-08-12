import {NodeSettingsModel} from './settings/node-settings.model';
import {PirSettingsModel} from './settings/pir-settings.model';
import {LuxSettingsModel} from './settings/lux-settings.model';
import {SwitchSettingsModel} from './settings/switch-settings.model';
import {BandSettingsModel} from './settings/band-settings.model';

export interface RelayControllerProfile {
  jsonDataType: 'RELAY_CONTROLLER.PROFILE';
  nodeSettings: NodeSettingsModel;
  pirSettingsEnabled: boolean;
  pirSettings: PirSettingsModel;
  luxSettingsEnabled: boolean;
  luxSettings: LuxSettingsModel;
  enoceanSwitchEnabled: boolean;
  switchSettings: SwitchSettingsModel;
  bandSettingsEnabled: boolean;
  bandSettings: BandSettingsModel;
}
