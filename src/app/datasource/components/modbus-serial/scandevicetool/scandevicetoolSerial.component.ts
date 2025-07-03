import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {ModbusDropdownData} from "../shared/modbus-dropdown.data";
import {CommonService} from "../../../../services/common.service";
import {SerialPortsService, WebsocketService} from "../../../../core/services";
import {ModbusReadRequestModel, ModbusReadResponseModel} from '../../../../core/models/dataSource';
import {ConfigurationService} from "../../../../services/configuration.service";
import {UnsubscribeOnDestroyAdapter} from "../../../../common";
import {ModbusToolService} from '../../../../core/services';
import {ModbusSerialConfigurationModel, ModbusAttributeService} from '../../modbus-serial';
import {ModbusPointLocatorModel} from '../../modbus-ip';
import {MatTableDataSource} from "@angular/material/table";
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService, ConfigurationService, ModbusToolService],
  selector: 'app-scandevicetoolserial',
  templateUrl: './scandevicetool.component.html'
})
export class ScandevicetoolSerialComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnChanges {
  @Input() valueFromParent: any;
  color:any = 'primary';
  mode:any = 'determinate';
  value:number = 10;
  bufferValue = 75;
  hideClear:boolean=true;
  hideCancel:boolean=true;
  hideProgressBar:boolean=true;
  hideScan!:boolean;
  modbusIpScannerError!:any[];
  messageError!:boolean;
  isMultiplier! : boolean;
  isAdditive! : boolean;
  isModbusDataType! : boolean;
  isBit! : boolean;
  dataSource:any = new MatTableDataSource<ModbusReadResponseModel>();
  websocket_URL = '/temporary-resources?token=';
  websocket: any;
  token: string;
  UIDICTIONARY:any;
  scanTimeOut=1000;
  scanExpiryTime=1000;
  websocketResponse: any;
  displayedColumns: string[] = ['Offset', 'Raw value', 'value', 'Write data'];
  public dropdownData: ModbusDropdownData;
  _modbusReadRequest:any = new ModbusReadRequestModel();
  _modbusSerialConfiguration:any = new ModbusSerialConfigurationModel();
  _modbusPointLocator:any = new ModbusPointLocatorModel();

  constructor(private commonService: CommonService,
              public dictionaryService: DictionaryService,
              attributeService: ModbusAttributeService,
              serialPortService: SerialPortsService, private _configurationService: ConfigurationService,
              private _WebSocketService: WebsocketService, private _modbusToolService: ModbusToolService) {
    super();
   this.token = JSON.parse(localStorage.getItem('access_token')!).token;
    this.dropdownData = new ModbusDropdownData(attributeService, serialPortService, commonService);
  }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    // this.token = JSON.parse(localStorage.getItem('access_token')).token;
    this.dropdownData.setArrays();
    this.progressBarStart();
    this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
    this.websockets();
    this.getDataParentToChild();

  }
  ngOnChanges(): void{
    //
  }
  websockets() {
    const message = {
      'requestType': 'SUBSCRIPTION',
      'anyStatus': true,
      'anyResourceType': false,
      'resourceTypes': ['MODBUS_SCAN']
    };

    this._configurationService.connect(message);
    this._WebSocketService.subscribeWebsocket().subscribe(data => {
      this.websocketResponse = JSON.parse(data);
      this.hideScan = true;
      this.websocketResponse = JSON.parse(data);
      if(this.websocketResponse.payload){
        this.websocketResponse.payload.status==="COMPLETED"
        || this.websocketResponse.payload.status==='TIMED_OUT' || this.websocketResponse.payload.status==='SCHEDULED'?
          this.processBarTrue()
          :
          this.processBarFalse();
      }
    });
  }

  private processBarTrue(){
    this.hideProgressBar=true;
    this.hideCancel = true;
  }
  private processBarFalse(){
    this.hideProgressBar=false;
    this.hideCancel = false;
  }

  private getDataParentToChild(){
    this._modbusSerialConfiguration.ownerName      = this.valueFromParent.name;
    this._modbusSerialConfiguration.commPortId     = this.valueFromParent.commPortId;
    this._modbusSerialConfiguration.baudRate       = this.valueFromParent.baudRate;
    this._modbusSerialConfiguration.flowControlIn  = this.valueFromParent.flowControlIn;
    this._modbusSerialConfiguration.flowControlOut = this.valueFromParent.flowControlOut;
    this._modbusSerialConfiguration.dataBits       = this.valueFromParent.dataBits;
    this._modbusSerialConfiguration.stopBits       = this.valueFromParent.stopBits;
    this._modbusSerialConfiguration.parity         = this.valueFromParent.parity;
    this._modbusSerialConfiguration.encoding       = this.valueFromParent.encoding;
    this._modbusSerialConfiguration.timeout        = this.valueFromParent.timeout;
    this._modbusSerialConfiguration.retries        = this.valueFromParent.retries;

  }

  private progressBarStart(){
    const interval = setInterval(() => {
      this.value++;
      if (this.value >= 100) {
        clearInterval(interval); // Stop the interval when the counter reaches 100
      }
    }, 1000); // Increment every second
  }

  startScan(){
  this.hideCancel = false;
  this.hideProgressBar = false;
  this.value = 10;
  this.runScanStart(this._modbusSerialConfiguration);
  }

  private runScanStart(modbusValue: any){
    // return;
 this.add(this._modbusToolService.scan(modbusValue, this.scanExpiryTime, this.scanTimeOut).subscribe(data=>{
 }))
  }

  clearInput(){
    this.hideClear = true;
    this.hideProgressBar = true;
    this.add(this._modbusToolService.removeScan(this.websocketResponse.payload.id).subscribe(data=>{
    }));
  }
  cancelInput(){
    this.hideCancel = true;
    this.hideClear = false;
    this.hideProgressBar = true;
    this.add(this._modbusToolService.cancelScan(this.websocketResponse.payload.id).subscribe(data=>{
    }));
  }

  public rangeChange(range: string) {
    range==='COIL_STATUS' || range === "INPUT_STATUS"?
      this.isModbusDataType = false:this.isModbusDataType = true;
  }


  public dataTypeChange(dataType: string) {
   dataType==="BINARY"?
     this.commonDataTypesOne():this.commonDataTypesTwo()
  }

  private commonDataTypesOne(){
    this.isBit = true;
    this.isMultiplier = false;
    this.isAdditive = false;
  }
  private commonDataTypesTwo(){
    this.isBit = false;
    this.isMultiplier = true;
    this.isAdditive = true;
  }
  readData(){
    delete this._modbusPointLocator.modelType;
    this._modbusReadRequest.configuration = this._modbusSerialConfiguration;
    this.add(this._modbusToolService.readModbusSerialData(this._modbusReadRequest).subscribe(data=>{
      const entriesArray = Object.entries(data);
      this.dataSource = entriesArray;
    },(err)=>{
      this.timeOutFunction();
        this.modbusIpScannerError = err.result.message
      }));
  }

  private timeOutFunction(){
    this.messageError = true;
    setTimeout(()=>{
      this.messageError = false;
    }, 3000);
  }

  generateArrayWithCount(count: number): any[] {
    const newArray = [];
    for (let i = 0; i < count; i++) {
      newArray.push(this._modbusReadRequest.length);
    }
    return newArray;
  }

  updateRange(){

  }

}
