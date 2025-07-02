import {CommonService} from '../../../../services/common.service';
import {DATA_TYPES, StaticData} from '../../../../common';

export class HttpReceiverDropdownData {
  private _permissions: string[] = [];
  private _dataTypes = DATA_TYPES;

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

  get dataTypes(): StaticData[] {
    return this._dataTypes;
  }
}
