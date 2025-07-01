import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {NoUpdateEventDetectorModel} from '../../shared/model/noUpdateEventDetectorModel';
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
  selector: 'app-no-update-event-detector',
  templateUrl: './no-update-event-detector.component.html',
  styleUrls: []
})
export class NoUpdateEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes =TIME_PERIOD_TYPES;
  noUpdate= {} as NoUpdateEventDetectorModel;
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
    if(this.noUpdate.duration){
      this.duration = this.noUpdate.duration;
    }
  }

  setNoUpdateToEventDetectorService() {
    this.noUpdate.detectorType = 'NO_UPDATE_DETECTOR';
    this.noUpdate.duration = this.duration;
    this.eventDetectorService.setNoUpdate(this.noUpdate);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.noUpdate.name + " " + this.deleteSuccessMsg);
    })
  }

}
