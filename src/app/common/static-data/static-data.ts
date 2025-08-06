import {Description} from "../model/description";
// import {publish} from "rxjs-compat/operator/publish";

interface StaticData {
  key: string;
  value: string;
}


interface NumericStaticData {
  key: string;
  value: number;
}

interface NumericKeyStaticData {
  key: number;
  value: string;
}

interface BooleanStaticData {
  key: boolean;
  value: string;
}

interface KeyValueWithFilterStaticData {
  key: string,
  value: string,
  filter: Array<string>
}

export type {KeyValueWithFilterStaticData,StaticData,
  BooleanStaticData,NumericKeyStaticData,NumericStaticData};
//end assign function in core


export const DATA_TYPES: StaticData[] = [
  {key: 'BINARY', value: 'BINARY'},
  {key: 'MULTISTATE', value: 'MULTISTATE'},
  {key: 'NUMERIC', value: 'NUMERIC'},
  {key: 'ALPHANUMERIC', value: 'ALPHANUMERIC'},
];

export const TIME_PERIOD_TYPES: StaticData[] = [
  {key: 'Milliseconds', value: 'MILLISECONDS'},
  {key: 'Seconds', value: 'SECONDS'},
  {key: 'Minutes', value: 'MINUTES'},
  {key: 'Hours', value: 'HOURS'},
  {key: 'Days', value: 'DAYS'},
  {key: 'Weeks', value: 'WEEKS'},
  {key: 'Months', value: 'MONTHS'},
  {key: 'Years', value: 'YEARS'},
];

export const BAUD_RATES: NumericStaticData[] = [
  {key: '1', value: 110},
  {key: '2', value: 300},
  {key: '3', value: 1200},
  {key: '4', value: 2400},
  {key: '5', value: 4800},
  {key: '6', value: 9600},
  {key: '7', value: 19200},
  {key: '8', value: 38400},
  {key: '9', value: 57600},
  {key: '10', value: 115200},
  {key: '11', value: 230400},
  {key: '12', value: 460800},
  {key: '13', value: 921600},
];

export const COMMENT_TYPES: StaticData[] = [
  {key: 'Point', value: 'POINT'},
  {key: 'Event', value: 'EVENT'},
  {key: 'Json Data', value: 'JSON_DATA'}
];

export const Alarm_level: StaticData[] = [
  {key: 'None', value: 'NONE'},
  {key: 'Information', value: 'INFORMATION'},
  {key: 'Warning', value: 'WARNING'},
  {key: 'Urgent', value: 'URGENT'},
  {key: 'Critical', value: 'CRITICAL'},
  {key: 'Emergency', value: 'EMERGENCY'},
  {key: 'Do Not Log', value: 'DO_NOT_LOG'},
  {key: 'Ignore', value: 'IGNORE'}
];

export const action_Types: StaticData[] = [
  {key: 'On', value: 'LIGHT_ON'},
  {key: 'Off', value: 'LIGHT_OFF'},
  {key: 'Auto', value: 'LIGHT_AUTO'},
  {key: 'Dim', value: 'LIGHT_DIM'}


];


export const grade_Types: StaticData[] = [
  {key: 'None', value: 'NULL'},
  {key: 'Site', value: 'SITE'},
  {key: 'Building', value: 'BUILDING'},
  {key: 'Floor', value: 'FLOOR'},
  {key: 'Room', value: 'ROOM'},
  {key: 'Zone', value: 'ZONE'},
  {key: 'Group', value: 'GROUP'}

];


export const ALARM_TYPES: StaticData[] = [
  {key: 'None', value: 'NULL'},
  {key: 'Warning', value: 'WARNING'},
  {key: 'Urgent', value: 'URGENT'},
  {key: 'Critical', value: 'CRITICAL'},
  {key: 'Emergency', value: 'EMERGENCY'},
];

export const EventTypes: StaticData[] = [
  {key: 'Datasource', value: 'DATASOURCE'},
  {key: 'System', value: 'SYSTEM'},
  {key: 'Publisher', value: 'PUBLISHER'},
  {key: 'Audit Event', value: 'AUDITEVENT'}
];

export const PURGE_TIME_PERIOD_TYPES: StaticData[] = [
  {key: 'MINUTES', value: 'MINUTES'},
  {key: 'HOURS', value: 'HOURS'},
  {key: 'Days', value: 'DAYS'},
  {key: 'Weeks', value: 'WEEKS'},
  {key: 'Months', value: 'MONTHS'},
  {key: 'Years', value: 'YEARS'},
];

