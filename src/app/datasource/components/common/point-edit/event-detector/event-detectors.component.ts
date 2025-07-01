import {Component, ComponentFactoryResolver, Inject, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {DataPointModel} from '../../../../model';
import {DictionaryService} from "../../../../../core/services";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  MultiStateEventDetectorComponent,
  NoChangeEventDetectorComponent,
  NoUpdateEventDetectorComponent,
  PointChangeEventDetectorComponent,
  StateChangeCountEventDetectorComponent,
  AnalogHighLimitEventDetectorComponent,
  AnalogLowLimitEventDetectorComponent,
  AnalogRangeEventDetectorComponent,
  NegativeCusumEventDetectorComponent,
  PositiveCusumEventDetectorComponent,
  RateOfChangeEventDetectorComponent,
  AlphaNumericRegexStateEventDetectorComponent,
  AlphaNumericStateEventDetectorComponent,
  BinaryStateEventDetectorComponent,
  EventDetectorModel,
  AbstractEventDetectorModel,
  EventDetectorComponentPropertyModel, EventDetectorService

} from '../../../../../event-detector';

import {CommonService} from '../../../../../services/common.service';
import {ConfigurationService} from '../../../../../services/configuration.service';
import {WebsocketService} from '../../../../../core/services';
import {MatPaginator} from "@angular/material/paginator";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';

export interface DialogData {
  content: DataPointModel;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, MultiStateEventDetectorComponent,
  NoChangeEventDetectorComponent,
  NoUpdateEventDetectorComponent,
  PointChangeEventDetectorComponent,
  StateChangeCountEventDetectorComponent,
  AnalogHighLimitEventDetectorComponent,
  AnalogLowLimitEventDetectorComponent,
  AnalogRangeEventDetectorComponent,
  NegativeCusumEventDetectorComponent,
  PositiveCusumEventDetectorComponent,
  RateOfChangeEventDetectorComponent,
  AlphaNumericRegexStateEventDetectorComponent,
  AlphaNumericStateEventDetectorComponent,
  BinaryStateEventDetectorComponent],
  providers: [EventDetectorService, ConfigurationService, DictionaryService, WebsocketService , CommonService],
  selector: 'app-event-detectors',
  templateUrl: './event-detector.component.html',
  styleUrls: []
})
export class EventDetectorsComponent implements OnInit {
  @Input() dataPoint!: DataPointModel;
  dataType!: string;
  eventDetectorTypes: any = [];
  eventDetectors = [];
  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['select', 'position', 'name', 'alarmLevel', 'action'];
  dataSource: any = new MatTableDataSource<EventDetectorModel>();
  selection = new SelectionModel<string>(true, []);
  componentRef: any;
  dataArray = [];
  selectedOption!: string | null;
  filteredArray: any = [];
  ids = [1, 2];
  eventDetectorsArray: any = [];
  eventTableList: any = [];
  saveSuccessMsg = 'Event detector saved successfully';
  updateSuccessMsg = 'Event detector updated successfully';
  eventDetectorError: any = [];
  token: any;
  websocket_URL = '/temporary-resources?token=';
  eventDetector = {} as EventDetectorModel;
  abstractEventDetector = {} as AbstractEventDetectorModel;
  request: any = [];
  eventDetectorComponentProperty = {} as EventDetectorComponentPropertyModel;
  isEdit!: boolean;
 public showAddButton = false;
 public showUpdateButton = false;
 public showSaveButton = false;
  error: any = [];
  response = [];
  public messageError!: boolean;
  @ViewChild(MatTable) table!: MatTable<any>;
  private requestName: any;
  private form: any;
  savedMsg = "Successfully Saved";
  updateMsg = "Update Successfully";
  deleteMsg = "Successfully Deleted";
  UIDICTIONARY : any;

