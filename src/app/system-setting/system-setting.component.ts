import {Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {SystemSettingModel} from '../core/models';
import {Router} from '@angular/router';
import {UnsubscribeOnDestroyAdapter} from '../common';
import {CommonService} from '../services/common.service';
import {MenuModel} from '../frame/model/menuModel';
import {SystemSettingService} from '../core/services';
import {LoadComponentsComponent} from './load-components';
import {DictionaryService} from "../core/services/dictionary.service";
import {persistentQueueModel} from './shared'
import {MatDialog} from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, LoadComponentsComponent],
  providers: [SystemSettingService, DictionaryService],
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.css']
})
export class SystemSettingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  saveSuccessMsg = 'Saved successfully';
  private errorMsg: any;
  private systemSetting = {} as SystemSettingModel;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  @ViewChild('systemSettingSideBar_tag') layoutSideBarRef!: ElementRef;
  componentRef: any;
  menuData!: MenuModel[];
  subMenus!: MenuModel[];
  @ViewChild(LoadComponentsComponent)
  private LoadComponentsComponent!: LoadComponentsComponent;
  msg="Successfully";
  persistentQueue= new persistentQueueModel();
  UIDICTIONARY : any;

  constructor(
    private systemSettingService: SystemSettingService,
    private resolver: ComponentFactoryResolver,
    private commonService: CommonService,
    public dictionaryService: DictionaryService,
    private router: Router,
    public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('systemSettings').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.systemSettingDetail();
    this.getMenus();
  }

  showSystemSettingSidebar(component: any, systemSettingSideNav: any) {
    if(component==='ADAPPT_INTEGRATION.MENU'){
      this.showAdapt();
    }else {
      systemSettingSideNav.open();
      this.LoadComponentsComponent.dynamicLoad(component);
    }
  }

  systemsettingsidebar(systemSettingSideNav: any) {
    systemSettingSideNav.close();
  }


  private systemSettingDetail() {
    this.subs.add(this.systemSettingService.getSystemSettings().subscribe(data => {
      this.systemSetting = data;
    }, err => this.errorMsg = err));
  }

  public showAdapt (){
    this.router.navigate(['/system-setting/adapt']).then(r => console.log(r));
  }

  public openBacnetBrowser(){
    this.router.navigate(['/system-setting/bacnet-device-browser']).then(r => console.log(r));
  }
  private getMenus() {
    this.commonService.getMenu().subscribe(data => {
      if (data) {
        this.commonService.hideloader();
      }
      this.menuData = data;
      this.menuData.forEach(menuData => {
        if (menuData.type === 'SYSTEM_SETTING.MENU' && menuData.hasSubMenu) {
          this.subMenus = menuData.subMenus;
        }
      });
    });
  }

}
