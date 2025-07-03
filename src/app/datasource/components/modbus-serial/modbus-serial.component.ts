import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataSourceBase} from '../common/dataSourceBase';
import {CommonService} from '../../../services/common.service';
import {ModbusPointLocatorModel} from '../modbus-ip';
import {ModbusDropdownData, ModbusAttributeService, ModbusDatasourceService, ModbusSerialModel, ScandevicetoolSerialComponent} from '../modbus-serial';
import {DataPointService, SerialPortsService, DictionaryService} from '../../../core/services';
import {DataPointModel} from '../../../core/models/dataPoint';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, ScandevicetoolSerialComponent],
  providers: [ModbusAttributeService, ModbusDatasourceService, CommonService],
  selector: 'app-modbus-serial',
  templateUrl: './modbus-serial.component.html',
  styleUrls: [],
})
export class ModbusSerialComponent extends DataSourceBase implements OnInit {
  public override datapointForm:boolean=false;
  displayForm!: boolean;
  parentValue: any;
  @Output() override addedSavedDatasource = new EventEmitter<any>();
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  datapointButtonsView!: boolean;
  override tabIndex = 0;
  declare currentDatapointIndex: any;
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  dsId!: any;
  isEdit!: boolean;
  public dropdownData: ModbusDropdownData;
  public modbusSerialModel: ModbusSerialModel = new ModbusSerialModel();
  public modbusPointLocatorModel: ModbusPointLocatorModel = new ModbusPointLocatorModel();
  public dataPointModel: DataPointModel = new DataPointModel();
  public editPermission: any = [];
  public setPermission: any = [];
  public readPermission: any = [];
  public isModbusDataType!: boolean;
  public isBit!: boolean;
  public isRegisterCount!: boolean;
  public isCharset!: boolean;
  public isMultiplier!: boolean;
  public isAdditive!: boolean;
  public isWrite!: boolean;
  public messageError!: boolean;
  modbusSerialError!: any[];
  datapointFormName: boolean=false;
  childLoaded: boolean=false;
  UIDICTIONARY : any;
  datasourceTitleName: any;
  isActivePdSmall!:boolean;


  constructor(
    private datasourceService: ModbusDatasourceService,
    private datapointService: DataPointService,
    private commonService: CommonService,
    attributeService: ModbusAttributeService,
    serialPortService: SerialPortsService,
    public dictionaryService: DictionaryService
  ) {
    super();
    this.dropdownData = new ModbusDropdownData(attributeService, serialPortService, commonService);
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
    this.dropdownData.setArrays();
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
    this.tabIndex===2?this.childLoaded = true : this.childLoaded = false;
  }

  override addNewDatasource(dsType: any) {
    this.modbusSerialModel = new ModbusSerialModel();
    this.modbusSerialModel.timePeriod = new TimePeriodModel();
    this.modbusSerialModel.timeout = 500;
    this.modbusSerialModel.retries = 2;
    this.modbusSerialModel.maxReadBitCount = 2000;
    this.modbusSerialModel.maxReadRegisterCount = 125;
    this.modbusSerialModel.maxWriteRegisterCount = 120;
    this.modbusSerialModel.ioLogFileSizeMBytes = 1.0;
    this.modbusSerialModel.maxHistoricalIOLogs = 1;
  }

