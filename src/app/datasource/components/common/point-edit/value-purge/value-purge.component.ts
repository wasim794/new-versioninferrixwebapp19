import {Component, Input, OnInit} from '@angular/core';
import {DataPointModel} from '../../../../model';
import {commonHelp} from '../../../../../help/commonHelp';
import {HelpModalComponent} from '../../../../../help/help-modal/help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {POLLING_PERIOD_TYPE} from '../../../../../common';
import {DictionaryService} from "../../../../../core/services";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService],
  selector: 'app-value-purge',
  templateUrl: './value-purge.component.html',
  styleUrls: []
})
export class ValuePurgeComponent {
  @Input() dataPoint!: DataPointModel;
  title = 'Point value log purging';
  info = new commonHelp();
  pollingPeriodType = POLLING_PERIOD_TYPE;
  UIDICTIONARY : any;

  constructor(private dialog: MatDialog, public dictionaryService: DictionaryService) {
  }


  purgeInfo() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'Purge Help', content: this.info.htmlPurgeHelp},
      disableClose: true
    });
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('dataPurge').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });

  }

}
