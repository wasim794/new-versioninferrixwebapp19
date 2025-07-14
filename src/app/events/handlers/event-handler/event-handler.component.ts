import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EventHandlerService} from '../../../core/services';
import {MatSidenav} from '@angular/material/sidenav';
import {EventHandlerEditComponent} from './event-handler-edit/event-handler-edit.component';
import {TypesModel} from '../../../core/models/utils';
import {AbstractEventHandlerModel} from '../../../core/models/events/handlers';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-event-handler',
  templateUrl: './event-handler.component.html'
})
export class EventHandlerComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  handlerTypes: TypesModel[];
  handlers: AbstractEventHandlerModel<any> [];
  selectedHandlerType: any;
  limit = 12;
  offset = 0;
  pageSizeOptions: number[] = [12, 16, 20];
  enableMessage = 'Enable Successfully';
  disableMessage= 'Disable Successfully';
  UIDICTIONARY : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('eventHandlerSideNav') public eventHandlerSideNav: MatSidenav;
  @ViewChild(EventHandlerEditComponent) private eventHandlerEditComponent: EventHandlerEditComponent;
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry: ViewContainerRef;
  private componentRef: any;

  constructor(
    public eventHandlerService: EventHandlerService,
    public dialog: MatDialog, private _commonService: CommonService, public dictionaryService: DictionaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.handlerTypes = [];
    this.eventHandlerService.getTypes().subscribe((types) => {
      this.handlerTypes = types;
    });
    this.getEventsHandlers();
  }

  getEventsHandlers() {
    this.handlers = [];
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.eventHandlerService.get(param).subscribe((handlers) => {
      this.handlers = handlers;
    });
  }

  addEventHandler(event) {
    if (event.source.selected) {
      this.selectedHandlerType = event.source.value;
      this.eventHandlerSideNav.toggle();
      this.eventHandlerEditComponent.eventHandlerAddInit(this.selectedHandlerType);
    }
  }

  eventHandlerClose(event) {
    if (event === 'dlt') {
      this.eventHandlerSideNav.close();
    } else {
      this.getEventsHandlers();
      this.eventHandlerSideNav.close();
    }
  }

  editHandler(handler: AbstractEventHandlerModel<any>) {
    this.eventHandlerSideNav.open();
    this.eventHandlerEditComponent.eventHandlerEditInit(handler);
  }

  deleteHandler(handler: AbstractEventHandlerModel<any>) {
    this._commonService.openConfirmDialog('Are you want to delete', handler.name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.eventHandlerService.delete(handler.xid).subscribe(eventHandler => {
          if (eventHandler) {
            this.handlers = this.handlers.filter(h => h !== handler);
          }
        }));
      }
    });
  }

  getNext(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.eventHandlerService.get(param).subscribe((handlers) => {
      this.handlers = handlers;
    });
  }

  eventHandlerStatus(event, handler: AbstractEventHandlerModel<any>) {
    const indexValue = this.handlers.indexOf(handler);
    handler.disabled = !event.checked;
    this.eventHandlerService.update(handler).subscribe((eventHandler) => {
      this.handlers[indexValue].disabled ===true?this._commonService.notification(this.disableMessage)
        :this._commonService.notification(this.enableMessage)
    });
  }
}
