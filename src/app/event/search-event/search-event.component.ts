import {Component} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {EventService} from '../service/event.service';
import {EventInstanceModel} from '../model/eventInstanceModel';
import {Router} from '@angular/router';
import {DictionaryService} from "../../core/services/dictionary.service";
import {EVENT_SOURCE_TYPES , EVENT_ALARM_LEVEL , EVENT_STATUS , EVENT_TABLE_COLUMNS} from "../../common/static-data/static-data";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService, EventService],
  selector: 'app-search-event',
  templateUrl: './search-event.component.html',
  styleUrls: []
})
export class SearchEventComponent extends UnsubscribeOnDestroyAdapter {
  alarmLevelSelected: any = 'All';
  eventSourceTypesSelected: any = 'All';
  selected: any = 'All';
  id!: number;
  epochDateFrom!: number;
  epochDateTo!: number;
  status!: string;
  alarmLevel!: number;
  eventSourceType!: number;
  searchEvents!: EventInstanceModel[];
  public eventSourceTypes = EVENT_SOURCE_TYPES;
  public eventAlarmLevel = EVENT_ALARM_LEVEL;
  public eventStatus = EVENT_STATUS;
  public eventsTableColumns = EVENT_TABLE_COLUMNS;
  UIDICTIONARY : any;

  constructor(private eventService: EventService, private router: Router ,public dictionaryService: DictionaryService,) {
    super();
  }

  ackSearchEvent(searchEvent: any) {
    this.searchEvents = this.searchEvents.filter(h => h !== searchEvent);
    this.subs.add(this.eventService.ackEvent(searchEvent.id).subscribe());
  }

  dataPointDetails(xId: any) {
    localStorage.setItem('dpXid', xId);
    this.router.navigate(['/datapoint/detail']);
  }
  ngOnInit() {
    this.dictionaryService.getUIDictionary('event').subscribe(data=>{
          this.UIDICTIONARY = this.dictionaryService.uiDictionary;
          });
  }
  searchEvent(eventId: any, dateFrom: any, dateTo: any) {
    this.id = eventId;
    this.epochDateFrom = new Date(dateFrom).getTime();
    this.epochDateTo = new Date(dateTo).getTime();
    if (this.id === undefined) {
      this.id = 0;
    }
    if (this.selected === 'All') {
      this.status = '*';
    } else if (this.selected === 'Active') {
      this.status = 'A';
    } else if (this.selected === 'Returned to Normal') {
      this.status = 'R';
    } else if (this.selected === 'NO RTN') {
      this.status = 'N';
    }
    if (this.alarmLevelSelected === 'All') {
      this.alarmLevel = -1;
    } else if (this.alarmLevelSelected === 'None') {
      this.alarmLevel = 0;
    } else if (this.alarmLevelSelected === 'Information') {
      this.alarmLevel = 1;
    } else if (this.alarmLevelSelected === 'Warning') {
      this.alarmLevel = 2;
    } else if (this.alarmLevelSelected === 'Urgent') {
      this.alarmLevel = 3;
    } else if (this.alarmLevelSelected === 'Critical') {
      this.alarmLevel = 4;
    } else if (this.alarmLevelSelected === 'Emergency') {
      this.alarmLevel = 5;
    }
    if (this.eventSourceTypesSelected === 'All') {
      this.eventSourceType = -1;
    } else if (this.eventSourceTypesSelected === 'Point event detectors') {
      this.eventSourceType = 1;
    } else if (this.eventSourceTypesSelected === 'Scheduled events') {
      this.eventSourceType = 6;
    } else if (this.eventSourceTypesSelected === 'Compound event detectors') {
      this.eventSourceType = 5;
    } else if (this.eventSourceTypesSelected === 'Data source events') {
      this.eventSourceType = 3;
    } else if (this.eventSourceTypesSelected === 'Publisher events') {
      this.eventSourceType = 7;
    } else if (this.eventSourceTypesSelected === 'Maintenance events') {
      this.eventSourceType = 9;
    } else if (this.eventSourceTypesSelected === 'System events') {
      this.eventSourceType = 4;
    } else if (this.eventSourceTypesSelected === 'Audit events') {
      this.eventSourceType = 8;
    }
    if (isNaN(this.epochDateFrom)) {
      this.epochDateFrom = -1;
    }
    if (isNaN(this.epochDateTo)) {
      this.epochDateTo = -1;
    }
    // tslint:disable-next-line:max-line-length
    this.subs.add(this.eventService.searchEvent(this.id, this.status, this.alarmLevel, this.eventSourceType, this.epochDateFrom, this.epochDateTo).subscribe(data => {
      this.searchEvents = data;

    }));
  }

}
