import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {HelpModalComponent} from '../../../help/help-modal/help-modal.component';
import {commonHelp} from '../../../help/commonHelp';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {SystemSettingService} from '../../../core/services';
import {persistentQueueModel, ThreadConfigurationModel} from '../../shared';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[ CommonModule, MatModuleModule, HelpModalComponent],
  providers:[ DictionaryService, SystemSettingService, CommonService] ,
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: []
})
export class SystemInformationComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  name!: string;
  @Input() threadConfigurationModel = {} as ThreadConfigurationModel;
  @Output() systemsettingsidebar = new EventEmitter<any>();
  systemInfoError: any = [];
  info = new commonHelp();
  persistentQueue= new persistentQueueModel();
  private systemInformationMessage = 'Saved successfully';
  public messageError!: boolean;
  msg="Successfully";
  UIDICTIONARY : any;

  constructor(
    private systemSettingService: SystemSettingService,
    private dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private _commonService: CommonService) {
    super();
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('systemSettings').subscribe(data=>{
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getThreadConfigurationDetails();
    this.systemSettingDetailByKEY();
  }

  getThreadConfigurationDetails() {
    this.subs.add(this.systemSettingService.getSystemSettings().subscribe(data => {
      this.threadConfigurationModel.highPriorityThreadCorePoolSize = data.highPriorityThreadCorePoolSize;
      this.threadConfigurationModel.highPriorityThreadMaximumPoolSize = data.highPriorityThreadMaximumPoolSize;
      this.threadConfigurationModel.mediumPriorityThreadCorePoolSize = data.mediumPriorityThreadCorePoolSize;
      this.threadConfigurationModel.mediumPriorityThreadMaximumPoolSize = data.mediumPriorityThreadMaximumPoolSize;
      this.threadConfigurationModel.lowPriorityThreadCorePoolSize = data.lowPriorityThreadCorePoolSize;
      this.threadConfigurationModel.lowPriorityThreadMaximumPoolSize = data.highPriorityThreadMaximumPoolSize;
    }));
  }

  loadSystemInfoHelpModel() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'HelpSystemthreadConfiguration', content: this.info.HtmlSystemThreadConfiguration},
      disableClose: true
    });
  }

  saveThreadConfiguration() {
    this.updateSystemSettingInBulk(this.threadConfigurationModel);
    this._commonService.notification('system ' + this.systemInformationMessage);
    this.systemsettingsidebar.emit();
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  private updateSystemSettingInBulk(object: Object) {
    this.subs.add(this.systemSettingService.saveSystemSettings(object).subscribe(data => {
      this.timeOutFunction();
      }, error => {
        this.systemInfoError = error.result.message;
      this.timeOutFunction();
      })
    );
  }

  enableDisable(checked: any){
    this.persistentQueue.persistentQueuePublisher = checked;
  }

  pushPersistantConfiguration(){
  this.add(this.systemSettingService.saveSystemSettings(this.persistentQueue).subscribe(data=>{
      data.persistentQueuePublisher==true?this._commonService.notification(this.msg +' '+ 'Enabled')
        :this._commonService.notification(this.msg +' '+ 'Disabled');
  }));
  }

  private systemSettingDetailByKEY() {
    this.persistentQueue.persistentQueuePublisher = 'persistentQueuePublisher';
    this.subs.add(this.systemSettingService.getSystemSettingsByKey(this.persistentQueue.persistentQueuePublisher).subscribe(data => {
      data=='N'?this.persistentQueue.persistentQueuePublisher=false:this.persistentQueue.persistentQueuePublisher=true;
    }, err => console.log(err)));
  }

}
