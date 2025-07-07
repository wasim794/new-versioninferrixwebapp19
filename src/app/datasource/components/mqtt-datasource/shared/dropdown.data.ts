import {StaticData} from "../../../../common/static-data/static-data";
export const PUBLISHER_TOPIC_TYPE: StaticData[] = [
  {value: 'None', key: 'NONE'},
  {value: 'Plain', key: 'PLAIN'},
  {value: 'Json', key: 'JSON'},
  {value: 'Json With Timestamp', key: 'JSON_WITH_TIMESTAMP'},
  {value: 'Inferrix Json', key: 'INFERRIX_JSON'},
  {value: 'Generic Json', key: 'DATASOURCE_PUBLISHER'},
  {value: 'Platform Json', key: 'THINGSBOARD'}
];

export const SUBSCRIBERS_TOPIC_TYPE: StaticData[] = [
  {value: 'Inferrix Json', key: 'INFERRIX_JSON'},
  {value: 'Led Asset Tracking', key: 'LED_ASSET_TRACKING'},
  {value: 'Platform Json', key: 'THINGSBOARD'},
  {value: 'Platform Subscriber', key: 'THINGSBOARD_SUBSCRIPTION'}
];

export const QOS_TYPE: StaticData[] = [
  {value: 'At Most Once', key: 'AT_MOST_ONCE'},
  {value: 'Atleast Once', key: 'ATLEAST_ONCE'},
  {value: 'Exactly Once', key: 'EXACTLY_ONCE'},
  {value: 'Failure', key: 'FAILURE'}
];
