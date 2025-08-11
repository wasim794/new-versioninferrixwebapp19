import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {AlertService, Alert, WeeklySchedule, DailySchedule} from '../../alert';
import {UsersService} from '../../users/service';
import {User} from '../../users/model';
import $ from 'jquery';
import {EmailAddressEntryModel} from '../../core/models/alertList';
import {AlertListEntryModel} from '../model/alertListEntryModel';
import {UserEmailAddressEntryModel} from '../../core/models/alertList';
import {PhoneNumberEntryModel} from '../../core/models/alertList';
import {MatTable} from '@angular/material/table';
import {UnsubscribeOnDestroyAdapter} from '../../common';
import {DictionaryService} from "../../core/services/dictionary.service";
import {Alarm_level, RECIPIENT_TYPES} from "../../common";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers: [CommonService, AlertService, UsersService, DictionaryService],
  selector: 'app-alert-edit',
  templateUrl: './alert-edit.component.html',
  styleUrls: []
})
export class AlertEditComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter<any>();
  weeklySchedule = new WeeklySchedule();
  dailySchedule = new DailySchedule();
  phoneNumber?: string;
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated successfully';
  permissions?: string;
  alertTypes = Alarm_level;
  isEdit?: boolean;
  public alertError: any;
  alertListSelection: any;
  userSelection?: string;
  readPermissions?: any[];
  editPermissions?: any[];
  alertListColumns: string[] = ['AlertType', 'Delete'];
  @ViewChild(MatTable) table!: MatTable<any>;
  result:any = [];
  count = 0;
  finalValue = [];
  Value = [];
  periodArray: any = [];
  i = 0;
  j = 1;
  public RecipientListEntryTypes = RECIPIENT_TYPES;
  public alertDetail: any = new Alert();
  public selectedAlertType: any;
  public emailAddress?: string;
  public alertList?: Alert[];
  public recipients = [];
  public emailAddressEntryModel: any = new EmailAddressEntryModel();
  public alertListEntryModel: any = new AlertListEntryModel();
  public userEntryModel: any = new UserEmailAddressEntryModel();
  public phoneEntryModel: any = new PhoneNumberEntryModel();
  public userList?: User[];
  public selectedInactive = [];
  public periods = [];
  public weekTimeData: any = [];
  public isUpdateSuccessful?: boolean;
  public allChanges: any = [];
  public index = 0;
  public alertListData: any;
  public messageError?: boolean;
  saveMessage = "Save Successfully";
  updateMessage = "Update Successfully";
  UIDICTIONARY : any;
  public alertDetailCon?: boolean;

  constructor(private commonService: CommonService, public dictionaryService: DictionaryService, private _commonService: CommonService, private alertService: AlertService, private usersService: UsersService) {
    super();
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('recipients').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.subs.add(this.commonService.getPermission().subscribe(data => {
        this.permissions = data;
      }, err => console.log(err))
    );
  }

  getAlertDetailByXid(alertXid:any, alert: any) {
    // ($('#timeSchedule') as any).jqs('reset');
    const el = document.getElementById('timeSchedule');
if (el) {
  el.innerHTML = '';
}
    this.allChanges = [];
    this.index = 0;
    this.alertList = alert;
    this.subs.add(this.alertService.getAlertDetailByXid(alertXid).subscribe(data => {
      this.alertDetail = data;
      this.readPermissions = this.alertDetail.readPermissions.split(',');
      this.editPermissions = this.alertDetail.editPermissions.split(',');

    }, err => console.log(err)));
    this.isEdit = true;
    this.alertDetailCon = true;

  }

  RecipientListEntryType(event: any) {
    this.selectedAlertType = event.value;
    if (this.selectedAlertType === 'USER_EMAIL_ADDRESS' || this.selectedAlertType === 'USER_PHONE_NUMBER') {
      this.subs.add(this.usersService.allUsersList().subscribe(data => {
        this.userList = data;
      }));
    }
  }

  addAddress() {
    switch (this.selectedAlertType) {
      case 'ALERT_LIST':
        this.alertListEntryModel.recipientType = this.selectedAlertType;
        this.alertDetail.recipients.push(this.alertListEntryModel);
        break;
      case 'EMAIL_ADDRESS':
        this.emailAddressEntryModel.address = this.emailAddress;
        this.emailAddressEntryModel.recipientType = this.selectedAlertType;
        this.alertDetail.recipients.push(this.emailAddressEntryModel);
        break;
      case 'USER_EMAIL_ADDRESS':
        this.userEntryModel.username = this.userSelection;
        this.userEntryModel.recipientType = this.selectedAlertType;
        this.alertDetail.recipients.push(this.userEntryModel);
        break;
      case 'USER_PHONE_NUMBER':
        this.userEntryModel.username = this.userSelection;
        this.userEntryModel.recipientType = this.selectedAlertType;
        this.alertDetail.recipients.push(this.userEntryModel);
        break;
      case 'PHONE_NUMBER':
        this.phoneEntryModel.number = this.phoneNumber;
        this.phoneEntryModel.recipientType = this.selectedAlertType;
        this.alertDetail.recipients.push(this.phoneEntryModel);
        break;
    }
  }

  saveAlert() {
    this.setAlertProperties();
    this.subs.add(this.alertService.saveAlert(this.alertDetail).subscribe(data => {
        this.alertListData = data;
        this.alertService.setAfterAlertSave(this.alertListData);
        this.isEdit = true;
        this.getAlertDetailByXid(this.alertListData.xid, this.alertList);
      this.commonService.notification(this.saveMessage);
      this.closeSidebar.emit(data);
      }, error => {
        this.alertError = error.result.message;
      this.timeOutFunction();
      })
    );
  }

  updateAlert() {
    this.setAlertProperties();
    this.subs.add(this.alertService.updateAlert(this.alertDetail).subscribe(data => {
        this.isUpdateSuccessful = true;
        this.alertListData = data;
        this.alertService.setAfterAlertUpdate(this.alertListData);
      this.timeOutFunction();
      this.commonService.notification(this.updateMessage);
      this.closeSidebar.emit(data);
      }, error => {
        this.alertError = error.result.message;
      this.timeOutFunction();
      })
    );
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  setAlertProperties() {
    this.addSelected();
    if (this.readPermissions) {
      this.alertDetail.readPermissions = this.readPermissions.toString();
    }
    if (this.editPermissions) {
      this.alertDetail.editPermissions = this.editPermissions.toString();
    }
    const changesArray: any = [];
    this.weekTimeData.forEach((weekTime: any) => {
      this.dailySchedule = weekTime;
      const changes = {'changes': this.dailySchedule};
      changesArray.push(changes);
    });
    const dailySchedule = {'dailySchedules': changesArray};
    this.weeklySchedule = dailySchedule;
    this.alertDetail.inactiveSchedule = this.weeklySchedule;
  }

  resetAlertForm() {
    this.isEdit = false;
    (<any>$('#timeSchedule')).jqs('reset');
    this.alertDetail = new Alert();
  }

  /**
   * remove key and value properties using index of table
   * @param index
   */
  removeAddress(index: any) {
    this.alertDetail.recipients.splice(index, 1);
    this.table.renderRows();
  }

  addSelected() {
    this.selectedInactive = [];
    this.periods = [];
    this.weekTimeData = [];
    let timePeriod :any = [];
    if(!this.selectedInactive){
    this.selectedInactive = JSON.parse((<any>$('#timeSchedule')).jqs('export'));
    }else{
      this.selectedInactive = JSON.parse((<any>$('#timeSchedule')).jqs('export'));
    }
    this.selectedInactive.forEach((inActive: any) => {
      inActive.periods.forEach((prop: any) => {
        timePeriod.push(prop.start);
        timePeriod.push(prop.end);
      });
      this.weekTimeData.push(timePeriod);
      timePeriod = [];
    });
  }

  changeAlertList(data: any) {
    this.alertListEntryModel.xid = data.xid;
    this.alertListEntryModel.name = data.name;
  }

  tabClick(tab: any) {
    if (tab === 2) {
      if (!this.isEdit) {
        // (<any>$('#timeSchedule')).jqs({
        //   periodOptions: false,
        // });
      } else {
        this.alertDetail.inactiveSchedule.dailySchedules.forEach((prop: any) => {
          this.allChanges.push(prop.changes);
        });
        this.allChanges.forEach((change: any) => {
          this.finalValue = [];
          if (change.toString().length != 0) {
            const splitValue = change.toString().split(',');
            this.i = 0;
            this.j = 1;
            for (let i = 0; i < splitValue.length; i = i + 2) {
              var count = 0;
              const period = {
                'start': splitValue[this.i],
                'end': splitValue[this.j],
              };
              this.i = this.i + 2;
              this.j = this.j + 2;
              this.periodArray.push(period);
              count = count + 1;
            }
          } else {
          }
          const data = {
            day: this.index,
            periods: this.periodArray
          };
          this.periodArray = [];
          this.result.push(data);
          this.index = this.index + 1;
        });
        (<any>$('#timeSchedule')).jqs({
          mode: 'edit',
          data: this.result
        });
      }
    }
  }
}
