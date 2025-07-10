import {ATTRIBUTE, DEVICE_TYPE} from "./sl-bus-static-data";
import {CommonService} from "../../../../services/common.service";
import {StaticData} from "../../../../common/static-data/static-data";

export class SlBusDropdownData {
  private _permissions: string[] = [];
  private _deviceType = DEVICE_TYPE;
  private _attributes = ATTRIBUTE;

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

  get deviceType(): StaticData[] {
    return this._deviceType;
  }

  get attributes(): StaticData[] {
    return this._attributes;
  }
}
