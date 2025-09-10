import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PlatformDetailsModel } from '../../../models/platform-details.model';
import { UnsubscribeOnDestroyAdapter } from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import { PlatformIntegrationService } from '../../../service/platform-integration.service';
import { CommonService } from '../../../../services/common.service';
import { DictionaryService } from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone:true,
  imports: [CommonModule, MatModuleModule],
  providers: [PlatformIntegrationService, CommonService, DictionaryService],
  selector: 'app-server-details-form',
  templateUrl: './server-details-form.component.html',
  styleUrls: []
})
export class ServerDetailsFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  platformDetailsModel: PlatformDetailsModel = new PlatformDetailsModel();
  messageError!:boolean;
  serverError: any[] = [];
  @Output() allClose = new EventEmitter<any>();
  saveSuccessMsg: string = 'Saved successfully';
  plateForms: any;
  UIDICTIONARY : any;

  constructor(private platformIntegrationService: PlatformIntegrationService,
              private commonService: CommonService,
              public dictionaryService: DictionaryService,) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });

    this.getServerDetailData();
  }

  getServerDetailData() {
    this.subs.add(this.platformIntegrationService.getPlatformDetails().subscribe(data => {
      this.platformDetailsModel = data;
    }));
  }

  saveServerDetails() {
    this.subs.add(this.platformIntegrationService.savePlatformDetails(this.platformDetailsModel).subscribe(data => {
      this.commonService.notification(this.saveSuccessMsg);
      this.allClose.emit(data);
    }));

  }


}
