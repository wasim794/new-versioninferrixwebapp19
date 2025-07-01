import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {AnalogLowLimitEventDetectorModel} from '../../shared/model/analogLowLimitEventDetectorModel';
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
  selector: 'app-analog-low-limit-event-detector',
  templateUrl: './analog-low-limit-event-detector.component.html',
  styleUrls: []
})
export class AnalogLowLimitEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  analogLowLimit= {} as AnalogLowLimitEventDetectorModel;
  duration= {} as TimePeriodModel;
  componentRef: any;
  useResetLimit!: boolean;
  notLower!: boolean;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService, private commonService: CommonService, public dictionaryService: DictionaryService) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    if(this.analogLowLimit.duration || this.analogLowLimit.useResetLimit || this.analogLowLimit.notLower){
      this.duration = this.analogLowLimit.duration;
      this.useResetLimit = this.analogLowLimit.useResetLimit;
      this.notLower = this.analogLowLimit.notLower;
    }
  }
  enableUseResetLimit(event: { checked: boolean; }) {
    this.useResetLimit = event.checked;
  }

  enableNotLower(event: any) {
    this.notLower = event.checked;
  }

  setAnalogLowLimitToEventDetectorService() {
    this.analogLowLimit.detectorType = 'ANALOG_LOW_LIMIT_DETECTOR';
    this.analogLowLimit.useResetLimit = this.useResetLimit;
    this.analogLowLimit.notLower = this.notLower;
    this.analogLowLimit.duration = this.duration;
    this.eventDetectorService.setAnalogLowLimit(this.analogLowLimit);
  }
  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.analogLowLimit.name + " " + this.deleteSuccessMsg);
    })
  }
}
