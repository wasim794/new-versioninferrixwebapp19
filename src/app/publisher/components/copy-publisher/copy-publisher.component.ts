import {Component, Inject, OnInit, EventEmitter, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractPublisherModel} from '../../../core/models/publisher';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {HttpSenderService} from '../../service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
    imports:[CommonModule, MatModuleModule, ReactiveFormsModule],
  selector: 'app-copy-publisher',
  templateUrl: './copy-publisher.component.html',
  styleUrls: []
})
export class CopyPublisherComponent implements OnInit {
  publishersCopy:any= new AbstractPublisherModel();
  xid: any;
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  copyName:any;
  pubPoints!:boolean;
  pubEnabled!:boolean;
  UIDICTIONARY : any;

  constructor(
    public dialogRef: MatDialogRef<CopyPublisherComponent>, public dictionaryService: DictionaryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: HttpSenderService,
    private _commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.publishersCopy = this.data.copyDataPub;
    this.xid = this.data.copyDataPub.xid;
    this.copyName = this.data.copyDataPub.name;
  }

  saveCopyData(xid: any) {
    let param = '';
    if (this.copyName) {
      param = param + 'copyName=' + this.copyName;
    }
    if (this.pubPoints) {
      param = param + '&copyPoints=' + this.pubPoints;
    }
    if (this.pubEnabled) {
      param = param + '&enabled=' + this.pubEnabled;
    }

    this._service.copy(xid, param).subscribe((data) => {

      this._commonService.notification(
        'Copy Publisher ' + this.publishersCopy.name + ' ' + this.saveSuccess
      );
      this.dialogRef.close('close');

    },error => {
      error.result.message.forEach((value: any)=>{
        this._commonService.notification(value.message)
        return;
      })
    });
  }

}
