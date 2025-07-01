import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {MultistateStateEventDetectorModel} from '../../shared/model/multistateStateEventDetectorModel';
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
  selector: 'app-multi-state-event-detector',
  templateUrl: './multi-state-event-detector.component.html',
  styleUrls: []
})
export class MultiStateEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  multiState= {} as MultistateStateEventDetectorModel;
  duration= {} as TimePeriodModel;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    if(this.multiState.duration){
      this.duration = this.multiState.duration;
    }
  }
  setMultiStateToEventDetectorService() {
    this.multiState.detectorType = 'MULTISTATE_STATE_DETECTOR';
    this.multiState.duration = this.duration;
    this.eventDetectorService.setMultistateState(this.multiState);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.multiState.name + " " + this.deleteSuccessMsg);
    })
  }
}