export const POLLING_PERIOD_TYPE: StaticData[] = [
  {key: 'HOURS', value: 'HOURS'},
  {key: 'DAYS', value: 'DAYS'},
  {key: 'WEEKS', value: 'WEEKS'},
  {key: 'MONTHS', value: 'MONTHS'},
  {key: 'YEARS', value: 'YEARS'},
  {key: 'MINUTES', value: 'MINUTES'},
  {key: 'SECONDS', value: 'SECONDS'}
];

export const RECIPIENT_TYPES: StaticData[] = [
  {value: 'Alert List', key: 'ALERT_LIST'},
  {value: 'User Email Address', key: 'USER_EMAIL_ADDRESS'},
  {value: 'Email Address', key: 'EMAIL_ADDRESS'},
  {value: 'User Phone Number', key: 'USER_PHONE_NUMBER'},
  {value: 'Phone Number', key: 'PHONE_NUMBER'}
];

export const EMAIL_RECIPIENT_TYPES: StaticData[] = [
  {value: 'User Email Address', key: 'USER_EMAIL_ADDRESS'},
  {value: 'Email Address', key: 'EMAIL_ADDRESS'}
];

export const SMS_RECIPIENT_TYPES_EMAIL: StaticData[] = [
  {value: 'User Email Address', key: 'USER_EMAIL_ADDRESS'},
  {value: 'Email Address', key: 'EMAIL_ADDRESS'}
];

export const SMS_RECIPIENT_TYPES: StaticData[] = [
  {value: 'User Phone Number', key: 'USER_PHONE_NUMBER'},
  {value: 'Phone Number', key: 'PHONE_NUMBER'}
];

export const EVENT_SOURCE_TYPES: StaticData[] = [
  {value: 'All', key: 'All'},
  {value: 'PointEventDetectors', key: 'Point Event Detectors'},
  {value: 'ScheduledEvents', key: 'Scheduled events'},
  {value: 'CompoundEventDetectors', key: 'Compound event detectors'},
  {value: 'DataSourceEvents', key: 'Data source events'},
  {value: 'PublisherEvents', key: 'Publisher events'},
  {value: 'MaintenanceEvents', key: 'Maintenance events'},
  {value: 'SystemEvents', key: 'System events'},
  {value: 'AuditEvents', key: 'Audit events'},
];

export const EVENT_ALARM_LEVEL: StaticData[] = [
  {key: 'All', value: 'ALL'},
  {key: 'None', value: 'NONE'},
  {key: 'Information', value: 'INFORMATION'},
  {key: 'Warning', value: 'WARNING'},
  {key: 'Urgent', value: 'URGENT'},
  {key: 'Critical', value: 'CRITICAL'},
  {key: 'Emergency', value: 'EMERGENCY'}
];

export const EVENT_STATUS: StaticData[] = [
  {key: 'All', value: 'ALL'},
  {key: 'Active', value: 'ACTIVE'},
  {key: 'Returned to Normal', value: 'RETURNED_TO_NORMAL'},
  {key: 'NO RTN', value: 'NO_RTN'}
];

export const EVENT_TABLE_COLUMNS: StaticData[] = [
  {key: 'Id', value: 'ID'},
  {key: 'Alarm Level', value: 'ALARM_LEVEL'},
  {key: 'Time', value: 'TIME'},
  {key: 'Message', value: 'MESSAGE'},
  {key: 'Inactive Time', value: 'INACTIVE_TIME'},
  {key: 'Action', value: 'ACTION'},
];

export const comparisonModeType = [
  {value: 'Greater Than', key: 'GREATER_THAN'},
  {value: 'Greater Than Or Equals', key: 'GREATER_THAN_OR_EQUALS'},
  {value: 'Less Than', key: 'LESS_THAN'},
  {value: 'Less Than Or Equals', key: 'LESS_THAN_OR_EQUALS'}
];

export const calculationModeType = [
  {value: 'Instantaneous', key: 'INSTANTANEOUS'},
  {value: 'Average', key: 'AVERAGE'}
];

