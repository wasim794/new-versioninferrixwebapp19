import {NodeSettingsModel} from './settings/node-settings.model';
import {GpioSettingsModel} from './settings/gpio-settings.model';

export interface DigitalControllerProfile {
  jsonDataType: 'DIGITAL_INPUT_CONTROLLER.PROFILE';
  nodeSettings: NodeSettingsModel;
  gpioSettingsEnabled: boolean;
  gpioSettings: GpioSettingsModel;
}
