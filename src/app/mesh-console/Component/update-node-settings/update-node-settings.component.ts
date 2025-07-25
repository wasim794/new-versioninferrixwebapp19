import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UnsubscribeOnDestroyAdapter} from "../../../common";
import {MeshConsoleService} from '../../shared/services';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[ CommonModule, MatModuleModule],
  providers: [CommonService, DictionaryService, MeshConsoleService],
  selector: 'app-update-node-settings',
  templateUrl: './update-node-settings.component.html'
})
export class UpdateNodeSettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  nodeAddressOne!:boolean;
  networkOne!:boolean;
  channelOne!:boolean;
  nodeUpdateBoolean!:boolean;
  address!: number;
  nodeAddress!: any;
  networkAddress!: any;
  channel!: any
  UIDICTIONARY : any;
  updateMsg="UPDATE NODE SETTINGS SUCCESSFULLY";
  constructor(public dialogRef: MatDialogRef<UpdateNodeSettingsComponent>,
              public dictionaryService: DictionaryService,
              public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
              private _meshConsoleService: MeshConsoleService,
              private _commonService: CommonService) {
    super();
  }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
     this.UIDICTIONARY= this.dictionaryService.uiDictionary;
         });
    this.address = this.data.data.address;
  }

  nodeAddressOnly(event: any){
    event.checked==true?this.enableNodeAddress() : this.disableNodeAddress();
  }
  networkOnly(event: any){
    event.checked==true?this.enableNetworkOne() : this.disableNetworkOne();
  }
  channelOnly(event: any){
    event.checked==true?this.enableChannelOne() : this.disableChannelOne();
  }

  enableNodeAddress(){
    this.nodeUpdateBoolean = true;
    this.nodeAddressOne = true
  }

  disableNodeAddress(){
    this.nodeAddressOne = false;
    this.nodeUpdateBoolean = true;
    this.nodeAddress=null;
  }



  enableNetworkOne(){
    this.nodeUpdateBoolean = true;
    this.networkOne = true
  }

  disableNetworkOne(){
    this.nodeUpdateBoolean = true;
    this.networkOne = false;
    this.networkAddress=null;
  }

  enableChannelOne(){
    this.nodeUpdateBoolean = true;
    this.channelOne = true
  }

  disableChannelOne(){
    this.nodeUpdateBoolean = true;
    this.channelOne = false;
    this.channel=null;
  }

  saveNodeSettings() {
    this.add(this._meshConsoleService.updateNodeSettings(this.address, this.nodeAddress, this.networkAddress , this.channel).subscribe(data=>{
     this._commonService.notification(this.updateMsg);
     this.dialogRef.close();
    }))
  }

}
