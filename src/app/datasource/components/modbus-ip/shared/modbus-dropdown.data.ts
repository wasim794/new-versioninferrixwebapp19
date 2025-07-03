import {ModbusAttributeIpService} from '../../modbus-ip';
import {SerialPortsService} from '../../../../core/services';
import {BAUD_RATES, NumericStaticData, StaticData, TIME_PERIOD_TYPES} from '../../../../common';
import {ExportCodeModel} from '../../../../core/models/utils';
import {CommonService} from '../../../../services/common.service';

export class ModbusDropdownData {
  private _range: ExportCodeModel[] = [];
  private _modbusDataTypes: ExportCodeModel[] = [];
  private _writeTypes: ExportCodeModel[] = [];
  private _permissions: string[] = [];
  private _pollingPeriodType = TIME_PERIOD_TYPES;
  private _transportType: string[] = [];

  constructor(
    private attributeService: ModbusAttributeIpService,
    private serialPortService: SerialPortsService,
    private commonService: CommonService,
  ) {
  }

  public setArrays(): void {
    this.attributeService.getRange().subscribe((data) => {
      this._range = data.RANGE_CODES.codes;
    });
    this.attributeService.getDataType().subscribe((data) => {
      this._modbusDataTypes = data.MODBUS_DATA_TYPE_CODES.codes;
    });
    this.attributeService.getWriteType().subscribe((data) => {
      this._writeTypes = data.WRITE_TYPE_CODES.codes;
    });


    this.attributeService.gettransportType().subscribe((data) => {
      this._transportType = data;
    });

    this.commonService.getPermission().subscribe((data) => {
      this._permissions = data;
    });
  }


  get transportType(): string[] {
    return this._transportType;
  }

  get range(): ExportCodeModel[] {
    return this._range;
  }

  get modbusDataTypes(): ExportCodeModel[] {
    return this._modbusDataTypes;
  }

  get writeTypes(): ExportCodeModel[] {
    return this._writeTypes;
  }


  get pollingPeriodType(): StaticData[] {
    return this._pollingPeriodType;
  }

  get permissions(): string[] {
    return this._permissions;
  }
}
