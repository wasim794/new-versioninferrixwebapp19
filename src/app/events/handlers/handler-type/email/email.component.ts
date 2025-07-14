import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Alert} from '../../../../alert/model/alert';
import {User} from '../../../../users/model';
import {CommonService} from 'src/app/services/common.service';
import {UsersService} from '../../../../users/service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DataPointService, EventHandlerService} from '../../../../core/services';
import {TimePeriodModel} from '../../../../core/models/timePeriod';
import {
  AbstractEventHandlerModel,
  EmailEventHandlerModel
} from '../../../../core/models/events/handlers';
import {UserEmailAddressEntryModel} from '../../../../core/models/alertList';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {TIME_PERIOD_TYPES, EMAIL_RECIPIENT_TYPES, SMS_RECIPIENT_TYPES_EMAIL} from "../../../../common/static-data/static-data";

import {
  BasicFormComponent,
  EventTypeTreeViewComponent,
  OnAddInit,
  OnEditInit,
  OnEventHandlerSave,
  OnEventHandlerUpdate
} from '../../common';
import {EmailAddressEntryModel} from '../../../../core/models/alertList';
import {MatTable} from "@angular/material/table";


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: []
})
export class EmailComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnAddInit, OnEditInit,
  OnEventHandlerSave, OnEventHandlerUpdate {
  @ViewChild(BasicFormComponent) private basicForm: BasicFormComponent;
  @ViewChild(EventTypeTreeViewComponent) private eventTypeTree: EventTypeTreeViewComponent;
  @Output() eventHandlerClose = new EventEmitter<any>();
  public emailEventModel:any = new EmailEventHandlerModel();
  isEscalation: boolean;
  userSelection:any;
  isInactiveNotification: boolean;
  isOverrideInactiveRecipients: boolean;
  alertLists: Alert[];
  userList: User[];
  userListTwo: User[];
  isSaveSuccessful: boolean;
  isUpdateSuccessful: boolean;
  isEdit: boolean;
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated successfully';
  public userEntryModel:any = new UserEmailAddressEntryModel();
  public emailAddressEntryModel:any = new EmailAddressEntryModel();
  public selectedAlertType: any;
  public isEscalationSelectedType:any;
  public selectedType: any;
  public emailArrayData=<any>[];
  public emailArrayDataTwo=<any>[];
  public emailAddress: string;
  public emailAddressIsESC: string;
  public IsEscUserSelection: any;
  RecipientListEntryTypes = EMAIL_RECIPIENT_TYPES;
  RecipientListEntryTypesPhone = SMS_RECIPIENT_TYPES_EMAIL;
  timePeriodTypes=TIME_PERIOD_TYPES;
  userListColumns: string[] = ['UserType', 'Delete'];
  timePeriods = new TimePeriodModel();
  @ViewChild(MatTable) table: MatTable<any>;
  UIDICTIONARY : any;

  constructor(private _handlerService: EventHandlerService,
              private _dataPointService: DataPointService,
              private commonService: CommonService ,
               public dictionaryService: DictionaryService,
              public usersService: UsersService) {
    super();
  }

  ngOnInit():void {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
  }

  //active start here
  RecipientListEntryType(event: any , value) {
    this.selectedAlertType = event.value;
    if (this.selectedAlertType === 'USER_EMAIL_ADDRESS') {
      this.getUserOnly();
    }
  }

  addAddress() {
    this.IsActiveBy();
  }

  IsActiveBy(){
    switch (this.selectedAlertType) {
      case 'EMAIL_ADDRESS':
        this.emailAddressEntryModel.address = this.emailAddress;
        this.emailAddressEntryModel.recipientType = this.selectedAlertType;
        this.emailArrayData.push(this.emailAddressEntryModel);
        this.emailEventModel.activeRecipients= this.emailArrayData;
        break;
      case 'USER_EMAIL_ADDRESS':
        this.userEntryModel.username = this.userSelection;
        this.userEntryModel.recipientType = this.selectedAlertType;
        this.emailArrayData.push(this.userEntryModel);
        this.emailEventModel.activeRecipients= this.emailArrayData;
        break;
    }
  }
  removeAddress(index) {
    this.emailEventModel.activeRecipients.splice(index, 1);
    this.table.renderRows();
  }

  //End here
getUserOnly(){
  this.subs.add(this.usersService.allUsersList().subscribe(data => {
    this.userListTwo = data['items'];
  }));
}

  //Escalation Start Here
  RecipientListEntryTypeTwo(event: any, value){
    this.isEscalationSelectedType = event.value;
    if (this.isEscalationSelectedType === 'USER_EMAIL_ADDRESS') {
     this.getUserOnly();
    }
  }

  esIsActiveBy(){

    switch (this.isEscalationSelectedType) {
      case 'EMAIL_ADDRESS':
        this.emailAddressEntryModel.address = this.emailAddressIsESC;
        this.emailAddressEntryModel.escalationRecipients = this.isEscalationSelectedType;
        this.emailArrayDataTwo.push(this.emailAddressEntryModel);
        this.emailEventModel.escalationRecipients = this.emailArrayDataTwo;
        break;
        case 'USER_EMAIL_ADDRESS':
        this.userEntryModel.username = this.IsEscUserSelection;
        this.userEntryModel.escalationRecipients = this.isEscalationSelectedType;
        this.emailArrayDataTwo.push(this.userEntryModel);
        this.emailEventModel.escalationRecipients= this.emailArrayDataTwo;
        break;
    }
  }
  addAddressTwo() {
    this.esIsActiveBy();
  }
  //End here

  sendEscalations(Event) {
    this.isEscalation = Event.checked;

  }
  sendInactiveNotification(Event) {
    this.isInactiveNotification = Event.checked;
  }
  overrideInactiverecipients(Event) {
    this.isOverrideInactiveRecipients = Event.checked;
  }

  removeAddressTwo(index){
    this.emailEventModel.escalationRecipients.splice(index, 1);
    this.table.renderRows();
  }

  eventHandlerSave(): void {
    this.eventType();
    this.emailEventModel.name = this.basicForm.handlerModel.name;
    this.emailEventModel.subject="INCLUDE_NAME";
    this.emailEventModel.customTemplate="";
    this._handlerService.create(this.emailEventModel).subscribe((model) => {
      this.emailEventModel = model as EmailEventHandlerModel;
      this.commonService.notification('event Handler ' + this.emailEventModel.name + ' ' + this.saveSuccessMsg);
      this.eventHandlerClose.emit(this.emailEventModel);
    }, error => {
      this.timeInterval();
    });
  }

  eventType(){
    this.emailEventModel.eventTypes = this.eventTypeTree.dataSource.selectedEventTypes.selected.map((eventType) =>
        eventType.toEventTypeMatcherModel());
  }

  eventHandlerUpdate(): void {
    this.eventType();
    this.emailEventModel.name = this.basicForm.handlerModel.name;
    this.emailEventModel.subject="INCLUDE_NAME";
    this.emailEventModel.customTemplate="";
    this._handlerService.update(this.emailEventModel).subscribe((model) => {
      this.emailEventModel = model as EmailEventHandlerModel;
      this.commonService.notification('event Handler ' + this.emailEventModel.name + ' ' + this.updateSuccessMsg);
      this.eventHandlerClose.emit(this.emailEventModel);
    }, error => {
      this.timeInterval();
    });
  }


  eventHandlerAddInit(type: string): void {
    this.emailEventModel = new EmailEventHandlerModel();
    this.isEdit = false;
    this.emailEventModel.escalationPeriod = new TimePeriodModel();
  }

  eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): void {
    const tempModel = new EmailEventHandlerModel(handler);
     this.isEdit = true;
    this.emailEventModel = tempModel;
    this.getRecipientValue();
    this.getEcsRecipientValue();
    this.isEscalation = this.emailEventModel.sendEscalation;
  }

  getRecipientValue(){
    this.RecipientListEntryType(this.emailEventModel.activeRecipients[0].recipientType, '');
    this.selectedType= this.emailEventModel.activeRecipients[0].recipientType;
    this.selectedAlertType = this.emailEventModel.activeRecipients[0].recipientType;
    this.emailAddress = this.emailEventModel.activeRecipients[0].address;
    this.userSelection = this.emailEventModel.activeRecipients[0].username;
    if(this.selectedType==='USER_EMAIL_ADDRESS'){
      this.getUserOnly();
    }
  }


  getEcsRecipientValue(){
    this.RecipientListEntryTypeTwo(this.emailEventModel.escalationRecipients[0].recipientType, '');
    this.isEscalationSelectedType= this.emailEventModel.escalationRecipients[0].recipientType;
   this.emailAddressIsESC = this.emailEventModel.escalationRecipients[0].address;
    this.IsEscUserSelection = this.emailEventModel.escalationRecipients[0].username;
    if(this.isEscalationSelectedType==='USER_EMAIL_ADDRESS'){
      this.getUserOnly();
    }

  }

  timeInterval(){
    let timerId = setInterval(() =>
        this.isSaveSuccessful=true, 1000);
    setTimeout(() => { clearInterval(timerId);
      this.isSaveSuccessful=false; }, 5000);
  }


}
