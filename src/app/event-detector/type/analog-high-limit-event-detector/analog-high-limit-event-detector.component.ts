import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {AnalogHighLimitEventDetectorModel} from '../../shared/model/analogHighLimitEventDetectorModel';
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
  selector: 'app-analog-high-limit-event-detector',
  templateUrl: './analog-high-limit-event-detector.component.html',
  styleUrls: []
})
export class AnalogHighLimitEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  analogHighLimit = {} as AnalogHighLimitEventDetectorModel;
  duration = {} as TimePeriodModel;
  componentRef: any;
  useResetLimit!: boolean;
  notHigher!: boolean;
  eventDetectorXid!: string;
  deleteSuccessMsg = 'deleted successfully!';
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService, public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
    if (this.analogHighLimit.duration || this.analogHighLimit.useResetLimit || this.analogHighLimit.notHigher){

      this.duration = this.analogHighLimit.duration;
      this.useResetLimit = this.analogHighLimit.useResetLimit;
      this.notHigher = this.analogHighLimit.notHigher;
    }
  }

  enableUseResetLimit(event: any) {
    this.useResetLimit = event.checked;
  }

  enableNotHigher(event: any) {
    this.notHigher = event.checked;
  }
  setAnalogHighLimitToEventDetectorService() {
    this.analogHighLimit.detectorType = 'ANALOG_HIGH_LIMIT_DETECTOR';
    this.analogHighLimit.notHigher = this.notHigher;
    this.analogHighLimit.useResetLimit = this.useResetLimit;
    this.analogHighLimit.duration = this.duration;
    this.eventDetectorService.setAnalogHighLimit(this.analogHighLimit);
  }
  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.analogHighLimit.name + " " + this.deleteSuccessMsg);
    })
  }

}
