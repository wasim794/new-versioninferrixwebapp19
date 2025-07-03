import {PointLocatorModel} from '../../../../core/models/dataPoint';

export class ModbusPointLocatorModel extends PointLocatorModel<ModbusPointLocatorModel> {
  bit: number;
  registerCount: number;
  slaveId: number;
  slaveMonitor: boolean;
  offset: number;
  charset: string;
  writeType: string;
  range: string;
  modbusDataType: string;
  multistateNumeric: number;
  multiplier: number;
  additive: number;
  modelType = 'MODBUS.PL';

  constructor(model?: Partial<ModbusPointLocatorModel>) {
    super(model);
  }
}
