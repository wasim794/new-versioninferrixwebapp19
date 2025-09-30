import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BacnetLocalDeviceModel, BacnetForeignDeviceModel } from '../../../bacnet';
import { BacnetService } from '../../../bacnet/shared/service/bacnet.service';
import { CommonService } from '../../../services/common.service';
import { UnsubscribeOnDestroyAdapter } from '../../../common';
import { SerialPortsService, ServerService } from '../../../core/services';
import { NetworkInterfaceModel } from '../../../core/models/server';
import { BAUD_RATES } from '../../../common';
import { DictionaryService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { ReactiveFormsModule } from '@angular/forms';

// Interface for compatibility with PublisherEditComponent
interface DynamicPublisherComponent {
  responsePublisherSave: EventEmitter<any>;
  responsePublisherUpdate: EventEmitter<any>;
  getPubBacnet?(xid: string): void;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, ReactiveFormsModule],
  providers: [BacnetService, CommonService, SerialPortsService, ServerService, DictionaryService],
  selector: 'app-local-device',
  templateUrl: './bacnet-local-device.component.html',
  styleUrls: [],
})
export class BacnetLocalDeviceComponent extends UnsubscribeOnDestroyAdapter implements OnInit, DynamicPublisherComponent {
  bacnetType!: string;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  bacnetError: { message: string; property?: string }[] = [];
  tabIndex = 0;
  serialPorts: string[] = [];
  networkInterfaces: NetworkInterfaceModel[] = [];
  isEdit!: boolean;
  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();
  @Output() closeAllSidebar = new EventEmitter<void>();
  useRealtime = false;
  reuseAddress = false;
  localDeviceModel: any = new BacnetLocalDeviceModel();
  bacnetForeignDevice: BacnetForeignDeviceModel = new BacnetForeignDeviceModel();
  isIpModel = false;
  isMstpModel = false;
  baudRate = BAUD_RATES;
  messageError = false;
  UIDICTIONARY: any;
  localDeviceModelHidesName = false;

  constructor(
    private bacnetService: BacnetService,
    private commonService: CommonService,
    private serialPortService: SerialPortsService,
    private serverService: ServerService,
    public dictionaryService: DictionaryService
  ) {
    super();
  }

  ngOnInit() {
    this.subs.add(
      this.dictionaryService.getUIDictionary('core').subscribe((data) => {
        this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      })
    );

    this.subs.add(
      this.serialPortService.getSerialPorts().subscribe({
        next: (data) => {
          this.serialPorts = data;
        },
        error: (err) => {
          this.bacnetError = [{ message: err.message || 'Failed to load serial ports' }];
        }
      })
    );

    this.subs.add(
      this.serverService.getNetworkInterfaces('includeDefault=' + true).subscribe({
        next: (interfaces) => {
          this.networkInterfaces = interfaces;
        },
        error: (err) => {
          this.bacnetError = [{ message: err.message || 'Failed to load network interfaces' }];
        }
      })
    );
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  newLocalDevice(type: string) {
    this.isEdit = true;
    if (type === 'IP') {
      this.localDeviceModel = this.bacnetService.getDefaultIpDeviceModel();
      this.isIpModel = true;
      this.isMstpModel = false;
    } else {
      this.localDeviceModel = this.bacnetService.getDefaultMstpDeviceModel();
      this.localDeviceModel.type = 'MSTP';
      this.isIpModel = false;
      this.isMstpModel = true;
    }
  }

  saveLocalDevice() {

    if (!this.localDeviceModel.deviceName?.length) {
      this.timeOutFunction();
      this.bacnetError = [{ message: 'Device name is required' }];
      return;
    }
    this.subs.add(
      this.bacnetService.create(this.localDeviceModel).subscribe({
        next: (data) => {
          this.localDeviceModel = data;
          this.commonService.notification(`${this.localDeviceModel.deviceName} ${this.saveSuccessMsg}`);
          this.responsePublisherSave.emit(data); // Emit for PublisherEditComponent
          this.closeAllSidebar.emit(); // Emit void
        },
        error: (error) => {
          this.bacnetError = error.result?.message
            ? Array.isArray(error.result.message)
              ? error.result.message
              : [{ message: error.result.message }]
            : [{ message: 'Failed to save device' }];
          this.timeOutFunction();
        }
      })
    );
  }

  updateLocalDevice() {
    this.subs.add(
      this.bacnetService.update(this.localDeviceModel.id, this.localDeviceModel).subscribe({
        next: (data) => {
          this.localDeviceModel = data;
          this.commonService.notification(`${this.localDeviceModel.deviceName} ${this.updateSuccessMsg}`);
          this.responsePublisherUpdate.emit(data); // Emit for PublisherEditComponent
          this.closeAllSidebar.emit(); // Emit void
        },
        error: (error) => {
          this.bacnetError = error.result?.message
            ? Array.isArray(error.result.message)
              ? error.result.message
              : [{ message: error.result.message }]
            : [{ message: 'Failed to update device' }];
          this.timeOutFunction();
        }
      })
    );
  }

  getPubBacnet(xid: string) {

    this.subs.add(
      this.bacnetService.getById(xid).subscribe({
        next: (data) => {
          this.isEdit = true;
          this.localDeviceModel = data;
          this.isIpModel = this.localDeviceModel.type === 'IP';
          this.isMstpModel = this.localDeviceModel.type === 'MSTP';
          this.localDeviceModelHidesName = true;
        },
        error: (error) => {
          this.bacnetError = [{ message: error.message || 'Failed to load device' }];
          this.timeOutFunction();
        }
      })
    );
  }

  sendForeignDevice() {
    this.subs.add(
      this.bacnetService.sendForeignDeviceRegistration(this.localDeviceModel.id, this.bacnetForeignDevice).subscribe({
        next: () => {
          this.commonService.notification('Sent successfully');
        },
        error: (error) => {
          if (!error.result) {
            this.commonService.notification(error.localizedMessage || 'Failed to send foreign device');
          } else {
            this.bacnetError = error.result.message.map((dataX: any) => ({
              message: `${dataX.message}: ${dataX.property}`,
            }));
          }
        }
      })
    );
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }
}
