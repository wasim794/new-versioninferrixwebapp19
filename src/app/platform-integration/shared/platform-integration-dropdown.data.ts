import {StaticData} from "../../common";

export const DEVICE_PROFILE_PROVISION_TYPE: StaticData[] = [
  {value: "Disabled", key: "DISABLED"},
  {value: "Allow create new devices", key: "ALLOW_CREATE_NEW_DEVICES"},
  {value: "Check pre-provisioned devices", key: "CHECK_PRE_PROVISIONED_DEVICES"},
  {value: "X509 Certificate Chain", key: "X509_CERTIFICATE_CHAIN"}
];

export const DEVICE_TRANSPORT_TYPE: StaticData[] = [
  {value: "Default", key: "DEFAULT"},
  {value: "MQTT", key: "MQTT"},
  {value: "COAP", key: "COAP"},
  {value: "LWM2M", key: "LWM2M"},
  {value: "SNMP", key: "SNMP"}
];

export const DEVICE_PROFILE_TYPE: StaticData[] = [
  {value: "Default", key: "DEFAULT"}
];
