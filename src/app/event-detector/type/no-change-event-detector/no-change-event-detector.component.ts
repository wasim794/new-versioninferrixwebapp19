import {Component, OnInit} from '@angular/core';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {NoChangeEventDetectorModel} from '../../shared/model/noChangeEventDetectorModel';
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
  selector: 'app-no-change-event-detector',
  templateUrl: './no-change-event-detector.component.html',
  styleUrls: []
})
export class NoChangeEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes =TIME_PERIOD_TYPES;
  noChange= {} as NoChangeEventDetectorModel;
  duration = {} as TimePeriodModel;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,public dictionaryService: DictionaryService, private commonService: CommonService) { }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
        this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    if (this.noChange.duration) {
      this.duration = this.noChange.duration;
    }
  }

  setNoChangeEventDetectorService() {
    this.noChange.detectorType = 'NO_CHANGE_DETECTOR';
    this.noChange.duration = this.duration;
    this.eventDetectorService.setNoChange(this.noChange);
    console.log('No Change Event Detector Service Set:', this.noChange);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.noChange.name + " " + this.deleteSuccessMsg);
    })
  }
}
