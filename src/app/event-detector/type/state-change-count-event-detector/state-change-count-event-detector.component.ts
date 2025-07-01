import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {StateChangeCountEventDetectorModel} from '../../shared/model/stateChangeCountEventDetectorModel';
import {EventDetectorService} from '../../shared/service/event-detector.service';
import {CommonService} from '../../../services/common.service';
import { DictionaryService } from "../../../core/services/dictionary.service";
import {TIME_PERIOD_TYPES, Alarm_level, comparisonModeType, calculationModeType} from "../../../common/static-data/static-data";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports : [CommonModule, MatModuleModule],
  providers: [CommonService, DictionaryService, EventDetectorService],
  selector: 'app-state-change-count-event-detector',
  templateUrl: './state-change-count-event-detector.component.html',
  styleUrls: []
})
export class StateChangeCountEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes  = TIME_PERIOD_TYPES;
  stateChangeCount= {} as StateChangeCountEventDetectorModel;
  duration= {} as TimePeriodModel;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService, public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    if(this.stateChangeCount.duration){
      this.duration = this.stateChangeCount.duration;
    }
  }

  setStateChangeCountToEventDetectorService() {
    this.stateChangeCount.detectorType = 'STATE_CHANGE_COUNT_DETECTOR';
    this.stateChangeCount.duration = this.duration;
    this.eventDetectorService.setStateChangeCount(this.stateChangeCount);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.stateChangeCount.name + " " + this.deleteSuccessMsg);
    })
  }
}
