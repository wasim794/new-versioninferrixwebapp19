import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Alert} from '../../../../alert/model/alert';
import {User} from '../../../../users/model';
import {CommonService} from '../../../../services/common.service';
import {UsersService} from '../../../../users/service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {EventHandlerService} from '../../../../core/services';
import {
  AbstractEventHandlerModel,
  SmsEventHandlerModel
} from '../../../../core/models/events/handlers';
import {SMS_RECIPIENT_TYPES, TIME_PERIOD_TYPES} from "../../../../common/static-data/static-data";
import {
  BasicFormComponent,
  EventTypeTreeViewComponent,
  OnAddInit,
  OnEditInit,
  OnEventHandlerSave,
  OnEventHandlerUpdate
} from '../../common';
import {
  PhoneNumberEntryModel,
  RecipientEntryModel,
  UserPhoneNumberEntryModel
} from '../../../../core/models/alertList';
import {MatTable} from "@angular/material/table";
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {TimePeriodModel} from "../../../../core/models/timePeriod";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, EventTypeTreeViewComponent, BasicFormComponent],
  providers:[EventHandlerService, DictionaryService, CommonService, UsersService],
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: []
})
export class SmsComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnAddInit, OnEditInit,
  OnEventHandlerSave, OnEventHandlerUpdate {
  @ViewChild(BasicFormComponent) private basicForm!: BasicFormComponent;
  @ViewChild(EventTypeTreeViewComponent) private eventTypeTree!: EventTypeTreeViewComponent;
  @Output() eventHandlerClose = new EventEmitter<any>();
  isEscalation!: boolean;
  isInactiveNotification!: boolean;
  isOverrideInactiveRecipients!: boolean;
  alertLists!: Alert[];
  userList:any = new User();
  public smsEvent?: any = new SmsEventHandlerModel();
  isSaveSuccessful!: boolean;
  isEdit!: boolean;
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated successfully';
  public phoneNumber!: string;
  public userSelection!: string;
  RecipientListEntryTypes = SMS_RECIPIENT_TYPES;
  timePeriodTypes = TIME_PERIOD_TYPES;
  userListColumns: string[] = ['User/Phone', 'Delete'];
  timePeriods = new TimePeriodModel();
  @ViewChild(MatTable) table!: MatTable<any>;
  public escalationPhoneNumber!: string;
  public escalationUser!: string;
  public inactivePhoneNumber!: string;
  public inactiveUser!: string
  UIDICTIONARY : any;

  activeAlertMap!: Map<String, RecipientEntryModel<any>>;
  escalationAlertMap!: Map<String, RecipientEntryModel<any>>;
  inactiveAlertMap!: Map<String, RecipientEntryModel<any>>;
  activeAlertRecipientType!: String;
  inactiveAlertRecipientType!: String;
  escalationAlertRecipientType!: String;
  isActiveAlertRecipients: boolean = false;
  isInactiveAlertRecipients: boolean = false;
  isEscalationAlertRecipients: boolean = false;

  constructor(private _handlerService: EventHandlerService,
              private commonService: CommonService,
              private usersService: UsersService,
              public dictionaryService: DictionaryService
  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.activeAlertMap = new Map<String, RecipientEntryModel<any>>();
    this.escalationAlertMap = new Map<String, RecipientEntryModel<any>>();
    this.inactiveAlertMap = new Map<String, RecipientEntryModel<any>>();
  }

  getUserList() {
    this.subs.add(this.usersService.allUsersList().subscribe(data => {
      this.userList = data;
    }));
  }

  sendEscalation(Event: any) {
    this.isEscalation = Event.checked;
  }

  sendEscalations(Event: any) {
    this.isEscalation = Event.checked;
  }

  sendInactiveNotification(Event: any) {
    this.isInactiveNotification = Event.checked;
  }

  overrideInactiveRecipients(Event: any) {
    this.isOverrideInactiveRecipients = Event.checked;
  }

  recipientType(event: any, alertType: String) {
    switch (alertType) {
      case 'ACTIVE':
        this.activeAlertRecipientType = event.value;
        break;
      case 'ESCALATION':
        this.escalationAlertRecipientType = event.value;
        break;
      case 'INACTIVE':
        this.inactiveAlertRecipientType = event.value;
        break;
    }

    if (event.value === 'USER_PHONE_NUMBER') {
      this.getUserList();
    }
  }

  addPhoneNumberToMap(selectedRecipientType: String, type: String): void {
    switch (selectedRecipientType) {
      case 'PHONE_NUMBER':
        const phoneNumberModel = new PhoneNumberEntryModel();
        if (type === 'ACTIVE') {
          phoneNumberModel.number = this.phoneNumber;
          this.activeAlertMap.set(phoneNumberModel.number, phoneNumberModel);
        } else if (type === 'ESCALATION') {
          phoneNumberModel.number = this.escalationPhoneNumber;
          this.escalationAlertMap.set(phoneNumberModel.number, phoneNumberModel);
        } else if (type === 'INACTIVE') {
          phoneNumberModel.number = this.inactivePhoneNumber
          this.inactiveAlertMap.set(phoneNumberModel.number, phoneNumberModel);
        }
        break;
      case 'USER_PHONE_NUMBER':
        const userNumberModel = new UserPhoneNumberEntryModel();
        if (type === 'ACTIVE') {
          userNumberModel.username = this.userSelection;
          this.activeAlertMap.set(userNumberModel.username, userNumberModel);
        } else if (type === 'ESCALATION') {
          userNumberModel.username = this.escalationUser;
          this.escalationAlertMap.set(userNumberModel.username, userNumberModel);
        } else if (type === 'INACTIVE') {
          userNumberModel.username = this.inactiveUser;
          this.inactiveAlertMap.set(userNumberModel.username, userNumberModel);
        }
        break;
    }
    this.regenerateTable(type);
  }

  removePhoneFromMap(number: String, type: String) {
    switch (type) {
      case 'ACTIVE':
        this.activeAlertMap.delete(number);
        break;
      case 'ESCALATION':
        this.escalationAlertMap.delete(number);
        break;
      case 'INACTIVE':
        this.inactiveAlertMap.delete(number);
        break;
    }
    this.regenerateTable(type);
  }

  private regenerateTable(type: String) {
    if (type === 'ACTIVE') {
      this.isActiveAlertRecipients = !!this.activeAlertMap;
      this.smsEvent.activeRecipients = Array.from(this.activeAlertMap.values());
    } else if (type === 'ESCALATION') {
      this.isEscalationAlertRecipients = !!this.escalationAlertMap;
      this.smsEvent.escalationRecipients = Array.from(this.escalationAlertMap.values());
    } else if (type === 'INACTIVE') {
      this.isInactiveAlertRecipients = !!this.inactiveAlertMap;
      this.smsEvent.inactiveRecipients = Array.from(this.inactiveAlertMap.values());
    }
  }

  eventHandlerSave(): void {
    this.eventType();
    this.smsEvent.name = this.basicForm.handlerModel.name;
    this.smsEvent.subject = "INCLUDE_NAME";
    this.smsEvent.customTemplate = "rty";
    this.smsEvent.activeRecipients = Array.from(this.activeAlertMap.values());
    this.smsEvent.inactiveRecipients = Array.from(this.inactiveAlertMap.values());
    this.smsEvent.escalationRecipients = Array.from(this.escalationAlertMap.values());
    this._handlerService.create(this.smsEvent).subscribe((model) => {
      this.smsEvent = model as SmsEventHandlerModel;
      this.commonService.notification('Event handler ' + this.smsEvent.name + ' ' + this.saveSuccessMsg);
      this.eventHandlerClose.emit(this.smsEvent);
    }, err => {
      this.timeInterval();
    });
  }

  timeInterval() {
    let timerId = setInterval(() =>
      this.isSaveSuccessful = true, 1000);
    setTimeout(() => {
      clearInterval(timerId);
      this.isSaveSuccessful = false;
    }, 5000);
  }

  eventType() {
    this.smsEvent.eventTypes = this.eventTypeTree.dataSource.selectedEventTypes.selected.map((eventType: any) =>
      eventType.toEventTypeMatcherModel());
  }

  eventHandlerUpdate(): void {
    this.eventType();
    this.smsEvent.name = this.basicForm.handlerModel.name;
    this.smsEvent.subject = "INCLUDE_NAME";
    this.smsEvent.customTemplate = "rty";
    this.smsEvent.activeRecipients = Array.from(this.activeAlertMap.values());
    this.smsEvent.inactiveRecipients = Array.from(this.inactiveAlertMap.values());
    this.smsEvent.escalationRecipients = Array.from(this.escalationAlertMap.values());
    this._handlerService.update(this.smsEvent).subscribe((model) => {
      this.smsEvent = model as SmsEventHandlerModel;
      this.commonService.notification('Event handler ' + this.smsEvent.name + ' ' + this.updateSuccessMsg);
      this.eventHandlerClose.emit(this.smsEvent);
    });
  }

  eventHandlerAddInit(type: string): void {
    this.smsEvent = new SmsEventHandlerModel();
    this.isEdit = false;
    this.smsEvent.escalationPeriod = new TimePeriodModel();
  }

  eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): void {
    this.smsEvent = new SmsEventHandlerModel(handler);
    this.isEdit = true;
    this.isEscalation = this.smsEvent.sendEscalation;
    this.isInactiveNotification = this.smsEvent.sendInactive;
    this.isOverrideInactiveRecipients = this.smsEvent.inactiveOverride;
    this.populateRecipientsTable();
  }

  populateRecipientsTable() {
    if (this.smsEvent.activeRecipients) {
      this.isActiveAlertRecipients = true;
      this.smsEvent.activeRecipients.forEach((recipient: any) => {
        this.activeAlertRecipientType=recipient.recipientType;
        this.inactiveAlertRecipientType = recipient.recipientType;
        this.populateAppropriateMap(recipient.recipientType, recipient, 'ACTIVE');
      });
    }

    if (this.smsEvent.inactiveRecipients) {
      this.isInactiveAlertRecipients = true;
      this.smsEvent.inactiveRecipients.forEach((recipient: any) => this.populateAppropriateMap(recipient.recipientType, recipient, 'INACTIVE'));
    }

    if (this.smsEvent.escalationRecipients) {
      this.isEscalationAlertRecipients = true;
      this.smsEvent.escalationRecipients.forEach((recipient: any) => this.populateAppropriateMap(recipient.recipientType, recipient, 'ESCALATION'));
    }
  }

  private populateAppropriateMap(type: String, recipient: RecipientEntryModel<any>, mapType: String) {
    switch (type) {
      case 'USER_PHONE_NUMBER':
        let userPhoneNumber = new UserPhoneNumberEntryModel(recipient);
        if (mapType === 'ACTIVE') {
          this.activeAlertMap.set(userPhoneNumber.username, userPhoneNumber);
        } else if (mapType === 'ESCALATION') {
          this.escalationAlertMap.set(userPhoneNumber.username, userPhoneNumber);
        } else if (mapType === 'INACTIVE') {
          this.inactiveAlertMap.set(userPhoneNumber.username, userPhoneNumber);
        }
        break;
      case 'PHONE_NUMBER':
        let phoneNumber = new PhoneNumberEntryModel(recipient);
        if (mapType === 'ACTIVE') {
          this.activeAlertMap.set(phoneNumber.number, phoneNumber);
        } else if (mapType === 'ESCALATION') {
          this.escalationAlertMap.set(phoneNumber.number, phoneNumber);
        } else if (mapType === 'INACTIVE') {
          this.inactiveAlertMap.set(phoneNumber.number, phoneNumber);
        }
        break;
    }
  }
}
