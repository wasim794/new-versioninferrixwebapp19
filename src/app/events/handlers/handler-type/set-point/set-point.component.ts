import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {DataPointService, EventHandlerService} from '../../../../core/services';
import {BasicSummaryModel} from '../../../../core/models';
import {CommonService} from '../../../../services/common.service';
import {
  AbstractEventHandlerModel,
  SetPointEventHandlerModel
} from '../../../../core/models/events/handlers';
import {
  BasicFormComponent,
  EventTypeTreeViewComponent,
  OnAddInit,
  OnEditInit,
  OnEventHandlerSave,
  OnEventHandlerUpdate
} from '../../common';
import {AbstractEventTypesModel, EventTypeMatcherModel} from "../../../../core/models/events";
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';



function toEventTypeMatchModel(eventType: AbstractEventTypesModel<any>): EventTypeMatcherModel {
  const matcherModel = new EventTypeMatcherModel();
  matcherModel.eventType = eventType.eventType;
  matcherModel.subType = eventType.subType;
  matcherModel.referenceId1 = eventType.referenceId1;
  matcherModel.referenceId2 = eventType.referenceId2;
  return matcherModel;
}

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, BasicFormComponent, EventTypeTreeViewComponent],
  providers: [ DictionaryService, CommonService, DataPointService, EventHandlerService ],
  selector: 'app-set-point',
  templateUrl: './set-point.component.html',
  styleUrls: []
})
export class SetPointComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnAddInit, OnEditInit,
  OnEventHandlerSave, OnEventHandlerUpdate {
  @ViewChild(BasicFormComponent) private basicForm!: BasicFormComponent;
  @ViewChild(EventTypeTreeViewComponent) private eventTypeTree!: EventTypeTreeViewComponent;
  @Output() eventHandlerClose = new EventEmitter<any>();
  targetDataPoints!: BasicSummaryModel[];
  dataPoints!: BasicSummaryModel[];
  public setPointModel!: SetPointEventHandlerModel;
  activeAction = [
    {name: 'None', val: 'NONE'},
    {name: 'Set to point value', val: 'POINT_VALUE'},
    {name: 'Set to static value', val: 'STATIC_VALUE'}
  ];
  isActiveAction!: boolean;
  isInActiveAction!: boolean;
  activeActionSelectedValue: any;
  inactiveActionSelectedValue: any;
  isSaveSuccessful!: boolean;
  isUpdateSuccessful!: boolean;
  isEdit!: boolean;
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated successfully';
  UIDICTIONARY : any;
  limit = 50;
  offset = 0;
  isLoading = false;
  selectedDataPoint!: string;
  searchTerm = '';

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
    this.targetDataPoints = [];
    this.dataPoints = [];
    const param = 'and(settable=true,enabled=true)';
    this._dataPointService.get(param).subscribe((dataPoints) =>
      dataPoints.map((dataPoint: any) => this.targetDataPoints.push(new BasicSummaryModel(dataPoint.extendedName, dataPoint.xid))));
    const params = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPointsAll(params);
  }

  onDropdownOpen(): void {
    if (this.dataPoints.length === 0) {
      this.loadMore(); // Initial load
    }
  }

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    const scrollHeight = (event.target as HTMLElement).scrollHeight;
    const offsetHeight = (event.target as HTMLElement).offsetHeight;

    const atBottom = scrollTop + offsetHeight >= scrollHeight - 20;
    if (atBottom && !this.isLoading) {
      this.loadMore();
    }
  }

  loadMore(): void {
    this.isLoading = true;
    const params = `limit(${this.limit},${this.offset})`;
    this.getDataPointsAll(params);
    this.offset += this.limit;
  }

  getDataPointsAll(params: string): void {
    this._dataPointService.get(params).subscribe((dataPoints) => {
      dataPoints.forEach((dp: any) => {
        this.dataPoints.push(new BasicSummaryModel(dp.extendedName, dp.xid));
      });
      this.isLoading = false;
    });
  }

  dropdownChange(action: string, inactive: boolean) {
    if (action === 'POINT_VALUE') {
      if (!inactive) {
        this.isActiveAction = true;
        this.activeActionSelectedValue = false;
      } else {
        this.isInActiveAction = true;
        this.inactiveActionSelectedValue = false;
      }
    } else if (action === 'STATIC_VALUE') {
      if (!inactive) {
        this.activeActionSelectedValue = true;
        this.isActiveAction = false;
      } else {
        this.inactiveActionSelectedValue = true;
        this.isInActiveAction = false;
      }
    } else {
      if (!inactive) {
        this.isActiveAction = false;
        this.activeActionSelectedValue = false;
      } else {
        this.isInActiveAction = false;
        this.inactiveActionSelectedValue = false;
      }
    }
  }

  eventHandlerUpdate(): void {
        this.setPointModel.eventTypes = this.eventTypeTree.dataSource.selectedEventTypes.selected.map((eventType: any) =>
          toEventTypeMatchModel(eventType))

      this.setPointModel.name = this.basicForm.handlerModel.name;
      this._handlerService.update(this.setPointModel).subscribe((model) => {
        this.setPointModel = model as SetPointEventHandlerModel;
        this.commonService.notification('event Handler ' + this.setPointModel.name + ' ' + this.updateSuccessMsg);
        this.eventHandlerClose.emit(this.setPointModel);
      }, error => {
        this.timeInterval();
      });
    }



  eventHandlerSave(): void {
    this.setPointModel.eventTypes = this.eventTypeTree.dataSource.selectedEventTypes.selected.map((eventType: any) =>
      toEventTypeMatchModel(eventType));
    this.setPointModel.name = this.basicForm.handlerModel.name;
    this._handlerService.create(this.setPointModel).subscribe((model) => {
      this.setPointModel = model as SetPointEventHandlerModel;
      this.commonService.notification('event Handler ' + this.setPointModel.name + ' ' + this.saveSuccessMsg);
      this.eventHandlerClose.emit(this.setPointModel);
    }, error => {
      this.timeInterval();
    });
  }

  eventHandlerAddInit(type: string): void {
    this.setPointModel = new SetPointEventHandlerModel();
    this.setPointModel.targetPointXid = '';
    this.setPointModel.activeAction = this.activeAction[0].val;
    this.setPointModel.inactiveAction = this.activeAction[0].val;
    this.isEdit = false;
  }

  eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): void {
    const tempModel = new SetPointEventHandlerModel(handler);
    this.dropdownChange(tempModel.activeAction, false);
    this.dropdownChange(tempModel.inactiveAction, true);
    this.setPointModel = tempModel;
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
