import {IntStringPairModel} from '../../../core/models/pair/int-string-pair.model';

export interface GradeSettingsMap {
  jsonDataType: 'GRADE.MAPPING';
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
}
