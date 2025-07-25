import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommonService} from "../../../../../services/common.service";
import {MeshOtaService, MeshSinkService} from "../../../../shared/services";
import {FileModel} from "../../../../../core/models/files/file.model";
import {UnsubscribeOnDestroyAdapter} from "../../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import { DictionaryService } from "../../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';
@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers: [MeshOtaService, CommonService, MeshSinkService, DictionaryService],
  selector: 'dialogHtml',
  templateUrl: 'OpenDialogStart.html',


})
export class OpenDialogStart extends UnsubscribeOnDestroyAdapter implements OnInit {
  name!: string;
  sequence!: number;
  model!: FileModel;
  showDialog = true;
  public messageError!: boolean;
  error!: any[];
  @Output() addedSavedDatasource = new EventEmitter<any>();
  dataSource!: FileModel[];
  UIDICTIONARY : any;

  constructor(public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public filenames: any,
              private meshOtaService: MeshOtaService,
              public commonService:CommonService,
              public dialogRef: MatDialogRef<OpenDialogStart>,
              public _service: MeshSinkService,
              public dictionaryService: DictionaryService,
  ) {
    super();
  }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
    this.name = this.filenames.filenames;

  }


  startFirmware(element: any){
    this.commonService.openConfirmDialog('Are you want to startFirmware ', this.name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.meshOtaService.startFirmware(this.name, this.sequence).subscribe(data => {
          this.commonService.notification(data.confirmMessage.message);
          this.showDialog = false;
        }));

      }
    }
    )};


}