  constructor(public dictionaryService: DictionaryService, private commonService: CommonService, private resolver: ComponentFactoryResolver, private _configurationService: ConfigurationService,
              private _WebSocketService: WebsocketService, private eventDetectorService: EventDetectorService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.token = JSON.parse(localStorage.getItem('access_token')!);

  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.dataPoint = this.data.content;
    this.dataType = this.dataPoint.pointLocator.dataType;
    this.eventDetectorService.getEventDetectorType(this.dataType).subscribe(data => {
      this.eventDetectorTypes = data['items'];
      this.dataSource.paginator = this.paginator;
    });
    this.getEventDetectorByDataPoint(this.dataPoint.id);
    this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
    this.websocket();
  }

  websocket() {
    const message = {
      'requestType': 'SUBSCRIPTION',
      'anyStatus': true,
      'anyResourceType': false,
      'resourceTypes': [
        'BULK_EVENT_DETECTOR'
      ]
    };

    this._configurationService.connect(message);
    const websocket = this._WebSocketService.subscribeWebsocket();
    websocket.subscribe(async (data) => {
      try {
        const websocketResponse = JSON.parse(data);
        if (websocketResponse.messageType === 'RESPONSE') {

        }
        // await this.async(websocketResponse, websocket);
      } catch (error) {

      }
    });
  }

  async async(websocketResponse: any, websocket: any): Promise<void> {
    if (websocketResponse.messageType === 'NOTIFICATION' && websocketResponse.payload.status === 'SUCCESS') {
    } else if (websocketResponse.messageType === 'CLOSE' || websocketResponse.messageType === 'ERROR') {
      this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
    }
  }

  getEventDetectorByDataPoint(dataPointId: any) {
    this.eventDetectorService.getEventDetectorForDataPointId(dataPointId).subscribe(data => {
      this.eventDetectors = data.items;
      this.dataSource = data.items;
      this.showAddButton = false;
      (this.eventDetectors.length == 0) ?
        this.isEdit = false : this.isEdit = true;
      this.entry.clear();

    });
  }

  eventDetectorInfo() {
    alert('Required to add event-detector help');
  }

  addEventDetector(event: { source: { selected: any; }; }, type: any) {
    this.selectedOption = null;
    if (event.source.selected) {

      this.showAddButton = true;
      this.showSaveButton = true;
      this.showUpdateButton = false;
      this.componentLoaded(type, null);

    }
  }

  store(newValue: any) {
    // this.dataArray.push(newValue);
  }

