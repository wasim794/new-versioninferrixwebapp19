export interface LuxSettingsModel {
  settingsType: 'LUX_SETTINGS';
  name: string;
  luxMax: number;
  luxMin: number;
  luxLowerThreshold: number;
  gradeType: string;
  address: string;
  enable: boolean;
  thresholdMax: number;
  thresholdMin: number;
}