  override addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPointModel = new DataPointModel();
    this.modbusPointLocatorModel = new ModbusPointLocatorModel();
    this.datapointButtonsView = false;
    this.dataPointModel.dataSourceXid = xid;
    this.modbusPointLocatorModel.modbusDataType = 'BINARY';
    this.modbusPointLocatorModel.offset = 0;
    this.modbusPointLocatorModel.multiplier = 1;
    this.modbusPointLocatorModel.additive = 0;
    this.modbusPointLocatorModel.charset = 'ASCII';
    this.modbusPointLocatorModel.bit = 0;
    this.modbusPointLocatorModel.registerCount = 0;
    this.readPermission = [];
    this.setPermission = [];
    return true;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(
      this.datapointService
      .getByXid(dataPointXid)
      .subscribe((data) => {
        this.displayForm = true;
        this.dataPointModel = new DataPointModel(data);
        this.modbusPointLocatorModel = new ModbusPointLocatorModel(data.pointLocator);
        this.readPermission = data.readPermission.split(',');
        this.setPermission = data.setPermission.split(',');
        this.datapointButtonsView = true;
        this.rangeChange(this.modbusPointLocatorModel.range);
        this.dataTypeChange(this.modbusPointLocatorModel.modbusDataType);
      })
    );
  }

  override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.datapointFormName = true;
    this.modbusSerialModel.timePeriod = new TimePeriodModel();
    this.modbusSerialModel.purgePeriod = this.modbusSerialModel.timePeriod;
    this.subs.add(
      this.datasourceService.getByXid(datasource.xid).subscribe(
        (data) => {
          this.modbusSerialModel = new ModbusSerialModel(data);
          this.parentValue = this.modbusSerialModel;
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(',');
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;
  }


  validateTimePeriod() {
    if (isNaN(this.modbusSerialModel.timePeriod.timePeriod)) {
      const prop = {
        message: 'Value must be a number',
        property: 'updatePeriods',
      };
      this.modbusSerialError.push(prop);
       this.timeOutFunction();
    }
  }

  setData(dataSource: any) {
    this.isEdit = true;
    this.subs.add(
      this.datasourceService.getByXid(dataSource.xid).subscribe(
        (data) => {
          this.modbusSerialModel = new ModbusSerialModel(data);
          if (data.editPermission) {
            this.editPermission = data.editPermission.split(',');
          }
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
  }

  saveDatasource() {
    if (this.editPermission) {
      this.modbusSerialModel.editPermission = this.editPermission.toString();
    }
    this.modbusSerialModel.purgePeriod = this.modbusSerialModel.timePeriod;
    this.subs.add(
      this.datasourceService
      .create(this.modbusSerialModel)
      .subscribe((data) => {
        this.isEdit = true;
        this.commonService.notification(
          'Datasource ' + this.modbusSerialModel.name + ' ' + this.saveSuccess
        );
        this.addedSavedDatasource.emit(data);
      }, error => {
        this.modbusSerialError = error.result.message;
        this.timeOutFunction();
      }));
  }

  updateDatasource() {
    this.validateTimePeriod();
    if (this.editPermission) {
      this.modbusSerialModel.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.datasourceService.update(this.modbusSerialModel).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.modbusSerialModel.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
  }


  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPointModel.readPermission = this.readPermission.toString();
    }

    if (this.setPermission) {
      this.dataPointModel.setPermission = this.setPermission.toString();
    }
  }

  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.modbusPointLocatorModel;
    this.subs.add(
      this.datapointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
          this.datapointTableComponent.dataPoints.filter = '';
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.displayForm = false;
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
  }

  saveDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.modbusPointLocatorModel;
    this.subs.add(
      this.datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

  private commonDisplaySettings() {
    this.isRegisterCount = false;
    this.isCharset = false;
    this.isMultiplier = false;
    this.isAdditive = false;
  }

  private holdingRegisterBinarySettings() {
    this.commonDisplaySettings();
    this.isWrite = true;
    this.isModbusDataType = true;
    this.isBit = true;
  }

  private inputRegisterBinarySettings() {
    this.commonDisplaySettings();
    this.isWrite = false;
    this.isModbusDataType = true;
    this.isBit = true;
    this.modbusPointLocatorModel.writeType = 'NOT_SETTABLE';
  }

  private coilAndStatusSettings() {
    this.commonDisplaySettings();
    this.isWrite = true;
    this.isModbusDataType = false;
    this.isBit = false;
  }

  private inputStatusSettings() {
    this.commonDisplaySettings();
    this.isWrite = false;
    this.isModbusDataType = false;
    this.isBit = false;
    this.modbusPointLocatorModel.writeType = 'NOT_SETTABLE';
  }

  private commonRegisterStringSettings() {
    this.isBit = false;
    this.isRegisterCount = true;
    this.isCharset = true;
    this.isWrite = true;
    this.isMultiplier = false;
    this.isAdditive = false;
  }

  private holdingRegisterStringSettings() {
    this.commonRegisterStringSettings();
    this.isWrite = true;
  }

  private inputRegisterStringSettings() {
    this.commonRegisterStringSettings();
    this.isWrite = false;
    this.modbusPointLocatorModel.writeType = 'NOT_SETTABLE';
  }

  private commonRegisterSettings() {
    this.isBit = false;
    this.isRegisterCount = false;
    this.isCharset = false;
    this.isMultiplier = true;
    this.isAdditive = true;
  }

  private holdingRegisterSettings() {
    this.commonRegisterSettings();
    this.isWrite = true;
  }

  private inputRegisterSettings() {
    this.commonRegisterSettings();
    this.isWrite = false;
    this.modbusPointLocatorModel.writeType = 'NOT_SETTABLE';
  }

  public rangeChange(range: string) {
    if (range === 'HOLDING_REGISTER') {
      this.holdingRegisterBinarySettings();
    } else if (range === 'INPUT_REGISTER') {
      this.inputRegisterBinarySettings();
    } else if (range === 'COIL_STATUS') {
      this.coilAndStatusSettings();
    } else {
      this.inputStatusSettings();
    }
  }

  public dataTypeChange(dataType: string) {
    if (dataType === 'BINARY' && this.modbusPointLocatorModel.range === 'HOLDING_REGISTER') {
      this.holdingRegisterBinarySettings();
    } else if (dataType === 'BINARY' && this.modbusPointLocatorModel.range === 'INPUT_REGISTER') {
      this.inputRegisterBinarySettings();
    } else if (dataType === 'CHAR' || dataType === 'VARCHAR') {
        if (this.modbusPointLocatorModel.range === 'HOLDING_REGISTER') {
          this.holdingRegisterStringSettings();
        } else if (this.modbusPointLocatorModel.range === 'INPUT_REGISTER') {
          this.inputRegisterStringSettings();
        }
    } else {
      if (this.modbusPointLocatorModel.range === 'HOLDING_REGISTER') {
        this.holdingRegisterSettings();
      } else if (this.modbusPointLocatorModel.range === 'INPUT_REGISTER') {
        this.inputRegisterSettings();
      }
    }
  }
}
