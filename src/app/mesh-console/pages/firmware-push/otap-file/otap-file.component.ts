import {Component, OnInit, ViewChild} from '@angular/core';
import {MeshOtaService} from "../../../shared/services";
import {UnsubscribeOnDestroyAdapter} from "../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {FileModel} from '../../../../core/models/files/file.model';
import {CommonService} from '../../../../services/common.service';
import {MeshSinkService} from "../../../shared/services";
import {OpenDialogStart} from "./OpenDialog/OpenDialogStart";
import {MatDialog} from '@angular/material/dialog';
import {param} from "jquery";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import { PageEvent } from '@angular/material/paginator';
import { DictionaryService } from "../../../../core/services/dictionary.service";
@Component({
  selector: 'app-otap-file',
  templateUrl: './otap-file.component.html',
  styleUrls: []
})
export class OtapFileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['sno', 'filename', 'lastModified', 'folderPath', 'data'];
  public dataSource:any = new MatTableDataSource<FileModel>();
  limit = 10;
  offset = 0;
  obs:any= new Observable;
  pageSizeOptions: number[] = [10, 20, 30, 40];
  fileName: string;
  messages = "fileUploaded Successfully";
  isStackRunning: boolean;
  clearScratchpad:any;
  startProcess:any;
  transferProcess:any;
  deleteFile:boolean;
  stackStop : any;
  UIDICTIONARY: any;

  @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule;
  activeAction: string = '';
  stopMsg='Successfully Stopped';
  deleteMsg = 'Successfully Deleted';
  isActive: boolean = true;
  constructor(
    public meshOtaService: MeshOtaService,
    public commonService:CommonService,
    public _service: MeshSinkService,
    public  dialog :MatDialog,
    public dictionaryService: DictionaryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getUploadedFirmware(param);
    this.clearScratchpad = true;
    this.deleteFile = true;
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
    this.applyFilter('');
  }


  getUploadedFirmware(param): void {
    this.subs.add(this.meshOtaService.getUploadedFirmware().subscribe(data => {
      this.dataSource.data = data;
    }));
  }

  onPageChange(event: PageEvent): void {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * this.limit;
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getUploadedFirmware(param);
  }


  openDialog(event) {
    const dialogRef = this.dialog.open(OpenDialogStart, {
      data: {filenames: event.filename}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result===true){
        this.clearScratchpad = event.filename;
        this.startProcess = event.filename;
       this.transferProcess= false;
      }
    });
  }

  uploadFirmware(event) {
    if (confirm('Are you sure you want to upload this file?')) {
      const file: File = event.target.files[0];
      if (file) {
        const formData: any = new FormData();
        this.fileName = file.name;
        formData.append('key', this.fileName);
        formData.append('value', file);
        this.meshOtaService.uploadFirmware(formData).subscribe(data => {
          this.commonService.notification(this.messages);
          this.clearScratchpad = true;
          this.startProcess = false;
          this.transferProcess = false;
          this.deleteFile = true;
          this.getUploadedFirmware(param);
        });
      }
    } else {
    }
  }
  startStack(): void {
    this.subs.add(this._service.startStack().subscribe((data) => {
      this.stackStop = data;
      this.isStackRunning = false;
      if (data.confirmMessage.messageType === 'SUCCESS') {
        this.isStackRunning = true;
        this.clearScratchpad = true;
        this.startProcess = false;
        this.transferProcess = false;
        this.deleteFile = true;
        this.commonService.notification(data.confirmMessage.message);
      }
    }));
  }

  stopStack(): void {
    this.subs.add(this._service.stopStack().subscribe((data) => {
      this.stackStop = data;
      this.isActive = false;
      if (data.confirmMessage.messageType === 'SUCCESS') {
        this.isStackRunning = true;
        this.clearScratchpad = true;
        this.startProcess = false;
        this.transferProcess = false;
        this.deleteFile = true;
        this.commonService.notification("Stack Successfully Stopped");
      }
      OtapFileComponent.showMessages();
    }));
  }

  clearSinkScratchpad(event){

    this.subs.add(this.meshOtaService.clearSinkScratchpad().subscribe(data => {

      this.commonService.notification(data.confirmMessage.message);
      this.clearScratchpad = event.filename;
      this.transferProcess = event.filename;
      this.deleteFile = true;
      this.getUploadedFirmware(param);

    }));
  }


  transferFirmware(element){

    this.commonService.openConfirmDialog('Are you want to Transfer ', element.filename).afterClosed().subscribe(response => {
      if (response) {
        this.meshOtaService.transferFirmware(element.filename).subscribe(data => {
          this.commonService.notification(data.confirmMessage.message);
          this.getUploadedFirmware(param);
          this.clearScratchpad = true;
          this.startProcess = element.filename;
          this.transferProcess = element.filename;
        });
      }
    });
  }

  applyFilter(event: any): void {
    const filterValue = event.target.value.trim().toLowerCase();
    let param;

    if (filterValue.length) {
      param = 'like(filename,%2A' + filterValue + '%2A)';
    } else {
      param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+filename)';
    }
    this.getUploadedFirmware(param);
  }

  deleteUploadedFirmware(element: FileModel): void {

    this.commonService.openConfirmDialog('Are you want to delete ', element.filename).afterClosed().subscribe(response => {
      if (response) {
        this.meshOtaService.deleteUploadedFirmware(element.filename).subscribe(data => {
          this.commonService.notification("Successfully Deleted");
          this.getUploadedFirmware(param);

        });
      }
    });
  }


  private static showMessages() {
    (<any>$('#messages')).show();
    (<any>$('#messages')).fadeOut(2000);
  }
}

