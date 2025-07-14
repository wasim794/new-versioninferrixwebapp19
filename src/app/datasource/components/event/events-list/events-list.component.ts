import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../../services/configuration.service';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SearchEventComponent} from '../search-event/search-event.component';
import {EventInstanceModel} from '../../core/models/events';
import {EventsService} from '../../core/services';
import {DictionaryService} from "../../core/services/dictionary.service";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: []
})
export class EventsListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  eventModels: EventInstanceModel[];
  errorMsg: string;
  audio: any;
  isPlaying: boolean;
  UIDICTIONARY : any;
  eventLength:any;
  message = {
    'eventTypes': ['ACKNOWLEDGED', 'RAISED', 'RETURN_TO_NORMAL', 'DEACTIVATED'],
    'levels': [0, 1, 2, 3, 4, 5]
  };

  eventsTableColumns: string[] = [
    'Id',
    'Event Type',
    'Message',
    'Alarm Level',
    'Active Time',
    'Rtn Time',
    'Action'
  ];
  limit = 12;
  offset = 0;
  pageSizeOptions: number[] = [12, 16, 20];


  constructor(
    public dictionaryService: DictionaryService,
    public _service: EventsService,
    private _configurationService: ConfigurationService,
    private router: Router,
    private dialog: MatDialog,
    private commonService:CommonService
  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('event').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(-id))';
    this.getEvents(param);
  }

  search() {
    this.dialog.open(SearchEventComponent, {
      minWidth: '600px',
      disableClose: true
    });
  }

  dataPointDetails(xId) {
    localStorage.setItem('dpXid', xId);
    this.router.navigate(['/datapoint/detail']);
  }

  setSound(event: any) {
    this.isPlaying = true;
    this.audio = new Audio();
    if (event.alarmLevel === 'EMERGENCY') {
      this.audio.src = '../../../assets/libs/audio/emergency.mp3';
    } else if (event.alarmLevel === 'CRITICAL') {
      this.audio.src = '../../../assets/libs/audio/critical.mp3';
    } else if (event.alarmLevel === 'URGENT') {
      this.audio.src = '../../../assets/libs/audio/urgent.mp3';
    } else if (event.alarmLevel === 'WARNING') {
      this.audio.src = '../../../assets/libs/audio/warning.mp3';
    } else if (event.alarmLevel === 'INFORMATION') {
      this.audio.src = '../../../assets/libs/audio/warning.mp3';
    } else {
      this.audio.src = '';
    }
    this.audio.loop = true;
    this.audio.load();
    this.audio.play();
  }

  toggleSilence() {
    if (this.isPlaying) {
      this.audio.pause();
      (<any>$('#silenceImg')).addClass('red').removeClass('green');
      this.isPlaying = false;
    } else {
      this.audio.play();
      (<any>$('#silenceImg')).addClass('green').removeClass('red');
      this.isPlaying = true;
    }
  }

  getEvents(params: string) {
    this.subs.add(this._service.query(params).subscribe(events => {
      if (events) {
        this.commonService.hideloader();
      }
      this.eventModels = events;
      this.eventLength =  this.eventModels.length;
      localStorage.setItem("eventLength", this.eventLength);
    }, err => this.errorMsg = err));
  }

  ackEvent(eventList) {
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(-id))';
    if (eventList === 'all') {
      this.eventModels.forEach(event => {
        this.subs.add(this._service.acknowledgeById(event.id).subscribe());
        this.getEvents(param);
      });
    } else {
      this.subs.add(this._service.acknowledgeById(eventList.id).subscribe());
      this.getEvents(param);
    }
  }

  getEventsNextPage(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(-id))';
    this.getEvents(param);
  }


  /** The label for the checkbox on the passed row */


}
