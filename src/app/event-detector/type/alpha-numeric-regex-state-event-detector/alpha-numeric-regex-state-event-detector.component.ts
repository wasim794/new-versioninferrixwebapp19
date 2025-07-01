import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {AlphanumericRegexStateEventDetectorModel} from '../../shared/model/alphanumericRegexStateEventDetectorModel';
import {EventDetectorService} from '../../shared/service/event-detector.service';
import {CommonService} from '../../../services/common.service';
import { DictionaryService } from "../../../core/services/dictionary.service";
import {TIME_PERIOD_TYPES, Alarm_level} from "../../../common/static-data/static-data";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports : [CommonModule, MatModuleModule],
  providers: [CommonService, DictionaryService, EventDetectorService],
  selector: 'app-alpha-numeric-regex-state-event-detector',
  templateUrl: './alpha-numeric-regex-state-event-detector.component.html',
  styleUrls: []
})
export class AlphaNumericRegexStateEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes =TIME_PERIOD_TYPES;
  alphaNumericRegexState = {} as AlphanumericRegexStateEventDetectorModel;
  duration = {} as TimePeriodModel;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = 'deleted successfully!';
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventHandler').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    if (this.alphaNumericRegexState.duration != null) {
      this.duration = this.alphaNumericRegexState.duration;
    }
  }

  setAlphaNumericRegexStateToEventDetectorService() {
    this.alphaNumericRegexState.detectorType = 'ALPHANUMERIC_REGEX_STATE_DETECTOR';
    this.alphaNumericRegexState.duration = this.duration;
    this.eventDetectorService.setAlphaNumericRegexState(this.alphaNumericRegexState);
  }
  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.alphaNumericRegexState.name + " " + this.deleteSuccessMsg);
    })
  }

}
