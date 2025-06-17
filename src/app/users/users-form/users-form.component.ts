import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  UsersService
} from '../service';
import {
  User
} from '../model';
import {
  CommonService
} from '../../services/common.service';
import {
  UnsubscribeOnDestroyAdapter
} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../core/services/dictionary.service";
import {Alarm_level, StaticData} from "../../common/static-data/static-data";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module/mat-module.module';


@Component({
   standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [UsersService, DictionaryService],
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: []
})
export class UsersFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Output() updateSavedUser         : EventEmitter<any> = new EventEmitter<any>();
  @Output() updateUpdatedUser       : EventEmitter<any> = new EventEmitter<any>();
  user                              = new User();
  isEdit!: boolean;
  permissions!: string;
  alarmCodes                        : StaticData[] = Alarm_level;
  saveSuccessMsg                    = 'Saved successfully';
  updateSuccessMsg                  = 'Updated successfully';
  private isSaveSuccessful          : boolean | undefined;
  private isUpdateSuccessful        : boolean | undefined;
  usersFormError!: any[];
  selectedPermissions!: any[];
  currentUser!: string;
  newPassword!: string;
  newGroup!: string;
  isPasswordHidden!: boolean;
  isNewPasswordHidden!: boolean;
  public messageError!: boolean;
  UIDICTIONARY                      : any;
  isActivePdSmall!: boolean;


  constructor(private userService: UsersService,
              private commonService: CommonService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });

    this.getPermission();
  }

  getPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  editUser(username: string) {
    this.currentUser = username;
    this.subs.add(this.userService.getUser(username).subscribe(data => {
      this.isEdit = true;
      this.isPasswordHidden = true;
      this.isNewPasswordHidden = false;
      this.user = data;
      this.newPassword = '';
      if (this.user.lastLogin === 0) {
        this.user.lastLogin = null;
      }
      this.displayPermissions();
      this.isActivePdSmall = true;
    }));
  }

  displayPermissions() {
    this.selectedPermissions = [];
    const permission = this.user.permissions;
    this.selectedPermissions = permission.split(',');
  }

  saveUser() {

    if (this.selectedPermissions) {
      this.user.permissions = this.selectedPermissions.toString();
    }
    this.subs.add(this.userService.addUser(this.user).subscribe(data => {
      this.updateSavedUser.emit(data);
      this.isSaveSuccessful = true;
      this.isEdit = true;
      this.commonService.notification('User ' + this.user.username + ' ' + this.saveSuccessMsg);
    }, error => {
      this.usersFormError = error.result.message;
      this.timeOutFunction();
    }));
  }

  private timeOutFunction(){
    this.messageError = true;
    setTimeout(()=>{
      this.messageError = false;
    }, 10000);
  }

  updateUser() {
    if (this.selectedPermissions) {
      this.user.permissions = this.selectedPermissions.toString();
    }
    if (this.newPassword) {
      this.user.password = this.newPassword;
    } else {
      this.user.password = '';
    }
    this.subs.add(this.userService.updateUser(this.currentUser, this.user).subscribe(user => {
      this.getPermission();
      const data = {
        data: user,
        username: this.currentUser
      };
      this.updateUpdatedUser.emit(data);
      this.isUpdateSuccessful = true;
      this.commonService.notification('User ' + this.user.username + ' ' + this.updateSuccessMsg);
    }, error => {
      this.usersFormError = error.result.message;
     this.timeOutFunction();
    }));
  }

  resetUserForm() {
    this.user = new User();
    this.selectedPermissions = [];
    this.isPasswordHidden = false;
    this.isNewPasswordHidden = true;
    this.isEdit = false;
    this.isActivePdSmall = false;
  }

  addNewGroup() {
      this.selectedPermissions.push(this.newGroup);
  }
}
