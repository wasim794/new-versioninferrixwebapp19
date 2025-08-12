export interface GpioSettingsModel {
  settingsType: 'GPIO_SETTINGS';
  enable: boolean;
  diPinOneOpen: string;
  diPinOneClose: string;
  diPinOneGradeType: string;
  diPinOneDimValue: number;
  diPinTwoOpen: string;
  diPinTwoClose: string;
  diPinTwoGradeType: string;
  diPinTwoDimValue: number;
  diPinThreeOpen: string;
  diPinThreeClose: string;
  diPinThreeGradeType: string;
  diPinThreeDimValue: number;
  diPinFourOpen: string;
  diPinFourClose: string;
  diPinFourGradeType: string;
  diPinFourDimValue: number;
}
