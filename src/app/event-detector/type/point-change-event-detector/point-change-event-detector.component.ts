import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {PointChangeEventDetectorModel} from '../../shared/model/pointChangeEventDetectorModel';
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
  selector: 'app-point-change-event-detector',
  templateUrl: './point-change-event-detector.component.html',
  styleUrls: []
})
export class PointChangeEventDetectorComponent implements OnInit {
  componentRef: any;
  alarmTypes = Alarm_level;
  pointChange= {} as PointChangeEventDetectorModel;
  duration= {} as TimePeriodModel;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  setPointChangeToEventDetectorService() {
    this.pointChange.detectorType = 'POINT_CHANGE_DETECTOR';
    this.eventDetectorService.setPointChange(this.pointChange);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.pointChange.name + " " + this.deleteSuccessMsg);
    })
  }
}
