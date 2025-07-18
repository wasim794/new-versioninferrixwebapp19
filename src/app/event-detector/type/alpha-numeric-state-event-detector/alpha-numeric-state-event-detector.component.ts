import {Component, OnInit} from '@angular/core';
import {AlphanumericStateEventDetectorModel} from '../../shared/model/alphanumericStateEventDetectorModel';
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
  selector: 'app-alpha-numeric-state-event-detector',
  templateUrl: './alpha-numeric-state-event-detector.component.html',
  styleUrls: []
})
export class AlphaNumericStateEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  alphaNumericState = {} as AlphanumericStateEventDetectorModel;
  duration = {} as TimePeriodModel;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = 'deleted successfully!';
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService, public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('eventHandler').subscribe(data=>{
           this.UIDICTIONARY = this.dictionaryService.uiDictionary;
          });
    if(this.alphaNumericState.duration){
      this.duration = this.alphaNumericState.duration;
    }
  }

  setAlphaNumericStateToEventDetectorService() {
    this.alphaNumericState.detectorType = 'ALPHANUMERIC_STATE_DETECTOR';
    this.alphaNumericState.duration = this.duration;
    this.eventDetectorService.setAlphaNumericState(this.alphaNumericState);
  }
  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.alphaNumericState.name + " " + this.deleteSuccessMsg);
    })
  }
}
