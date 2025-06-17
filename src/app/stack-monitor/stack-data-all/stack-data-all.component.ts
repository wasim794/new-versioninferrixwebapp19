import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CommonService} from '../../services/common.service';
import {ConfigurationService} from '../../services/configuration.service';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [CommonService, ConfigurationService, DictionaryService],
  selector: 'app-stack-data-all',
  templateUrl: './stack-data-all.component.html',
  styleUrls: []
})
export class StackDataAllComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
   UIDICTIONARY : any;

  constructor(@Inject(MAT_DIALOG_DATA) private stackAllData: any,
              private commonService: CommonService,
              private _configurationService: ConfigurationService, public dictionaryService: DictionaryService) {
    super();
  }

  stackData = [];
  displayedColumns: string[] = ['S.No.', 'Name', 'Value'];

  ngOnInit() {
    this.dictionaryService.getUIDictionary('stackMonitor').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.stackData = this.stackAllData.stackAllData;

  }


}
