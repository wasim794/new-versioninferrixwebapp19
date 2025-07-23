import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UnsubscribeOnDestroyAdapter} from "../../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {MeshOtaService} from '../../../../shared/services';
import { DictionaryService } from "../../../../../core/services/dictionary.service";
import {ACTIONSNODESTATUS} from "../shared";

@Component({
  selector: 'app-scratchpadaction',
  templateUrl: './scratchpadaction.component.html',
  styleUrls: []
})
export class ScratchpadactionComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  action: string;
  sequence: number;
  targetCrc: number;
  delay: number
  public startMsg: any;
  actionNodeStatus=ACTIONSNODESTATUS;
  sequenceNo:boolean;
  targetSRC:boolean;
  actionHideShow:boolean;
  DELAY:boolean;
  UIDICTIONARY : any;

  constructor(public dialogRef: MatDialogRef<ScratchpadactionComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private meshOtaService:MeshOtaService,public dictionaryService: DictionaryService) {super(); }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
         this.UIDICTIONARY= this.dictionaryService.uiDictionary;
        });
    this.action = this.data.data;
   this.popActionCondition();
  }

      popActionCondition(){
        if(this.data.data==='allAction'){
          this.actionHideShow = false;
        }else{
          this.actionHideShow = true;
        }
      }

  actionsNodeSelection(event, actionsNode) {
      if (event.source.selected) {
          if (actionsNode.key === 'NO_OTAP') {
            this.noOTAPTrue();
          } else if (actionsNode.key === 'LEGACY') {
            this.legacyTrue();
          }
          else if(actionsNode.key==='PROPAGATE_ONLY' || actionsNode.key==='PROPAGATE_AND_PROCESS'){
            this.propagateOnly();
          }
          else if(actionsNode.key==='PROPAGATE_AND_PROCESS_WITH_DELAY'){
            this.propagateAndProcessWithLegacy();
          }
          else {
            this.noOTAPFalse();
            this.legacyFalse();
          }
      }
  }

  private noOTAPTrue(){
  this.sequenceNo = true;
  this.DELAY = true;
  this.targetSRC = true;
  this.zeroValueOnlyOTAPSet();
  }

  private noOTAPFalse(){
    this.sequenceNo = false;
    this.DELAY = true;
    this.targetSRC = false;
  }

  private legacyTrue(){
    this.DELAY = true;
    this.targetSRC = false;
    this.sequenceNo = false;
    this.zeroValueOnlyLegacySet();
  }

  private legacyFalse(){
    this.DELAY = false;
    this.targetSRC = false;
    this.sequenceNo = false;
  }

  private zeroValueOnlyOTAPSet(){
    this.targetCrc = 0;
    this.sequence = 0;
    this.delay = 0;
  }

  private zeroValueOnlyLegacySet(){
    this.sequence = null;
    this.targetCrc = null;
    this.delay = 0;
  }

  private propagateOnly(){
    this.sequenceNo = false;
    this.targetSRC = false;
    this.DELAY = true;
    this.delay = 0;
    this.targetCrc = null;
    this.sequence = null;
   }

   private propagateAndProcessWithLegacy(){
    this.sequenceNo = false;
    this.targetSRC = false;
    this.DELAY = false;
    this.sequence=null;
    this.targetCrc=null;
    this.delay = null;
   }


  updateUsingAction(){
    if(this.sequence===undefined){
     alert("Fill out all mandatory fields");
     return false;
    }else{
      switch (this.action) {
        case 'LEGACY':
          this.updateLegacy(this.action, this.sequence, this.targetCrc, this.delay);
          break;
        case 'NO_OTAP':
          this.updateNoOtap(this.action);
          break;
        case 'PROPAGATE_AND_PROCESS_WITH_DELAY':
         this.updatePropagateAndProcessWithDelay(this.action, this.sequence, this.targetCrc, this.delay);
          break;
        case 'PROPAGATE_ONLY':
          this.updatePropagateOnly(this.action, this.sequence, this.targetCrc, this.delay);
          break;
        default:
         this.updatePropagateAndProcess(this.action, this.sequence, this.targetCrc, this.delay);
          break;
      }
    }
  }

  updateNoOtap(action){
    this.subs.add(this.meshOtaService.updateFirmware(action,'0','0','0').subscribe(data=>{
      this.startMsg = data;
      this.dialogRef.close(true);
    }))
  }


  updateLegacy(action, sequence, targetCrc, delay){
    delay = '0';
    this.subs.add(this.meshOtaService.updateFirmware(action, sequence, targetCrc, delay).subscribe((data) => {
      this.startMsg = data;
      this.dialogRef.close(true);
    }))
  }


  updatePropagateOnly(action, sequence, targetCrc, delay){
    delay = '0';
    this.subs.add(this.meshOtaService.updateFirmware(action, sequence, targetCrc, delay).subscribe((data) => {
      this.startMsg = data;
      this.dialogRef.close(true);
    }));
  }

  updatePropagateAndProcess(action, sequence, targetCrc, delay){
     delay = '0';
    this.subs.add(this.meshOtaService.updateFirmware(action, sequence, targetCrc, delay).subscribe((data) => {
      this.startMsg = data;
      this.dialogRef.close(true);
    }));
  }

  updatePropagateAndProcessWithDelay(action, sequence, targetCrc, delay){
    this.subs.add(this.meshOtaService.updateFirmware(action, sequence, targetCrc, delay).subscribe((data) => {
      this.startMsg = data;
      this.dialogRef.close(true);
    }));
  }

  updateUsingActionLegacy(){
    this.subs.add(this.meshOtaService.updateLegacyFirmware(this.sequence).subscribe((data) => {
      this.startMsg = data;
      this.dialogRef.close(true);
    }));
  }


}
