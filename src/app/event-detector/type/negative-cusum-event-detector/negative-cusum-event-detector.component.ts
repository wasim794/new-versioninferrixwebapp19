import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {NegativeCusumEventDetectorModel} from '../../shared/model/negativeCusumEventDetectorModel';
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
  selector: 'app-negative-cusum-event-detector',
  templateUrl: './negative-cusum-event-detector.component.html',
  styleUrls: []
})
export class NegativeCusumEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes =TIME_PERIOD_TYPES;
  negativeCusum= {} as NegativeCusumEventDetectorModel;
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
    if(this.negativeCusum.duration){
      this.duration = this.negativeCusum.duration;
    }
  }

  setNegativeCusumToEventDetectorService() {
    this.negativeCusum.detectorType = 'NEGATIVE_CUSUM_DETECTOR';
    this.negativeCusum.duration = this.duration;
    this.eventDetectorService.setNegativeCusum(this.negativeCusum);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.negativeCusum.name + " " + this.deleteSuccessMsg);
    })
  }
}
