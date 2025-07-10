import {CommonService} from '../../../../services/common.service';
import {AUTH_PROTOCOLS, POLLING, PRIVATE_PROTOCOLS, SET_TYPES, SNMP_VERSIONS} from './snmp-static-data';
import {BooleanStaticData, DATA_TYPES, StaticData, TIME_PERIOD_TYPES} from '../../../../common/static-data/static-data';

export class SnmpDropdownData {
  private _permissions: string[] = [];
  private _snmpVersions = SNMP_VERSIONS;
  private _privateProtocols = PRIVATE_PROTOCOLS;
  private _authProtocols = AUTH_PROTOCOLS;
  private _setTypes = SET_TYPES;
  private _pollingPeriodType = TIME_PERIOD_TYPES;
  private _dataTypes = DATA_TYPES;
  private _polling = POLLING;

  constructor(
    private _commonService: CommonService,
  ) {
  }

  public setArrays(): void {
    this._commonService.getPermission().subscribe((data) => {
      this._permissions = data;
    });
  }

  get permissions(): string[] {
    return this._permissions;
  }

  get snmpVersions(): StaticData[] {
    return this._snmpVersions;
  }

  get privateProtocols(): StaticData[] {
    return this._privateProtocols;
  }

  get authProtocols(): StaticData[] {
    return this._authProtocols;
  }

  get setTypes(): StaticData[] {
    return this._setTypes;
  }

  get pollingPeriodType(): StaticData[] {
    return this._pollingPeriodType;
  }

  get dataTypes(): StaticData[] {
    return this._dataTypes;
  }

  get polling(): BooleanStaticData[] {
    return this._polling;
  }
}