const allBinary = [{key: 'Alternate', val: 'ALTERNATE_BOOLEAN'}, {key: 'No change', val: 'NO_CHANGE'}, {
  key: 'Random',
  val: 'RANDOM_BOOLEAN'
}];
const allMultistate = [{key: 'Increment', val: 'INCREMENT_MULTISTATE'}, {key: 'No change', val: 'NO_CHANGE'}, {
  key: 'Random',
  val: 'RANDOM_MULTISTATE'
}];
const allNumeric = [{key: 'Brownian', val: 'BROWNIAN'}, {key: 'Increment', val: 'INCREMENT_ANALOG'}, {
  key: 'No change',
  val: 'NO_CHANGE'}, {key: 'Random', val: 'RANDOM_ANALOG'}, {key: 'Attractor', val: 'ANALOG_ATTRACTOR'},
  {key: 'Decrement', val: 'DECREMENT_ANALOG'}];
const allAlphanumeric = [{key: 'No change', val: 'NO_CHANGE'}];
const allPollingPeriodType = [{key: 'seconds', val: 'SECONDS'}, {key: 'minutes', val: 'MINUTES'}, {
  key: 'hours',
  val: 'HOURS'
}];
const allStartValue= [{key: 'true', val: 'True'}, {key: 'false', val: 'False'}];

const newLogingType = [{key: 'ON_CHANGE', val: 'When point value changes'}, {key: 'ALL', val: 'All data'},
  {key: 'NONE', val: 'Do not log'}, {key: 'INTERVAL', val: 'Interval'}, {
    key: 'ON_TS_CHANGE',
    val: 'When point timestamp changes'
  }];

const newPollingPeriodType= [
  {key: 'MINUTES', val: 'Minutes'}, {key: 'HOURS', val: 'Hours'},
  {key: 'DAYS', val: 'Days'}, {key: 'WEEKS', val: 'Weeks'}, {key: 'MONTH', val: 'Months'},
  {key: 'YEARS', val: 'Years'}];

const newIntervalLoggingType = [{key: 'INSTANT', val: 'Instant'}, {key: 'MAXIMUM', val: 'Maximum'}, {
  key: 'MINIMUM',
  val: 'Minimum'
}, {key: 'AVERAGE', val: 'Average'}];

export {allBinary, allMultistate,allNumeric,allAlphanumeric,allPollingPeriodType,
  allStartValue,newLogingType, newPollingPeriodType,newIntervalLoggingType};

const newTypes = [{key: 'textRendererAnalog', val: 'Analog', dataType: ['NUMERIC']},
  {key: 'textRendererBinary', val: 'Binary', dataType: ['BINARY']},
  {key: 'textRendererMultistate', val: 'Multistate', dataType: ['MULTISTATE']},
  {key: 'textRendererNone', val: 'None', dataType: ['IMAGE']},
  {key: 'textRendererPlain', val: 'Plain', dataType: ['BINARY', 'ALPHANUMERIC', 'MULTISTATE', 'NUMERIC']},
  {key: 'textRendererRange', val: 'Range', dataType: ['NUMERIC']},
  {key: 'textRendererTime', val: 'Time', dataType: ['NUMERIC']}];

const newQosType = [{key: 'AT_MOST_ONCE', args: 'AT MOST ONCE'}, {key: 'ATLEAST_ONCE', args: 'ATLEAST ONCE'},
  {key: 'EXACTLY_ONCE', args: 'EXACTLY ONCE'}, {key: 'FAILURE', args: 'FAILURE'}];

const contentTypes = [{name: 'CONTENT_TYPE_BOTH', val: 0},
  {name: 'CONTENT_TYPE_HTML', val: 1} ,
  {name: 'CONTENT_TYPE_TEXT ', val: 2}];

export {newTypes,newQosType, contentTypes};




export enum ContextUpdateEvent {
  UPDATE = 0,
  CHANGE = 1,
  LOGGED = 2
}


export const updateEvents: StaticData[] = [
  {value: 'NONE', key: 'NONE'},
  {value: 'MINUTES', key: 'Start of minute'},
  {value: 'HOURS', key: 'Start of hour'},
  {value: 'DAYS', key: 'DAYS'},
  {value: 'WEEKS', key: 'Start of week'},
  {value: 'MONTHS', key: 'Start of month'},
  {value: 'YEARS', key: 'Start of year'},
  {value: 'CRON', key: 'Cron pattern'}
];
