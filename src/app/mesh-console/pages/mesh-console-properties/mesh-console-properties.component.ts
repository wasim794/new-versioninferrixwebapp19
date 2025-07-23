import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {MeshSettingModel} from '../../shared/models';
import {
  SystemSettingService,
  SerialPortsService
} from '../../../core/services';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-mesh-console-properties',
  templateUrl: './mesh-console-properties.component.html',
  styleUrls: []
})
export class MeshConsolePropertiesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @Input() meshSettings = {} as MeshSettingModel;
  saveSuccessMsg = 'Saved successfully';
  serialPorts: string[];
  emailError = [];
  private errorMsg: any;
  private durationInSeconds = 5;
  error: any[];
  @Output() meshConsolesidebar = new EventEmitter<any>();
  public messageError: boolean;
  UIDICTIONARY : any;

  constructor(
    private systemSettingService: SystemSettingService,
    public snackBar: MatSnackBar,
    public dictionaryService: DictionaryService,
    private serialPortService: SerialPortsService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getPorts();
    this.getMeshConsoleSettings();

  }

  // fetch the available ports
  getPorts() {
    this.subs.add(this.serialPortService.getSerialPorts().subscribe(data => {
      this.serialPorts = data;
    }, err => this.errorMsg = err));
  }

  getMeshConsoleSettings() {
    this.subs.add(this.systemSettingService.getSystemSettings().subscribe(data => {
      this.meshSettings.meshCommPortId = data.meshCommPortId;
      this.meshSettings.meshConsoleName = data.meshConsoleName;
      this.meshSettings.meshEnableDiagnostics = data.meshEnableDiagnostics;
      this.meshSettings.meshEnableAssetTracking = data.meshEnableAssetTracking;
    }));
  }

  meshConsoleConfiguration() {
    this.subs.add(this.systemSettingService.saveSystemSettings(this.meshSettings).subscribe(data => {
      this.snackBar.open(this.saveSuccessMsg, 'Dismiss', {
        duration: this.durationInSeconds * 1000,
      });
      this.meshConsolesidebar.emit(data);
    }, error => {
      this.error = error.result.message;
      this.timeOutFunction();
    }));
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

}
