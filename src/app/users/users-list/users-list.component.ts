import {Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../service';
import { MatModuleModule } from '../../common/mat-module';
import { CommonModule } from '@angular/common';
import {CommonService} from '../../services/common.service';
import {User} from '../model';
import {commonHelp} from '../../help/commonHelp';
import {Location} from '@angular/common';
import {UsersFormComponent} from '../users-form';
import {HelpModalComponent} from '../../help/help-modal/help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {MatPaginator} from '@angular/material/paginator';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../core/services/dictionary.service";


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, UsersFormComponent],
  providers: [UsersService, DictionaryService],
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: []
})
export class UsersListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(UsersFormComponent)
  usersFormComponent!: UsersFormComponent;
  @ViewChild('userdrawer')
  public userSidebar!: MatSidenav;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  errorMsg                                           : any;
  userList: any = new User();
  loading                                            = false;
  permissions!: string;
  isEdit!: boolean;
  info                                               = new commonHelp();
  modal                                              : any = new User();
  totalUsers!: any[];
  limit                                              = 12;
  offset                                             = 0;
  pageSizeOptions                                    : number[] = [12, 16, 20];
  private userToDelete                               : any = new User();
  UIDICTIONARY                                       : any;

  constructor(private userService: UsersService, private commonService: CommonService, private location: Location,
              private dialog: MatDialog, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });

    this.userlist(this.limit, this.offset);
  }

  getNext(event: { pageSize: number; pageIndex: number; }) {
    this.offset = event.pageSize * event.pageIndex;
    this.userlist(event.pageSize, this.offset);
  }

  userlist(limit: number, offset: number) {
    this.subs.add(this.userService.usersList(limit, offset).subscribe(data => {
        if (data) {
          this.commonService.hideloader();
        }
        this.totalUsers = data;
        this.userList = data;
        console.log(this.userList);
      }, err => this.errorMsg = err
    ));
  }

  editUser(username: string) {
    this.userSidebar.open();
    this.usersFormComponent.editUser(username);
  }

  sidebarclose() {
    this.userSidebar.close();
  }

  deleteUser(user: { username: string; }) {
    this.userToDelete = user;
    this.commonService.openConfirmDialog('Are you want to delete ', user.username).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.userService.deleteUser(user.username).subscribe(data => {
          this.userList = this.userList.filter((h: any) => h !== this.userToDelete);
        }));
      }
    });
  }

  addUser() {
    this.usersFormComponent.resetUserForm();
    this.userSidebar.open();
  }

  userListHelp() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'User List', content: this.info.htmlPermissionHelp},
      disableClose: true
    });
  }

  updateSavedUser(data: User) {
    this.userList.push(data);
  }

  updateUpdatedUser(user: { username: string; data: User; }) {
    this.sidebarclose();
    const updateItem = this.userList.find((x: { username: string; }) => x.username === user.username);
   if (updateItem) {
    const index = this.userList.indexOf(updateItem);
    this.userList[index] = user.data;
     }
     }

}
