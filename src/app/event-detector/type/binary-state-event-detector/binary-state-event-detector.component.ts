import {Component, OnInit} from '@angular/core';
import {BinaryStateEventDetectorModel} from '../../shared/model/binaryStateEventDetectorModel';
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
  selector: 'app-binary-state-event-detector',
  templateUrl: './binary-state-event-detector.component.html',
  styleUrls: []
})
export class BinaryStateEventDetectorComponent implements OnInit {
  alarmTypes = Alarm_level;
  timePeriodTypes = TIME_PERIOD_TYPES;
  binaryState= {} as BinaryStateEventDetectorModel;
  duration= {} as TimePeriodModel;
  isState!: boolean;
  componentRef: any;
  eventDetectorXid!: string;
  deleteSuccessMsg = "deleted successfully!";
  UIDICTIONARY : any;

  constructor(private eventDetectorService: EventDetectorService,public dictionaryService: DictionaryService,  private commonService: CommonService) { }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    if(this.binaryState.duration){
      this.duration = this.binaryState.duration;
    }
  }

  enableState(event: { checked: boolean; }) {
    this.isState = event.checked;
  }

  setBinaryToEventDetectorService() {
    this.binaryState.detectorType = 'BINARY_STATE_DETECTOR';
    this.binaryState.state = this.isState;
    this.binaryState.duration = this.duration;
   this.eventDetectorService.setBinaryState(this.binaryState);
  }

  removeComponent() {
    this.eventDetectorService.deleteEventDetector(this.eventDetectorXid).subscribe(data=>{
      this.componentRef.destroy();
      this.commonService.notification(this.binaryState.name + " " + this.deleteSuccessMsg);
    })
  }
}
