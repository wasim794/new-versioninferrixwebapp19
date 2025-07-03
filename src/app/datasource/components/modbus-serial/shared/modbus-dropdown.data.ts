import {ModbusAttributeService} from '../../modbus-serial';
import {SerialPortsService} from '../../../../core/services';
import {BAUD_RATES, NumericStaticData, StaticData, TIME_PERIOD_TYPES} from '../../../../common';
import {ExportCodeModel} from '../../../../core/models/utils';
import {CommonService} from '../../../../services/common.service';
export class ModbusDropdownData {
  private _dataBits: string[] = [];
  private _stopBits: string[] = [];
  private _parity: string[] = [];
  private _encoding: string[] = [];
  private _serialPorts: string[] = [];
  private _flowControls: string[] = [];
  private _range: ExportCodeModel[] = [];
  private _modbusDataTypes: ExportCodeModel[] = [];
  private _writeTypes: ExportCodeModel[] = [];
  private _permissions: string[] = [];

  private _baudRate = BAUD_RATES;
  private _pollingPeriodType = TIME_PERIOD_TYPES;

  constructor(
    private attributeService: ModbusAttributeService,
    private serialPortService: SerialPortsService,
    private commonService: CommonService,
  ) {
  }

  public setArrays(): void {
    this.attributeService.getFlowControls().subscribe((data) => {
      this._flowControls = data;
    });
    this.attributeService.getRange().subscribe((data) => {
      this._range = data.RANGE_CODES.codes;
    });
    this.attributeService.getDataType().subscribe((data) => {
      this._modbusDataTypes = data.MODBUS_DATA_TYPE_CODES.codes;
    });
    this.attributeService.getWriteType().subscribe((data) => {
      this._writeTypes = data.WRITE_TYPE_CODES.codes;
    });
    this.attributeService.getDataBit().subscribe((data) => {
      this._dataBits = data;
    });
    this.attributeService.getStopBit().subscribe((data) => {
      this._stopBits = data;
    });
    this.attributeService.getParity().subscribe((data) => {
      this._parity = data;
    });
    this.attributeService.getEncoding().subscribe((data) => {
      this._encoding = data;
    });
    this.serialPortService.getSerialPorts().subscribe((data) => {
      this._serialPorts = data;
    });
    this.commonService.getPermission().subscribe((data) => {
        this._permissions = data;
    });
  }

  get dataBits(): string[] {
    return this._dataBits;
  }

  get stopBits(): string[] {
    return this._stopBits;
  }

  get parity(): string[] {
    return this._parity;
  }

  get encoding(): string[] {
    return this._encoding;
  }

  get serialPorts(): string[] {
    return this._serialPorts;
  }

  get flowControls(): string[] {
    return this._flowControls;
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

  get baudRate(): NumericStaticData[] {
    return this._baudRate;
  }

  get pollingPeriodType(): StaticData[] {
    return this._pollingPeriodType;
  }

  get permissions(): string[] {
    return this._permissions;
  }
}
