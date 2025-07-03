import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataSourceBase} from '../common/dataSourceBase';
import {CommonService} from '../../../services/common.service';
import {ModbusDropdownData, ModbusAttributeIpService, ModbusDatasourceIpService, ModbusPointLocatorModel, ModbusIpModel} from '../modbus-ip';
import {DataPointService, SerialPortsService, DictionaryService} from '../../../core/services';
import {DataPointModel} from '../../../core/models/dataPoint';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent } from '../common';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [DataPointService, SerialPortsService, DictionaryService, ModbusAttributeIpService, ModbusDatasourceIpService],
  selector: 'app-modbus-ip',
  templateUrl: './modbus-ip.component.html',
  styleUrls: []
})
export class ModbusIpComponent extends DataSourceBase implements OnInit {
  public override datapointForm:boolean=false;
  public displayForm!: boolean;
  @Output() override addedSavedDatasource = new EventEmitter<any>();
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  public datapointButtonsView: boolean | undefined;
  public override tabIndex = 0;
  declare public currentDatapointIndex: number;
  public saveSuccess   = 'saved successfully';
  public updateSuccess = 'updated successfully';
  public dsId!:any;
  public isEdit!: boolean;
  public dropdownData: ModbusDropdownData;
  public modbusIpModel: any = new ModbusIpModel();
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
  childLoaded: boolean=false;
  public modbusIpError!: any[];
  public valueNumber='Value must be a number';
  public Property='updatePeriods';
  parentValue: any;
  UIDICTIONARY : any;
  datasourceTitleName : any;
  isActivePdSmall!:boolean;

  constructor(
    private datasourceService: ModbusDatasourceIpService,
    private datapointService: DataPointService,
    private commonService: CommonService,
    attributeService: ModbusAttributeIpService,
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

  public override selectTab(index: number): void {
    this.tabIndex = index;
    this.tabIndex===2?this.childLoaded = true : this.childLoaded = false;
  }

  override addNewDatasource(dsType: any) {
    this.modbusIpModel = new ModbusIpModel();
    this.modbusIpModel.timePeriod = new TimePeriodModel();
    this.modbusIpModel.timeout = 500;
    this.modbusIpModel.retries = 2;
    this.modbusIpModel.maxReadBitCount = 2000;
    this.modbusIpModel.maxReadRegisterCount = 125;
    this.modbusIpModel.maxWriteRegisterCount = 120;
    this.modbusIpModel.ioLogFileSizeMBytes = 1.0;
    this.modbusIpModel.maxHistoricalIOLogs = 1;
  }

  override addNewDatapoint(xid: string, index: number) {
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
    this.subs.add(
      this.datasourceService.getByXid(datasource.xid).subscribe(
        (data) => {
          this.modbusIpModel = new ModbusIpModel(data);
          this.parentValue = this.modbusIpModel;
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(',');
        }, error => {
          this.modbusIpError = error.result.message;
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
    if (isNaN(this.modbusIpModel.timePeriod.timePeriod)) {
      const prop = {
        message: this.valueNumber,
        property: this.Property,
      };
       this.modbusIpError.push(prop);
       this.timeOutFunction();
    }
  }

  setData(dataSource: any) {
    this.isEdit = true;
    this.subs.add(
      this.datasourceService.getByXid(dataSource.xid).subscribe(
        (data) => {
          this.modbusIpModel = new ModbusIpModel(data);
          if (data.editPermission) {
            this.editPermission = data.editPermission.split(',');
          }
        }, error => {
          this.modbusIpError = error.result.message;
          this.timeOutFunction();
        }));
  }

  saveDatasource() {
    if (this.editPermission) {
      this.modbusIpModel.editPermission = this.editPermission.toString();
    }
    this.modbusIpModel.timePeriod = this.modbusIpModel.purgePeriod;
    this.subs.add(
      this.datasourceService
        .create(this.modbusIpModel)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.modbusIpModel.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          this.modbusIpError = error.result.message;
          this.timeOutFunction();
        }));
  }

  updateDatasource() {
    this.validateTimePeriod();
    if (this.editPermission) {
      this.modbusIpModel.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.datasourceService.update(this.modbusIpModel).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.modbusIpModel.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.modbusIpError = error.result.message;
          this.timeOutFunction();
        }));
  }


  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
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
          this.modbusIpError = error.result.message;
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
          this.modbusIpError = error.result.message;
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
