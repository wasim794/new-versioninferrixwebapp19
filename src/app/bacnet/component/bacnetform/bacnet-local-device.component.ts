import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BacnetLocalDeviceModel, BacnetService, BacnetForeignDeviceModel} from '../../../bacnet';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {ServerService} from '../../../core/services';
import {NetworkInterfaceModel} from '../../../core/models/server';
import {BAUD_RATES} from '../../../common';
import {DictionaryService} from "../../../core/services";

@Component({
  selector: 'app-local-device',
  templateUrl: './bacnet-local-device.component.html',
  styleUrls: []
})
export class BacnetLocalDeviceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  bacnetType!: string;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  bacnetError: any = [];
  tabIndex = 0;
  public serialPorts!: string[];
  public networkInterfaces!: NetworkInterfaceModel[];
  public isEdit!: boolean;
  @Output() sendBacnetSave = new EventEmitter<any>();
  @Output() closeAllSidebar = new EventEmitter<any>();
  public useRealtime!: boolean;
  public reuseAddress!: boolean;
  public localDeviceModel:any = BacnetLocalDeviceModel;
  public bacnetForeignDevice: any = new BacnetForeignDeviceModel();
  public isIpModel = false;
  public isMstpModel = false;
  public baudRate = BAUD_RATES;
  public messageError!: boolean;
  UIDICTIONARY : any;
  localDeviceModelHidesName!:boolean;

  constructor(
    private bacnetService: BacnetService,
    private commonService: CommonService,
    private serverService: ServerService,
    public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    // this.subs.add(this.serialPortService.getSerialPorts().subscribe((data: string[]) => {
    //   this.serialPorts = data;
    // }, (err: any) => this.bacnetError = err));

    this.subs.add(this.serverService.getNetworkInterfaces('includeDefault=' + true)
      .subscribe((interfaces) => this.networkInterfaces = interfaces));
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  newLocalDevice(type: string) {
    if (type === 'IP') {
      this.localDeviceModel = this.bacnetService.getDefaultIpDeviceModel();
      this.isIpModel = true;
      this.isMstpModel = false;
    } else {
      this.localDeviceModel = this.bacnetService.getDefaultMstpDeviceModel();
      this.localDeviceModel.type = "MSTP";
      this.isIpModel = false;
      this.isMstpModel = true;
    }
  }


  saveLocalDevice() {
      if(this.localDeviceModel.deviceName.length == 0){
        this.timeOutFunction();
        this.bacnetError = [{"message": "Required value"}]
        return;
      }
        this.bacnetService.create(this.localDeviceModel).subscribe(data => {
          this.localDeviceModel = data;
          this.commonService.notification(this.localDeviceModel.deviceName + ' ' + this.saveSuccessMsg);
          this.closeAllSidebar.emit(this.closeAllSidebar);
        }, error => {
          this.bacnetError = error.result.message;
          this.timeOutFunction();
        });
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  updateLocalDevice() {
    this.bacnetService.update(this.localDeviceModel.id, this.localDeviceModel).subscribe((data) => {
      this.localDeviceModel = data;
      this.commonService.notification(this.localDeviceModel.deviceName + ' ' + this.updateSuccessMsg);
      this.closeAllSidebar.emit(this.closeAllSidebar);
    }, error => {
      this.bacnetError = error.result.message;
      this.timeOutFunction();
    });
  }

  getByID(id: string){
    this.bacnetService.getById(id).subscribe(data=>{
      this.localDeviceModel = data;
      this.isEdit = true;
      this.localDeviceModel.type==='IP'?this.isIpModel=true:this.isMstpModel=true;
      this.localDeviceModelHidesName = true;
    });
  }

  sendForeignDevice(){
    this.bacnetService.sendForeignDeviceRegistration(this.localDeviceModel.id, this.bacnetForeignDevice).subscribe(data=> {
      this.commonService.notification("send successfully");
    } , error => {
       if(!error.result){
         this.commonService.notification(error.localizedMessage);
       }else{
         error.result.message.forEach((dataX: { message: string; property: string; })=>{
           this.commonService.notification(dataX.message+': '+dataX.property);
         })
       }
      });
  }

}
