import {Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api.service';
import {Observable} from 'rxjs';
import {BinaryStateEventDetectorModel} from '../model/binaryStateEventDetectorModel';
import {NoChangeEventDetectorModel} from '../model/noChangeEventDetectorModel';
import {NoUpdateEventDetectorModel} from '../model/noUpdateEventDetectorModel';
import {StateChangeCountEventDetectorModel} from '../model/stateChangeCountEventDetectorModel';
import {AnalogHighLimitEventDetectorModel} from '../model/analogHighLimitEventDetectorModel';
import {NegativeCusumEventDetectorModel} from '../model/negativeCusumEventDetectorModel';
import {PositiveCusumEventDetectorModel} from '../model/positiveCusumEventDetectorModel';
import {AlphanumericStateEventDetectorModel} from '../model/alphanumericStateEventDetectorModel';
import {AlphanumericRegexStateEventDetectorModel} from '../model/alphanumericRegexStateEventDetectorModel';
import {AnalogLowLimitEventDetectorModel} from '../model/analogLowLimitEventDetectorModel';
import {AnalogRangeEventDetectorModel} from '../model/analogRangeEventDetectorModel';
import {MultistateStateEventDetectorModel} from '../model/multistateStateEventDetectorModel';
import {PointChangeEventDetectorModel} from '../model/pointChangeEventDetectorModel';
import {RateOfChangeEventDetectorModel} from '../model/rateOfChangeEventDetectorModel';

@Injectable({
  providedIn: 'root'
})
export class EventDetectorService {

  eventDetectorTypeUrl = '/v2/event-detector-type';
  eventDetectorBulkUrl = '/v2/event-detector/bulk';
  eventDetectorUrl = '/v2/event-detector';
  eventDetectorForDataPointUrl = '/v2/event-detector?dataPointId=';
  binaryStateModel = {} as BinaryStateEventDetectorModel;
  noChangeModel = {} as NoChangeEventDetectorModel;
  noUpdateModel = {} as NoUpdateEventDetectorModel;
  stateChangeCountModel = {} as StateChangeCountEventDetectorModel;
  analogHighLimitModel = {} as AnalogHighLimitEventDetectorModel;
  analogLowLimitModel = {} as AnalogLowLimitEventDetectorModel;
  negativeCusumModel = {} as NegativeCusumEventDetectorModel;
  positiveCusumModel = {} as PositiveCusumEventDetectorModel;
  alphaNumericRegexStateModel = {} as AlphanumericRegexStateEventDetectorModel;
  alphaNumericStateModel = {} as AlphanumericStateEventDetectorModel;
  analogRangeModel = {} as AnalogRangeEventDetectorModel;
  multiStateModel = {} as MultistateStateEventDetectorModel;
  pointChangeModel = {} as PointChangeEventDetectorModel;
  rateOfChangeModel = {} as RateOfChangeEventDetectorModel;


  constructor( private api: ApiService) { }

  setBinaryState(binaryState: BinaryStateEventDetectorModel): any {
   this.binaryStateModel = binaryState;
  }
  setNoChange(noChange: NoChangeEventDetectorModel): any {
    this.noChangeModel = noChange;
  }

  setNoUpdate(noUpdate: NoUpdateEventDetectorModel): any {
    this.noUpdateModel = noUpdate;
  }
  setStateChangeCount(stateChangeCount: StateChangeCountEventDetectorModel): any {
    this.stateChangeCountModel = stateChangeCount;
  }
  setAnalogHighLimit(analogHighLimit: AnalogHighLimitEventDetectorModel): any {
    this.analogHighLimitModel = analogHighLimit;
  }
  setAnalogLowLimit(analogLowLimit: AnalogLowLimitEventDetectorModel): any {
    this.analogLowLimitModel = analogLowLimit;
  }
  setAnalogRange(analogRange: AnalogRangeEventDetectorModel): any {
    this.analogRangeModel = analogRange;
  }
  setPointChange(pointChange: PointChangeEventDetectorModel): any {
    this.pointChangeModel = pointChange;
  }
  setMultistateState(multistateState: MultistateStateEventDetectorModel): any {
    this.multiStateModel = multistateState;
  }
  setNegativeCusum(negativeCusum: NegativeCusumEventDetectorModel): any {
    this.negativeCusumModel = negativeCusum;
  }
  setPositiveCusum(positiveCusum: PositiveCusumEventDetectorModel): any {
    this.positiveCusumModel = positiveCusum;
  }

  setAlphaNumericRegexState(alphaNumericRegexState: AlphanumericRegexStateEventDetectorModel): any {
    this.alphaNumericRegexStateModel = alphaNumericRegexState;
  }
  setAlphaNumericState(alphaNumericState: AlphanumericStateEventDetectorModel): any {
    this.alphaNumericStateModel = alphaNumericState;
  }
  setRateOfChange(rateOfChange: RateOfChangeEventDetectorModel): any {
    this.rateOfChangeModel = rateOfChange;
  }

  getEventDetectorType(dataType: any): Observable<any> {
    return this.api.get(`${this.eventDetectorTypeUrl}/${dataType}`);
  }

  saveEventDetector(eventDetectorObject: Object | undefined) {
    return this.api.post(`${this.eventDetectorBulkUrl}`, eventDetectorObject);
  }
  updateEventDetector(eventDetectorObject: Object | undefined) {
    return this.api.post(`${this.eventDetectorBulkUrl}`, eventDetectorObject);
  }
  getAllEventDetector(): Observable<any> {
    return this.api.get(`${this.eventDetectorBulkUrl}`);
  }

  getEventDetectorForDataPointId(dataPointId: any): Observable<any>  {
    return this.api.get(`${this.eventDetectorForDataPointUrl}${dataPointId}`);
  }

  deleteEventDetector(eventDetectorXid: string): Observable<any>{
    return this.api.delete(`${this.eventDetectorUrl}/${eventDetectorXid}`);
  }
}
