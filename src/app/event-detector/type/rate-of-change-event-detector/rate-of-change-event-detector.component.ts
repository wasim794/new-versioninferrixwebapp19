import {Component, OnInit} from '@angular/core';
import {RateOfChangeEventDetectorModel} from '../../shared/model/rateOfChangeEventDetectorModel';
import {EventDetectorService} from '../../shared/service/event-detector.service';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {CommonService} from '../../../services/common.service';
import { DictionaryService } from "../../../core/services/dictionary.service";
import {TIME_PERIOD_TYPES, Alarm_level, comparisonModeType, calculationModeType} from "../../../common/static-data/static-data";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports : [CommonModule, MatModuleModule],
  providers: [CommonService, DictionaryService, EventDetectorService],
  selector: 'app-rate-of-change-event-detector',
  templateUrl: './rate-of-change-event-detector.component.html',
  styleUrls: []
})
export class RateOfChangeEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  rateOfChangeThresholdPeriodType =TIME_PERIOD_TYPES;
  calculationMode=calculationModeType;
  comparisonMode=comparisonModeType;
  timePeriodTypes = TIME_PERIOD_TYPES;
  componentRef: any;
  rateOfChange = {} as RateOfChangeEventDetectorModel;
  rateOfChangePeriod= {} as TimePeriodModel;
  duration= {} as TimePeriodModel;
  isUseResetThreshold!: boolean;
  isUseAbsoluteValue!: boolean;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService, public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    if(this.rateOfChange.rateOfChangePeriod){
      this.rateOfChangePeriod = this.rateOfChange.rateOfChangePeriod;
    }
    if(this.rateOfChange.duration) {
      this.duration = this.rateOfChange.duration;
    }
    this.isUseResetThreshold = this.rateOfChange.useResetThreshold;
    this.isUseAbsoluteValue = this.rateOfChange.useAbsoluteValue;
  }

  setRateOfChangeToEventDetectorService() {
    this.rateOfChange.detectorType = 'RATE_OF_CHANGE_DETECTOR';
    this.rateOfChange.rateOfChangePeriod = this.rateOfChangePeriod;
    this.rateOfChange.useResetThreshold =  this.isUseResetThreshold;
    this.rateOfChange.useAbsoluteValue = this.isUseAbsoluteValue;
    this.rateOfChange.duration = this.duration;
    this.eventDetectorService.setRateOfChange(this.rateOfChange);
  }

  useResetThreshold(event: any) {
    this.isUseResetThreshold = event.checked;
  }

  useAbsoluteValue(event: any) {
    this.isUseAbsoluteValue = event.checked;
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.rateOfChange.name + " " + this.deleteSuccessMsg);
    })
  }
}
