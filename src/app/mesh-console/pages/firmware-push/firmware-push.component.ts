import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { CommonService } from '../../../services/common.service';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers: [ DictionaryService],
  selector: 'app-firmware-push',
  templateUrl: './firmware-push.component.html',
  styleUrls: []
})
export class FirmwarePushComponent implements OnInit {
  UIDICTIONARY: any;

  constructor(private router: Router, public commonService:CommonService ,  public dictionaryService: DictionaryService,) { }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });

  }

  getNodeStatus() {
    this.router.navigate(['/mesh-console/firmware-push/node-status']);
  }
  getOtabFile() {
    this.router.navigate(['/mesh-console/firmware-push/otap-file']);
  }

  nodeStatus(){
this.getNodeStatus();
  }

  OtabFile(){
this.getOtabFile();
  }

  goBack(){
    this.commonService.goBackHistory();
  }

}
