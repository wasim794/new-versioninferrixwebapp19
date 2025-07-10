import {BooleanStaticData, StaticData} from '../../../../common';

export const SNMP_VERSIONS: StaticData[] = [
  {key: 'v1', value: 'v1'},
  {key: 'v2c', value: 'v2c'},
  {key: 'v3', value: 'v3'}
];

export const AUTH_PROTOCOLS: StaticData[] = [
  {key: 'NONE', value: 'NONE'},
  {key: 'MD5', value: 'MD5'},
  {key: 'SHA', value: 'SHA'}
];

export const PRIVATE_PROTOCOLS: StaticData[] = [
  {key: 'NONE', value: 'NONE'},
  {key: 'DES', value: 'DES'},
  {key: 'AES128', value: 'AES128'},
  {key: 'AES192', value: 'AES192'},
  {key: 'AES256', value: 'AES256'}
];

export const SET_TYPES: StaticData[] = [
  {key: 'NONE', value: 'None'},
  {key: 'INTEGER_32', value: 'Integer 32 Bits'},
  {key: 'OCTET_STRING', value: 'Octet String'},
  {key: 'OID', value: 'Oid'},
  {key: 'IP_ADDRESS', value: 'Ip Address'},
  {key: 'COUNTER_32', value: 'Counter 32 Bits'},
  {key: 'GAUGE_32', value: 'Gauge 32 Bits'},
  {key: 'TIME_TICKS', value: 'Time Ticks'},
  {key: 'OPAQUE', value: 'Opaque'},
  {key: 'COUNTER_64', value: 'Counter 64 Bits'}
];

export const POLLING: BooleanStaticData[] = [
  {key: false, value: 'Poll and Trap'},
  {key: true, value: 'Trap only'}
];
