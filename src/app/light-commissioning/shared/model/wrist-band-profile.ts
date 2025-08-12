import {WristBandSettingsModel} from './settings/wrist-band-settings.model';

export interface WristBandProfile {
    jsonDataType: 'WRIST_BAND.PROFILE';
    wristBandSettings: WristBandSettingsModel;
}
