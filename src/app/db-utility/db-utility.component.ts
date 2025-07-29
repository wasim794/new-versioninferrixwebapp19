import {ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {ServerService, WebsocketService, DictionaryService} from '../core/services';
import {DatabaseSettingsModel} from './shared/model/database-settings.model';
import {DatabaseActionsModel} from './shared/model/database-actions.model';
import {DbUtilityService} from './shared/service/db-utility.service';
import {CommonService} from '../services/common.service';
import {saveAs} from 'file-saver';
import {MatDialog} from '@angular/material/dialog';
import {commonHelp} from '../help/commonHelp';
import {HelpModalComponent} from '../help/help-modal/help-modal.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Observable} from "rxjs";

@Component({
  selector: 'app-db-utility',
  templateUrl: './db-utility.component.html',
  styleUrls: []
})
export class DbUtilityComponent implements OnInit, AfterViewInit {
  selectedFilesColumns: string[] = ['S.No.', 'File Name', 'Action'];
  websocket_URL = '/temporary-resources?token=';
  token: string;
  listDbAll: any;
  databaseSettings = {} as DatabaseSettingsModel;
  databaseActions = {} as DatabaseActionsModel;
  websocketResponse: any;
  dbList = [];
  public messageError: boolean;
  obs: Observable<any>;
  public dataSources: any;
  public dataSource = new MatTableDataSource<any>([]);
  dbBackupMessage = 'Db backup Successfully';
  dbRestoreMessage = 'Db Restore Successfully';
  dbSaveSettingMessage = 'Db Setting Saved Successfully';
  BackupDownloadMessage = 'backup Download Successfully';
  dbUploadMessage = 'File Uploaded Successfully';
  totaldblist: number;
  info = new commonHelp();
  fileName: string;
  blob: Blob;
  errorMsg: any;
  backUperror = [];
  isRestart: boolean = false;
  pageData: boolean;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  backupId: string = null;
  showWebsocketData: boolean = true;
  restoreId: string = null;
  processing: boolean = true;
  restartStackMsg= "Restarting the stack";
  UIDICTIONARY : any;
  showIcon: { [key: number]: boolean } = {};
  @ViewChild('paginatorRef') paginator: MatPaginator;

  constructor(private _configurationService: ConfigurationService,
              private _WebSocketService: WebsocketService,
              public dictionaryService: DictionaryService,
              private dialog: MatDialog,
              private dbUtilityService: DbUtilityService,
              private commonService: CommonService,
              private serverService: ServerService, private changeDetectorRef: ChangeDetectorRef) {
    this.token = JSON.parse(localStorage.getItem('access_token')).token;
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('dbUtility').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
    this.websocket();
    // this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  websocket() {
    const message = {
      'requestType': 'SUBSCRIPTION',
      'anyStatus': true,
      'anyResourceType': false,
      'resourceTypes': ['dbUtils']
    };

    this._configurationService.connect(message);
    this._WebSocketService.subscribeWebsocket().subscribe(data => {
      this.websocketResponse = JSON.parse(data);
      if (this.websocketResponse.messageType === 'RESPONSE') {
        this.listDb();
      }
      this.async();
    });
  }

  async async(): Promise<void> {
    if (this.websocketResponse.messageType === 'NOTIFICATION' && this.websocketResponse.payload.status === 'SUCCESS') {
      if (this.backupId !== null && this.backupId === this.websocketResponse.payload.id) {
        this.listDb();
        this.backupId = null;
        this.showWebsocketData = true;
      }

      if (this.showWebsocketData) {
        const dataSources = await this.websocketResponse.payload.result.result;
        this.pageData = true;
        this.dataSource = new MatTableDataSource(dataSources);
        // this.dataSource.paginator = this.paginator;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  saveBackupSetting() {
    this.dbUtilityService.saveBackupSetting(this.databaseSettings).subscribe(data => {
      this.commonService.notification(this.dbSaveSettingMessage);
    }, error => {
      this.backUperror = error.result.message;
      this.timeOutFunction();
    })
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  dbBackup() {
    this.databaseActions.backupFileName === undefined ? alert('input field empty') : this.processing=false;
    this.databaseActions.action = 'BACKUP';
    this.databaseActions.restoreFileName = null;
    this.databaseActions.expiration = 200;
    this.databaseActions.timeout = 200;
    this.dbUtilityService.restoreOrDbBackupOrList(this.databaseActions).subscribe(data => {
      this.backupId = data.id;
      this.handleWebSocketData(this.backupId);
      this.processing=true;
    });
  }



  listDb() {
    this.databaseActions.action = 'LIST';
    this.databaseActions.backupFileName = null;
    this.databaseActions.restoreFileName = null;
    this.databaseActions.expiration = 200;
    this.databaseActions.timeout = 200;

    this.dbUtilityService.restoreOrDbBackupOrList(this.databaseActions).subscribe(data => {
      if (data) {
        this.commonService.hideloader();
        const dataSources = data.result.result;
        this.pageData = true;
        this.dataSource = new MatTableDataSource(dataSources);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  restoreDb(fileName) {
    this.showIcon[fileName] = true;
    this.commonService.openConfirmDialog('Are you sure, you want to Restore.....?',
      fileName).afterClosed().subscribe(response => {
      if (response) {
        this.databaseActions.action = 'RESTORE';
        this.databaseActions.backupFileName = null;
        this.databaseActions.restoreFileName = fileName;
        this.databaseActions.expiration = 60000;
        this.databaseActions.timeout = 60000;
        this.dbUtilityService.restoreOrDbBackupOrList(this.databaseActions).subscribe(data => {
          this.restoreId = data;
          this.showWebsocketData = true;
          this.handleWebSocketData(fileName);
        });
      }else{
        this.showIcon[fileName] = false;
      }
    });
  }


  private handleWebSocketData(fileName) {
    this._WebSocketService.subscribeWebsocket().subscribe(data => {
      this.websocketResponse = JSON.parse(data);
      if (this.websocketResponse.notificationType === 'delete') {
        this.commonService.notification(this.websocketResponse.payload.result.message);
        this.showIcon[fileName] = false;
        this.isRestart = true;
      }
    });
  }

  DbUtilityInfoHelpModel() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'HelpDbUtility', content: this.info.HtmlPointValueLoggingHelp},
      disableClose: true
    });
  }

  //download function

  downloadDb(fileName) {
    this.commonService.openConfirmDialog('Are you sure,you want to Download......?',
      fileName).afterClosed().subscribe(response => {
      if (response) {
        // return;
        this.dbUtilityService.downloadBackupOrList(fileName).subscribe(data => {
          saveAs(new Blob([data], {type: 'application/zip'}), fileName);
          this.commonService.notification(this.BackupDownloadMessage);
        }, err => {
          this.errorMsg = err
        });
      }
    });
  }

  onFileSelected(event) {
    if (confirm('Are you sure you want to save this file?')) {
      // Save it!
      const file: File = event.target.files[0];
      if (file) {
        const formData: any = new FormData();
        this.fileName = file.name;
        formData.append('key', this.fileName);
        formData.append('value', file);
        this.dbUtilityService.dbUpload(formData).subscribe(data => {
          this.commonService.notification(this.dbUploadMessage);
          this.websocket();
        });
      }
    } else {
    }
  }

  reset() {
    this.fileName = null;
  }

  restartStack() {
    this.serverService.restartStack().subscribe(
      data => {
        this.commonService.notification(this.restartStackMsg);
        this.isRestart = false;
      });
  }
}

