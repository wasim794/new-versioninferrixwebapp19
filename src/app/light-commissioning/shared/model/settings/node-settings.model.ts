export interface NodeSettingsModel {
  settingsType: 'NODE_SETTINGS';
  site: number;
  building: number;
  floor: number;
  zone: number;
  room: number;
  group: number;
  type: number;
  holdTime: number;
  enableHoldTimeOne: boolean;
  dimValueOne: number;
  holdTimeOne: number;
  enableHoldTimeTwo: boolean;
  dimValueTwo: number;
  holdTimeTwo: number;
  wattage: number;
  curveDimTime: string;
  autoMode: boolean;
}
