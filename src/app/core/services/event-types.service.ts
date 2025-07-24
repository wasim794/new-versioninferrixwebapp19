import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from './env.service';
import {EventTypeModel} from '../models/events/event-type.model';
import {ArrayWithTotalModel} from '../models';
import {DynamicFlatNode} from '../../events/handlers/shared';
import {AbstractEventTypesModel} from '../models/events';
import {Observable} from 'rxjs';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventTypesService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  get rootLevelNodes(): DynamicFlatNode[] {
    return this._rootLevelNodes;
  }
  private baseUrl = '/v2/event-types';
  private _rootLevelNodes!: DynamicFlatNode[];

  typeId(eventType: any) {
    const type = eventType.eventType;
    const subType = eventType.subType || null;
    const ref1 = eventType.referenceId1 || 0;
    const ref2 = eventType.referenceId2 || 0;
    return `${type}_${subType}_${ref1}_${ref2}`;
  }

  query(eventType?: AbstractEventTypesModel<any>, queryObject?: any, opts = {}): Observable<EventTypeModel<any>[]> {
    const params = {
      rqlQuery: null
    };

    if (queryObject) {
      const rqlQuery = queryObject.toString();
      if (rqlQuery) {
        params.rqlQuery = rqlQuery;
      }
    }

    let segments = [];
    if (eventType && eventType.eventType) {
      segments.push(eventType.eventType);
      if (eventType.subType || eventType.subType === null) {
        segments.push(eventType.subType);
        if (eventType.referenceId1) {
          segments.push(eventType.referenceId1);
          if (eventType.referenceId2) {
            segments.push(eventType.referenceId2);
          }
        }
      }
    }
    segments = segments.map(s => encodeURIComponent(s));
    segments.unshift(this.baseUrl);

    const url = segments.join('/');
    return this.http
    .get<ArrayWithTotalModel<any>>(`${this.env.apiUrl}${url}`)
    .pipe(map((result: any ) => result.items.map(((item: any) => new EventTypeModel(item as EventTypeModel<any>)))));
  }

  initialData(nodes: EventTypeModel<any>[]) {
    this._rootLevelNodes = [];
    nodes.map((node) => this._rootLevelNodes.push(new DynamicFlatNode(node, 0, true, false)));
  }

  isExpandable(node: any): boolean {
    const eventType = node.type;
    if (node.supportsSubtype && !eventType.subType) {
      return true;
    } else if (node.supportsReferenceId1 && !eventType.referenceId1) {
      return true;
    } else if (node.supportsReferenceId2 && !eventType.referenceId2) {
      return true;
    }
    return false;
  }
}
