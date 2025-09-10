import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {PlatformIntegrationService} from '../../../service/platform-integration.service';
import { PlatformDetailsModel } from '../../../models/platform-details.model';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { MatModuleModule } from '../../../../common/mat-module';
import { CommonModule } from '@angular/common';
import { ServerDetailsFormComponent } from '../server-details-form/server-details-form.component';


@Component({
  standalone: true,
  imports: [MatSidenav, MatModuleModule, CommonModule, ServerDetailsFormComponent],
  providers: [PlatformIntegrationService, DictionaryService],
  selector: 'app-server-detail-list',
  templateUrl: './server-detail-list.component.html',
  styleUrls: []
})
export class ServerDetailListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('serverDetailDrawer') public serverDetailDrawer!: MatSidenav;
  platformDetailsModel: any= new PlatformDetailsModel();
  plateForms: any;
  UIDICTIONARY : any;

  constructor(private platformIntegrationService: PlatformIntegrationService,
              public dictionaryService: DictionaryService,) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.getServerDetailData();
  }

  allClose(){
    this.serverDetailDrawer.close().then(r => console.log(r));
  }

  getServerDetailData() {
    this.subs.add(this.platformIntegrationService.getPlatformDetails().subscribe(data => {
      this.platformDetailsModel = data;
      this.plateForms = [this.platformDetailsModel];
    }));
      }

  serverSidebar(){
    this.serverDetailDrawer.open().then(r => console.log(r));
  }

}
