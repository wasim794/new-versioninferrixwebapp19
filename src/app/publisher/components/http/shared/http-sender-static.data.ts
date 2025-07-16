import {BooleanStaticData, StaticData} from '../../../../common/static-data/static-data';

export const HTTP_METHODS: BooleanStaticData[] = [
  {value: 'Get', key: false},
  {value: 'Post', key: true}
];

export const DATE_FORMATS: StaticData[] = [
  {value: 'Basic', key: 'DATE_FORMAT_BASIC'},
  {value: 'Time Zone', key: 'DATE_FORMAT_TZ'},
  {value: 'UTC', key: 'DATE_FORMAT_UTC'}
];
