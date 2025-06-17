import {BAUD_RATES, NumericStaticData, StaticData, TIME_PERIOD_TYPES} from '../../../../common';
import {ExportCodeModel} from '../../../../core/models/utils';
import {CommonService} from '../../../../services/common.service';
import {BacnetMSTPDatasourceService} from '../../banet-mstp';

export class BacnetDropdownData {
  private _permissions: string[] = [];
  private _readPermission: string[] = [];
  private _objectTypes: StaticData[] = [];
  private _pollingPeriodType = TIME_PERIOD_TYPES;

  constructor(
    private bacnetMSTPService: BacnetMSTPDatasourceService,
    private commonService: CommonService,
  ) {
  }

  public setArrays(): void {
    this.bacnetMSTPService.getObjectTypeUrl().subscribe((data: StaticData[]) => {
      this._objectTypes = data;
    });

    this.commonService.getPermission().subscribe((data) => {
      this._permissions = data;
    });
    this.commonService.getPermission().subscribe((data) => {
      this._readPermission = data;
    });
  }

  get objectTypes(): StaticData[] {
    return this._objectTypes;
  }


  get pollingPeriodType(): StaticData[] {
    return this._pollingPeriodType;
  }

  get permissions(): string[] {
    return this._permissions;
  }
  get readPermission(): string[] {
    return this._readPermission;
  }
}
