interface StaticData {
  key: string;
  value: string;
}


export const ACTIONSNODESTATUS: StaticData[] = [
  {key: 'NO_OTAP', value: 'NO OTAP'},
  {key: 'PROPAGATE_ONLY', value: 'PROPAGATE ONLY'},
  {key: 'PROPAGATE_AND_PROCESS', value: 'PROPAGATE AND PROCESS'},
  {key: 'PROPAGATE_AND_PROCESS_WITH_DELAY', value: 'PROPAGATE AND PROCESS WITH DELAY'},
  {key: 'LEGACY', value: 'LEGACY'},
];
