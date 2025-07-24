import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DataPointService, EventHandlerService} from '../../../../core/services';
import {BasicSummaryModel} from '../../../../core/models';
import {CommonService} from '../../../../services/common.service';
import {AbstractEventTypesModel, EventTypeMatcherModel} from "../../../../core/models/events";
import {
  AbstractEventHandlerModel,
  ProcessEventHandlerModel
} from '../../../../core/models/events/handlers';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {
  BasicFormComponent,
  EventTypeTreeViewComponent,
  OnAddInit,
  OnEditInit,
  OnEventHandlerSave,
  OnEventHandlerUpdate
} from '../../common';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule, BasicFormComponent, EventTypeTreeViewComponent ],
  providers: [ CommonService, DictionaryService , DataPointService, EventHandlerService],
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: []
})
export class ProcessComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnAddInit, OnEditInit,
  OnEventHandlerSave, OnEventHandlerUpdate {
  @ViewChild(BasicFormComponent) private basicForm!: BasicFormComponent;
  @ViewChild(EventTypeTreeViewComponent) private eventTypeTree!: EventTypeTreeViewComponent;
  @Output() eventHandlerClose = new EventEmitter<any>();
  isSaveSuccessful!: boolean;
  isUpdateSuccessful!: boolean;
  isEdit!: boolean;
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated sucessfully';
  public processEvent = new ProcessEventHandlerModel;
  UIDICTIONARY : any;

  constructor(
    private _handlerService: EventHandlerService,
    private _dataPointService: DataPointService,
    private commonService: CommonService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  eventHandlerUpdate(): void {
    this.processEvent.eventTypes = this.eventTypeTree.dataSource.selectedEventTypes.selected.map((eventType: any) =>
      eventType.toEventTypeMatcherModel());
    this.processEvent.name = this.basicForm.handlerModel.name;
    this._handlerService.update(this.processEvent).subscribe((model) => {
      this.processEvent = model as ProcessEventHandlerModel;
      this.commonService.notification('event Handler ' + this.processEvent.name + ' ' + this.updateSuccessMsg);
      this.eventHandlerClose.emit(this.processEvent);
    }, error => {
      this.timeInterval();
    });
  }

  eventHandlerSave(): void {
    this.processEvent.eventTypes = this.eventTypeTree.dataSource.selectedEventTypes.selected.map((eventType: any) =>
      eventType.toEventTypeMatcherModel());
    this.processEvent.name = this.basicForm.handlerModel.name;
    this._handlerService.create(this.processEvent).subscribe((model) => {
      this.processEvent = model as ProcessEventHandlerModel;
      this.commonService.notification('event Handler ' + this.processEvent.name + ' ' + this.saveSuccessMsg);
      this.eventHandlerClose.emit(this.processEvent);
    }, error => {
      this.timeInterval();
    });
  }

  eventHandlerAddInit(type: string): void {
    this.processEvent = new ProcessEventHandlerModel();
    this.isEdit = false;
  }

  eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): void {
    const tempModel = new ProcessEventHandlerModel(handler);
    this.processEvent = tempModel;
    this.isEdit = true;
  }

  timeInterval() {
    let timerId = setInterval(() =>
      this.isSaveSuccessful = true, 1000);
    setTimeout(() => {
      clearInterval(timerId);
      this.isSaveSuccessful = false;
    }, 5000);
  }


}