  componentLoaded(componentType: string, eventDetectorModel: { xid: any; } | null) {
    this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
    this.entry.clear();
    let factory;
    switch (componentType) {

      case 'NO_CHANGE_DETECTOR':

        factory = this.resolver.resolveComponentFactory(NoChangeEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.noChange = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'NO_UPDATE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(NoUpdateEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.noUpdate = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'MULTISTATE_STATE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(MultiStateEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.multiState = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'BINARY_STATE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(BinaryStateEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.binaryState = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'POINT_CHANGE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(PointChangeEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.pointChange = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'STATE_CHANGE_COUNT_DETECTOR':
        factory = this.resolver.resolveComponentFactory(StateChangeCountEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.stateChangeCount = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'ANALOG_HIGH_LIMIT_DETECTOR':
        factory = this.resolver.resolveComponentFactory(AnalogHighLimitEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.analogHighLimit = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'ANALOG_LOW_LIMIT_DETECTOR':
        factory = this.resolver.resolveComponentFactory(AnalogLowLimitEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.analogLowLimit = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'ANALOG_RANGE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(AnalogRangeEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.analogRange = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'NEGATIVE_CUSUM_DETECTOR':
        factory = this.resolver.resolveComponentFactory(NegativeCusumEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.negativeCusum = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'POSITIVE_CUSUM_DETECTOR':
        factory = this.resolver.resolveComponentFactory(PositiveCusumEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.positiveCusum = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'RATE_OF_CHANGE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(RateOfChangeEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.pointChange = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;

        }
        break;
      case 'ALPHANUMERIC_REGEX_STATE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(AlphaNumericRegexStateEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.alphaNumericRegexState = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
        break;
      case 'ALPHANUMERIC_STATE_DETECTOR':
        factory = this.resolver.resolveComponentFactory(AlphaNumericStateEventDetectorComponent);
        this.componentRef = this.entry.createComponent(factory);
        this.eventDetectorComponentProperty = new EventDetectorComponentPropertyModel();
        this.eventDetectorComponentProperty.type = componentType;
        this.eventDetectorComponentProperty.componentObject = this.componentRef;
        this.eventDetectorsArray.push(this.eventDetectorComponentProperty);
        this.componentRef.instance.componentRef = this.componentRef;
        if (eventDetectorModel != null) {
          this.componentRef.instance.alphaNumericState = eventDetectorModel;
          this.componentRef.instance.eventDetectorXid = eventDetectorModel.xid;
        }
    }
    return factory;

  }
  private staticDataWIthJSON() {
    this.eventDetector.id = 'BULK_EVENT_DETECTOR';
    this.eventDetector.action = 'CREATE';
    this.eventDetector.body = null;
    this.eventDetector.expiration = 2000;
    this.eventDetector.timeout = 1000;
  }
//   /** Adding event detector. to table list */
  saveEventDetector() {
    this.eventDetectorsArray.forEach((eventDetectorType: { type: string; componentObject: { instance: { setNoChangeEventDetectorService: () => void; setNoUpdateToEventDetectorService: () => void; setMultiStateToEventDetectorService: () => void; setPointChangeToEventDetectorService: () => void; setBinaryToEventDetectorService: () => void; setStateChangeCountToEventDetectorService: () => void; setAnalogHighLimitToEventDetectorService: () => void; setAnalogLowLimitToEventDetectorService: () => void; setAnalogRangeToEventDetectorService: () => void; setNegativeCusumToEventDetectorService: () => void; setPositiveCusumToEventDetectorService: () => void; setAlphaNumericRegexStateToEventDetectorService: () => void; setAlphaNumericStateToEventDetectorService: () => void; setRateOfChangeToEventDetectorService: () => void; }; }; }) => {

      this.staticDataWIthJSON();
      if (eventDetectorType.type === 'NO_CHANGE_DETECTOR') {
        eventDetectorType.componentObject.instance.setNoChangeEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setNoChangeEventDetectorService();
        this.eventDetectorService.noChangeModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.noChangeModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.noChangeModel.sourceId);
      }
      if (eventDetectorType.type === 'NO_UPDATE_DETECTOR') {
        eventDetectorType.componentObject.instance.setNoUpdateToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setNoUpdateToEventDetectorService();
        this.eventDetectorService.noUpdateModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.noUpdateModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.noUpdateModel.sourceId);
      }
      if (eventDetectorType.type === 'MULTISTATE_STATE_DETECTOR') {
        eventDetectorType.componentObject.instance.setMultiStateToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setMultiStateToEventDetectorService();
        this.eventDetectorService.multiStateModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.multiStateModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.multiStateModel.sourceId);
      } else if (eventDetectorType.type === 'POINT_CHANGE_DETECTOR') {
        eventDetectorType.componentObject.instance.setPointChangeToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setPointChangeToEventDetectorService();
        this.eventDetectorService.pointChangeModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.pointChangeModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.pointChangeModel.sourceId);
      } else if (eventDetectorType.type === 'BINARY_STATE_DETECTOR') {
        eventDetectorType.componentObject.instance.setBinaryToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setBinaryToEventDetectorService();
        this.eventDetectorService.binaryStateModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.binaryStateModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.binaryStateModel.sourceId);

      } else if (eventDetectorType.type === 'STATE_CHANGE_COUNT_DETECTOR') {
        eventDetectorType.componentObject.instance.setStateChangeCountToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setStateChangeCountToEventDetectorService();
        this.eventDetectorService.stateChangeCountModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.stateChangeCountModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.stateChangeCountModel.sourceId);
      } else if (eventDetectorType.type === 'ANALOG_HIGH_LIMIT_DETECTOR') {
        eventDetectorType.componentObject.instance.setAnalogHighLimitToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setAnalogHighLimitToEventDetectorService();
        this.eventDetectorService.analogHighLimitModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.analogHighLimitModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.analogHighLimitModel.sourceId);
      } else if (eventDetectorType.type === 'ANALOG_LOW_LIMIT_DETECTOR') {
        eventDetectorType.componentObject.instance.setAnalogLowLimitToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setAnalogLowLimitToEventDetectorService();
        this.eventDetectorService.analogLowLimitModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.analogLowLimitModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.analogLowLimitModel.sourceId);
      } else if (eventDetectorType.type === 'ANALOG_RANGE_DETECTOR') {
        eventDetectorType.componentObject.instance.setAnalogRangeToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setAnalogRangeToEventDetectorService();
        this.eventDetectorService.analogRangeModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.analogRangeModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.analogRangeModel.sourceId);
      } else if (eventDetectorType.type === 'NEGATIVE_CUSUM_DETECTOR') {
        eventDetectorType.componentObject.instance.setNegativeCusumToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setNegativeCusumToEventDetectorService();
        this.eventDetectorService.negativeCusumModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.negativeCusumModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.negativeCusumModel.sourceId);
      } else if (eventDetectorType.type === 'POSITIVE_CUSUM_DETECTOR') {
        eventDetectorType.componentObject.instance.setPositiveCusumToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setPositiveCusumToEventDetectorService();
        this.eventDetectorService.positiveCusumModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.positiveCusumModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.positiveCusumModel.sourceId);
      } else if (eventDetectorType.type === 'ALPHANUMERIC_REGEX_STATE_DETECTOR') {
        eventDetectorType.componentObject.instance.setAlphaNumericRegexStateToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setAlphaNumericRegexStateToEventDetectorService();
        this.eventDetectorService.alphaNumericRegexStateModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.alphaNumericRegexStateModel;

        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.alphaNumericRegexStateModel.sourceId);
      } else if (eventDetectorType.type === 'ALPHANUMERIC_STATE_DETECTOR') {
        eventDetectorType.componentObject.instance.setAlphaNumericStateToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setAlphaNumericStateToEventDetectorService();
        this.eventDetectorService.alphaNumericStateModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.alphaNumericStateModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.alphaNumericStateModel.sourceId);
      } else if (eventDetectorType.type === 'RATE_OF_CHANGE_DETECTOR') {
        eventDetectorType.componentObject.instance.setRateOfChangeToEventDetectorService();
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'CREATE';
        eventDetectorType.componentObject.instance.setRateOfChangeToEventDetectorService();
        this.eventDetectorService.rateOfChangeModel.sourceId = this.dataPoint.xid;
        this.abstractEventDetector.body = this.eventDetectorService.rateOfChangeModel;
        this.eventTableList = [this.abstractEventDetector.body];
        this.filteredArray = this.eventTableList.filter((h: { name: string; }) => h.name !== this.eventDetectorService.rateOfChangeModel.sourceId);
      }
      this.filteredArray.forEach((event: any) => {
        const uniqueArray = [...new Set(this.filteredArray.map((event: any) => JSON.stringify(event)))].map(event => JSON.parse(event as any));
        uniqueArray.forEach(event => {
          // Check if event is not already present in this.dataSource and is not blank
          if (event.name && !this.dataSource.some((data: { name: any; }) => data.name === event.name)) {
            const availableElements = uniqueArray.filter(element => element.name && !this.dataSource.some((data: { name: any; }) => data.name === element.name));
            if (availableElements.length > 0) {
              const randomElementIndex = Math.floor(Math.random() * availableElements.length);
              this.dataSource.push(availableElements[randomElementIndex]);
              this.table.renderRows();
            }
          }
        });
      });
    });
  }

  //saving bulk data
  saveBulkEvent() {
    // const uniqueDataSource = this.dataSource.filter((event, index) => {
    //   return index === this.dataSource.findIndex(obj => {
    //     return JSON.stringify(obj) === JSON.stringify(event);
    //   });
    // });
    // const requests = uniqueDataSource.map(event => {
    //   return {
    //     action: 'CREATE',
    //     body: event
    //   }
    // });
    // const bulkEvent = {
    //   action: 'CREATE',
    //   body: null,
    //   requests: requests,
    // };

    // this.eventDetectorService.saveEventDetector(bulkEvent).subscribe(data => {
    //   this.commonService.notification(this.savedMsg);
    //   this.entry.clear();
    //   this.showAddButton = false;
    // }, err => {
    // });
  }

