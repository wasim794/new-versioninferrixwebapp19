import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {PositiveCusumEventDetectorModel} from '../../shared/model/positiveCusumEventDetectorModel';
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
  selector: 'app-positive-cusum-event-detector',
  templateUrl: './positive-cusum-event-detector.component.html',
  styleUrls: []
})
export class PositiveCusumEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  positiveCusum= {} as PositiveCusumEventDetectorModel;
  duration= {} as TimePeriodModel;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,
  public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    if(this.positiveCusum.duration){
      this.duration = this.positiveCusum.duration;
    }
  }

  setPositiveCusumToEventDetectorService() {
    this.positiveCusum.detectorType = 'POSITIVE_CUSUM_DETECTOR';
    this.positiveCusum.duration = this.duration;
    this.eventDetectorService.setPositiveCusum(this.positiveCusum);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.positiveCusum.name + " " + this.deleteSuccessMsg);
    })
  }
}
