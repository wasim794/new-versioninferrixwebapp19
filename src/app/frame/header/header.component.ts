import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {AuthenticationService} from '../../authentication/service';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {HeaderService} from '../service';
import {ServerService} from '../../core/services';
import {DictionaryService} from "../../core/services/dictionary.service";
import {StringStringPairModel} from "../../core/models/pair/string-string-pair.model";
import {MatDialog} from '@angular/material/dialog';
import {LanguageInterfaceModel} from "../../core/models/server";
import {SystemSettingService} from '../../core/services';
import {MatModuleModule} from '../../common/mat-module';
import { MatSelectModule } from '@angular/material/select';
// import {OpenDialogStart} from "../../mesh-console/pages/firmware-push/otap-file/OpenDialog/OpenDialogStart";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatModuleModule, CommonModule],
  providers: [HeaderService, ServerService, SystemSettingService],
  templateUrl: './header.component.html',
  styleUrls: []
})

export class HeaderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  selectedBoard = '';
  userName: any;
  eventCount: any;
  errorMsg: any;
  colorCode: any;
  eventLength:any;
  getLang:any= new StringStringPairModel();
  setModelLang:any;
  languages= new LanguageInterfaceModel();
  @ViewChild('notificationSideBar_tag') notificationSideBarRef: ElementRef | undefined;
  UIDICTIONARY : any;


  constructor(private router: Router, private authentication: AuthenticationService, public dictionaryService: DictionaryService,
              private _menuEventService: HeaderService, private serverService: ServerService, 
              private systemSettingService: SystemSettingService,
         public  dialog :MatDialog) {
    super();
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.userName = localStorage.getItem('UserName');
    this.getLanguages();
     this.eventLength =  localStorage.getItem('eventLength');
     this.setModelLang = localStorage.getItem('mytime');

  }

  boardSelect(selectedBoard: string) {
    this.selectedBoard = selectedBoard;
  }

  emitBoardAddGadgetEvent(event: any) {
    this._menuEventService.raiseMenuEvent({name: 'boardAddGadgetEvent', data: event});
  }

  emitBoardSelectEvent(event: string) {
    this.boardSelect(event);
    this._menuEventService.raiseMenuEvent({name: 'boardSelectEvent', data: event});
  }

  toggleNotificationSideBar() {
    this.router.navigate(['events/list']);
  }

  logout() {
    this.authentication.logout();
    this.router.navigate(['login']);
  }

  allColorCode() {
    if (this.eventCount.alarmLevel === 'INFORMATION') {
      this.eventCount = this.eventCount.count;
      if (this.eventCount > 0) {
        this.eventCount = this.eventCount.count;

      }
    } else if (this.eventCount.alarmLevel === 'WARNING') {
      this.eventCount = this.eventCount.count;
      if (this.eventCount > 0) {
        this.eventCount = this.eventCount.count;

      }
    } else if (this.eventCount.alarmLevel === 'URGENT') {
      this.eventCount = this.eventCount.count;
      if (this.eventCount > 0) {
        this.eventCount = this.eventCount.count;

      }
    } else if (this.eventCount.alarmLevel === 'CRITICAL') {
      this.eventCount = this.eventCount.count;
      if (this.eventCount > 0) {
        this.eventCount = this.eventCount.count;

      }
    } else if (this.eventCount.alarmLevel === 'EMERGENCY') {
      this.eventCount = this.eventCount.count;
      if (this.eventCount > 0) {
        this.eventCount = this.eventCount.count;
        this.colorCode = {
          'background-color': '#f40f0f'
        };
      }
    }

  }

  getLanguages(){
    this.serverService.getLanguages().subscribe((data: any)=>{
      this.getLang=data;
      localStorage.setItem("mytime", this.getLang[0].key);
    });
  }

  reloadLanguage(){
    window.location.reload();
  }

  changeLanguage(lang: string){
    this.languages.language=lang;
    this.systemSettingService.saveSystemSettings(this.languages).subscribe(()=>{
    this.reloadLanguage();
    });

  }

}