//   private timeOutFunction() {
//     this.messageError = true;
//     setTimeout(() => {
//       this.messageError = false;
//     }, 2000);
//   }

  blankDataClose() {
    // this.addEventDetector(null, null);
  }

  editEventDetector(events: any) {
    const dataArray = [events];
    dataArray.forEach(elements => {
      this.componentLoaded(elements.detectorType, elements);
      this.showUpdateButton = true;
      this.showAddButton = false;
      this.showSaveButton = false;
    });
  }

  updateEventDetector() {
    this.eventDetectorsArray.forEach((eventDetectorType: { type: string; componentObject: { instance: { setPointChangeToEventDetectorService: () => void; setMultiStateToEventDetectorService: () => void; setBinaryToEventDetectorService: () => void; setNoChangeEventDetectorService: () => void; setNoUpdateToEventDetectorService: () => void; setStateChangeCountToEventDetectorService: () => void; setAnalogHighLimitToEventDetectorService: () => void; setAnalogLowLimitToEventDetectorService: () => void; setAnalogRangeToEventDetectorService: () => void; setNegativeCusumToEventDetectorService: () => void; setPositiveCusumToEventDetectorService: () => void; setAlphaNumericRegexStateToEventDetectorService: () => void; setAlphaNumericStateToEventDetectorService: () => void; setRateOfChangeToEventDetectorService: () => void; }; }; }) => {
      this.eventDetector.id = 'BULK_EVENT_DETECTOR';
      this.eventDetector.action = 'UPDATE';
      this.eventDetector.body = null;
      this.eventDetector.expiration = 1000;
      this.eventDetector.timeout = 1000;

      if (eventDetectorType.type === 'POINT_CHANGE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setPointChangeToEventDetectorService();
        this.eventDetectorService.pointChangeModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.pointChangeModel.xid = this.eventDetectorService.pointChangeModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.pointChangeModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.pointChangeModel;
      } else if (eventDetectorType.type === 'MULTISTATE_STATE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setMultiStateToEventDetectorService();
        this.eventDetectorService.multiStateModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.multiStateModel.xid = this.eventDetectorService.multiStateModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.multiStateModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.multiStateModel;
      } else if (eventDetectorType.type === 'BINARY_STATE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setBinaryToEventDetectorService();
        this.eventDetectorService.binaryStateModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.binaryStateModel.xid = this.eventDetectorService.binaryStateModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.binaryStateModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.binaryStateModel;
      } else if (eventDetectorType.type === 'NO_CHANGE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setNoChangeEventDetectorService();
        this.eventDetectorService.noChangeModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.noChangeModel.xid = this.eventDetectorService.noChangeModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.noChangeModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.noChangeModel;
      } else if (eventDetectorType.type === 'NO_UPDATE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setNoUpdateToEventDetectorService();
        this.eventDetectorService.noUpdateModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.noUpdateModel.xid = this.eventDetectorService.noUpdateModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.noUpdateModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.noUpdateModel;
      } else if (eventDetectorType.type === 'STATE_CHANGE_COUNT_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setStateChangeCountToEventDetectorService();
        this.eventDetectorService.stateChangeCountModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.stateChangeCountModel.xid = this.eventDetectorService.stateChangeCountModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.stateChangeCountModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.stateChangeCountModel;
      } else if (eventDetectorType.type === 'ANALOG_HIGH_LIMIT_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setAnalogHighLimitToEventDetectorService();
        this.eventDetectorService.analogHighLimitModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.analogHighLimitModel.xid = this.eventDetectorService.analogHighLimitModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.analogHighLimitModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.analogHighLimitModel;
      } else if (eventDetectorType.type === 'ANALOG_LOW_LIMIT_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setAnalogLowLimitToEventDetectorService();
        this.eventDetectorService.analogLowLimitModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.analogLowLimitModel.xid = this.eventDetectorService.analogLowLimitModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.analogLowLimitModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.analogLowLimitModel;
      } else if (eventDetectorType.type === 'ANALOG_RANGE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setAnalogRangeToEventDetectorService();
        this.eventDetectorService.analogRangeModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.analogRangeModel.xid = this.eventDetectorService.analogRangeModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.analogRangeModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.analogRangeModel;
      } else if (eventDetectorType.type === 'NEGATIVE_CUSUM_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setNegativeCusumToEventDetectorService();
        this.eventDetectorService.negativeCusumModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.negativeCusumModel.xid = this.eventDetectorService.negativeCusumModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.negativeCusumModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.negativeCusumModel;
      } else if (eventDetectorType.type === 'POSITIVE_CUSUM_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setPositiveCusumToEventDetectorService();
        this.eventDetectorService.positiveCusumModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.positiveCusumModel.xid = this.eventDetectorService.positiveCusumModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.positiveCusumModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.positiveCusumModel;
      } else if (eventDetectorType.type === 'ALPHANUMERIC_REGEX_STATE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setAlphaNumericRegexStateToEventDetectorService();
        this.eventDetectorService.alphaNumericRegexStateModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.alphaNumericRegexStateModel.xid = this.eventDetectorService.alphaNumericRegexStateModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.alphaNumericRegexStateModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.alphaNumericRegexStateModel;
      } else if (eventDetectorType.type === 'ALPHANUMERIC_STATE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setAlphaNumericStateToEventDetectorService();
        this.eventDetectorService.alphaNumericStateModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.alphaNumericStateModel.xid = this.eventDetectorService.alphaNumericStateModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.alphaNumericStateModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.alphaNumericStateModel;
      } else if (eventDetectorType.type === 'RATE_OF_CHANGE_DETECTOR') {
        this.abstractEventDetector = new AbstractEventDetectorModel();
        this.abstractEventDetector.action = 'UPDATE';
        eventDetectorType.componentObject.instance.setRateOfChangeToEventDetectorService();
        this.eventDetectorService.rateOfChangeModel.sourceId = this.dataPoint.xid;
        this.eventDetectorService.rateOfChangeModel.xid = this.eventDetectorService.rateOfChangeModel.xid;
        this.abstractEventDetector.xid = this.eventDetectorService.rateOfChangeModel.xid;
        this.abstractEventDetector.body = this.eventDetectorService.rateOfChangeModel;

      }
    });
    const uniqueDataSource = this.dataSource.filter((event: any, index: any) => {
      return index === this.dataSource.findIndex((obj: any) => {
        return JSON.stringify(obj) === JSON.stringify(event);
      });
    });
    const requests = uniqueDataSource.map((event: { detectorType: any; sourceId: any; name: any; xid: any; }) => {
      // Add checks for required fields here
      if (!event.detectorType || !event.sourceId || !event.name) {
        return null; // Skip events with missing required fields
      }
      return {
        action: 'UPDATE',
        body: event,
        xid: event.xid
      };
    }).filter((request: null) => request !== null); // Remove any null requests

    if (requests.length === 0) {
      return; // Return or handle accordingly if there are no valid requests
    }
    const bulkEvent = {
      action: 'UPDATE',
      body: null,
      requests: requests,
      timeout: 6000,
      expiration: 6000
    };

    this.eventDetectorService.updateEventDetector(bulkEvent).subscribe(data => {
      this.commonService.notification(this.updateMsg);
      this.entry.clear();
      this.showUpdateButton = false;

    }, err => {
      // Handle error
    });
  }

  /** delete event detector. */
  deleteEventDetector(request: any) {
    this.request = request;
    this.requestName = this.request.name;
    this.commonService
      .openConfirmDialog('Are you sure you want to delete ', this.request.name)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.eventDetectorService
            .deleteEventDetector(this.request.xid)
            .subscribe((data) => {
              this.commonService.notification(this.deleteMsg);
              this.getEventDetectorByDataPoint(event);
              window.location.reload();
            });
        }
      });
  }

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  isChecked(node: DataPointModel): boolean {
    return this.selection.isSelected(node.xid);
  }

//   /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSource.forEach((value: { xid: string; }) =>
      this.selection.select(value.xid));
  }
}
