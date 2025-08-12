import {Component, OnInit, ViewChild} from '@angular/core';
import {SettingsService, ExcelImportService, ProfileService} from '../../shared/service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {BacnetPublisherSettingsSummaryModel} from '../../shared/model';
import {MatDialog} from '@angular/material/dialog';
import {CommonService} from 'src/app/services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {BacnetDataSourceModel} from "../../../datasource/components/banet-mstp";
import {ProfilepushsystemComponent} from "../profilepushsystem/profilepushsystem.component";
import {BacnetService, BacnetLocalDeviceModel} from '../../../bacnet';
import {ProfilePushSettingsModel} from '../../shared/model';
import {MatSidenav} from '@angular/material/sidenav';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: []
})
export class SettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  public publisherModel: BacnetPublisherSettingsSummaryModel;
  public localNetworkNumber: string;
  bacnetModel: BacnetLocalDeviceModel<any>[];
  bacnetDS: BacnetDataSourceModel = new BacnetDataSourceModel();
  ProfilePushSettings:any= new ProfilePushSettingsModel();
  localDevice : string;
  fileName: string;
  profileTypes = [];
  selectedFile: File;
  isReadOnly: boolean = true;
  publishedBacnetMsg="Published on BACnet successfully";
  fileUpload="Uploading files to the process";
  UIDICTIONARY:any;
  @ViewChild('drawerPushSetting') public sideNav: MatSidenav;
  constructor(
    private _service: SettingsService,
    public dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private _commonService: CommonService,
    private bacnetService: BacnetService,
    private excelImport: ExcelImportService,
    private profileService: ProfileService,
  ) {
    super();
  }

  ngOnInit() {
    this.subs.add(this._service.getPublisher().subscribe((model) => this.publisherModel = model));
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getBacnet();
    this.getProfileTypes();

  }




  getProfileTypes() {
    this.subs.add(this.profileService.getProfileType().subscribe(data => {
      this.profileTypes = data.items;
    }));
  }


  publish() {
    this.subs.add(this._service.publishLightNodePoints(this.localNetworkNumber)
      .subscribe((model) => {
        this.publisherModel = model;
        this._commonService.notification(this.publishedBacnetMsg);
      }));
  }
  getBacnet() {
    this.subs.add(this.bacnetService.get().subscribe(data => {
      this.bacnetModel = data;
    }));
  }

  addProfile(event, componentType) {
    if (event.source.selected) {
     if(event.source.value.type==='LIGHT_CONTROLLER.PROFILE'){
       this.isReadOnly=false;
     }else{
       this.isReadOnly=true;
     }
    }
  }


  delete() {
    this._commonService.openConfirmDialog('Are you sure , you want to delete.....? ', name)
      .afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this._service.deletePublisher()
          .subscribe((model) => {
            this.publisherModel = model;
          }));
      }
    });
  }

  onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.fileName = this.selectedFile.name;
  }

  fileUploads(){
    const formData: any = new FormData();
    this.fileName = this.selectedFile.name;
    formData.append('file', this.selectedFile);
    this.excelImport.ledControllerImportExcelData(formData).subscribe(data => {
      this._commonService.notification(this.fileUpload);
    });
  }

  profilePushSettings(event){
   this.sideNav.open();
  }

  closeSidebar(event){
    this.sideNav.close();
  }
}
