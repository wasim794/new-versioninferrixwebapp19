import {Component, Input} from '@angular/core';
import {DataPointModel} from '../../../../model';
import {TimePeriodModel} from '../../../../../core/models/timePeriod';
import {commonHelp} from '../../../../../help/commonHelp';
import {HelpModalComponent} from '../../../../../help/help-modal/help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {DictionaryService} from "../../../../../core/services";
import {
  newIntervalLoggingType,
  newLogingType,
  newPollingPeriodType
} from "../../../../../common";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';

class Item {
  key!: string;
  val!: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  selector: 'app-logging-properties',
  templateUrl: './logging-properties.component.html',
  styleUrls: []
})
export class LoggingPropertiesComponent {
  info = new commonHelp();
  logingType =newLogingType;
  pollingPeriodType = newPollingPeriodType;
  intervalLoggingType = newIntervalLoggingType;
  @Input() dataPoint!: DataPointModel;
  interval = false;
  title = 'Point value logging';
  UIDICTIONARY : any;

  constructor(private dialog: MatDialog, public dictionaryService: DictionaryService) {
  }

  changeType(text: any) {
    if (text === 'INTERVAL') {
      if (!this.dataPoint.loggingPropertiesModel['intervalLoggingPeriod']) {
        this.dataPoint.loggingPropertiesModel.intervalLoggingPeriod = new TimePeriodModel();
      }
      this.interval = true;
      return;
    }
    this.interval = false;
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  pointValueLoggingInfo() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'Point Valuer Logging Help', content: this.info.HtmlPointValueLoggingHelp},
      disableClose: true
    });
  }

}
