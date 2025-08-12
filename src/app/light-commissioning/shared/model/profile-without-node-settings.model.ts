import {PirSettingsModel} from './settings/pir-settings.model';
import {LuxSettingsModel} from './settings/lux-settings.model';
import {SwitchSettingsModel} from './settings/switch-settings.model';
import {BandSettingsModel} from './settings/band-settings.model';
import {GpioSettingsModel} from './settings/gpio-settings.model';

export interface ProfileWithoutNodeSettingsModel {
  pirSettingsEnabled: boolean;
  pirSettings: PirSettingsModel;
  luxSettingsEnabled: boolean;
  luxSettings: LuxSettingsModel;
  enoceanSwitchEnabled: boolean;
  switchSettings: SwitchSettingsModel;
  bandSettingsEnabled: boolean;
  bandSettings: BandSettingsModel;
  gpioSettingsEnabled: boolean;
  gpioSettings: GpioSettingsModel;
}
