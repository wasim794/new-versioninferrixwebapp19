import {Component, OnInit} from '@angular/core';
import {AnalogRangeEventDetectorModel} from '../../shared/model/analogRangeEventDetectorModel';
import {TimePeriodModel} from '../../../core/models/timePeriod';
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
  selector: 'app-analog-range-event-detector',
  templateUrl: './analog-range-event-detector.component.html',
  styleUrls: []
})
export class AnalogRangeEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  analogRange= {} as AnalogRangeEventDetectorModel;
  duration= {} as TimePeriodModel;
  componentRef: any;
  withinRange!: boolean;
  eventDetectorXid!: string;
  deleteSuccessMsg = 'deleted successfully!';
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
    if (this.analogRange.duration || this.analogRange.withinRange ){
      this.duration = this.analogRange.duration;
      this.withinRange = this.analogRange.withinRange;
    }
  }

  setAnalogRangeToEventDetectorService() {
    this.analogRange.detectorType = 'ANALOG_RANGE_DETECTOR';
    this.analogRange.withinRange = this.withinRange;
    this.analogRange.duration = this.duration;
    this.eventDetectorService.setAnalogRange(this.analogRange);
  }

  enableWithinRange(event: any) {
    this.withinRange = event.checked;
  }
  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.analogRange.name + " " + this.deleteSuccessMsg);
    })
  }
}
