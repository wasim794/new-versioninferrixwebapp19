import {StaticData} from "../../../common";

export const MODE: StaticData[] = [
  {key: 'COOLING', value: 'Cooling'},
  {key: 'HEATING', value: 'Heating'},
  {key: 'VENTILATION', value: 'Ventilation'}
];

export const FAN_SPEED: StaticData[] = [
  {key: 'AUTO', value: 'Auto'},
  {key: 'HIGH', value: 'High'},
  {key: 'MEDIUM', value: 'Medium'},
  {key: 'LOW', value: 'Low'}
];

export const COMMONACTIONS:any=[
  {key:true, value:"ON"},
  {key:false, value:"OFF"}
]

export const LOCK_UNLOCK:any=[
  {key:true, value:"LOCK"},
  {key:false, value:"UNLOCK"}
]
