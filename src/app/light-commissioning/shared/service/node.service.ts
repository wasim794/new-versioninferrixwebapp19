import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiService} from '../../../core/services';
import {AutoModeModel, NodesFilterModel, UserGradeControlModel} from '../model';
import {AbstractNodeModel} from '../model/node/abstract-node.model';

@Injectable({
  providedIn: 'root'
})

export class NodeService {

  node = '/v2/light-commissioning/node';
  // tslint:disable-next-line:max-line-length
  profileDropDownList = '/v2/light-commissioning/summary?or(eq(definition,LIGHT_CONTROLLER.PROFILE),eq(definition,DIGITAL_INPUT_CONTROLLER.PROFILE),eq(definition,RELAY_CONTROLLER.PROFILE),eq(definition,WRIST_BAND.PROFILE))';
  nodeUserControl = '/v2/light-commissioning/node/action/user-control';
  profileToNode = '/v2/light-commissioning/node/apply-profile';
  readNodeSettings = '/v2/light-commissioning/node/action/read';
  profileTypes = '/v2/light-commissioning/profile/types';
  nodeTypes = '/v2/light-commissioning/node/types';
  gradeUserControl = '/v2/light-commissioning/node/action/user-grade-control';
  autoMode = '/v2/light-commissioning/node/action/auto-mode/';
  offsiteUrl = '/v2/light-commissioning/offsite';
  pushProfile = '/v2/light-commissioning/node/push-profile';
  nodeStatsUrl = '/v2/light-commissioning/node/stats';
  pirEnableDisable = '/v2/light-commissioning/pir-interrupt/';

  isNodeEdit!: boolean;
  editNode = {} as AbstractNodeModel;
  private filterResponse = new Subject<any>();
  nodeXid: any;

  constructor(
    private api: ApiService
  ) {
  }

  setNodeXid(xid: any) {
    this.nodeXid = xid;
  }

  applyProfileToNode(xid: any, profileXid: any): Observable<any> {
    return this.api.put(`${this.profileToNode}/${xid}/${profileXid}`, undefined);
  }

  setNodeAfterEdit(nodes: any) {
    this.editNode = nodes;
  }

  setEdit(isEdit: any) {
    this.isNodeEdit = isEdit;
  }




  getNodes(limit: any, offSet: any, commissioned: boolean, sortingType: string, sortProperty: string): any {
    if (sortingType === 'asc') {
      const url = `${this.node}?and(limit(${limit},${offSet}),commissioned=${commissioned},sort(${sortProperty}))`;
      return this.api.get(url);
    } else if (sortingType === 'desc') {
      const url = `${this.node}?and(limit(${limit},${offSet}),commissioned=${commissioned},sort(-${sortProperty})`;
      return this.api.get(url);
    } else if (sortingType === 'default') {
      const url = `${this.node}?and(limit(${limit},${offSet}),commissioned=${commissioned})`;
      return this.api.get(url);
    }
    
  }

  query(filterModel: any, commissioned: any): Observable<any> {
    let query = '?';
    if (Object.keys(filterModel.filters).length < 1) {
      query = query + 'eq(';
      Object.keys(filterModel.filters)
      .forEach((key) => {
        query = query + key + ',' + filterModel.filters[key] + ')';
      });
    } else {
      query = query + 'and(';
      let filterSize = Object.keys(filterModel.filters).length;
      Object.keys(filterModel.filters).forEach((key) => {
        if (filterSize === 1) {
          query = query + 'eq(' + key + ',' + filterModel.filters[key] + ')';
        } else {
          query = query + 'eq(' + key + ',' + filterModel.filters[key] + '),';
        }
        filterSize--;
      });
    }
    return this.api.get(`${this.node}${query},eq(commissioned,${commissioned}))`);
  }

  getProfiles(): Observable<any> {
    const url = `${this.profileDropDownList}`;
    return this.api.get(url);
  }

  getProfileTypes(): Observable<any> {
    const url = `${this.profileTypes}`;
    return this.api.get(url);
  }

  getNodeType(): Observable<any> {
    const url = `${this.nodeTypes}`;
    return this.api.get(url);
  }

  nodeControl(nodeObject: Object, xid: String) {
    return this.api.put(`${this.nodeUserControl}/${xid}`, nodeObject);
  }

  getNodeByXid(xid: any): Observable<any> {
    const url = `${this.node}/${xid}`;
    return this.api.get(url);
  }

  saveNode(NodeObject: Object) {
    return this.api.post(`${this.node}`, NodeObject);
  }

  resetNode(nodeXid: string) {
    return this.api.put(`${this.node}/${nodeXid}`);
  }

  getNodeSettings(nodeXid: string) {
    const url = `${this.readNodeSettings}/${nodeXid}`;
    return this.api.get(url);
  }

  setFilterSearch(data: any) {
    this.filterResponse.next(data);
  }

  getFilterSearch(): Observable<any> {
    return this.filterResponse.asObservable();
  }

  sendAutoMode(xid: string, auto: AutoModeModel) {
    return this.api.put(`${this.autoMode}/${xid}`, auto);
  }

  sendGradeControl(control: UserGradeControlModel) {
    return this.api.put(`${this.gradeUserControl}`, control);
  }

  offsite(enable: boolean, sending: boolean) {
    let url = this.offsiteUrl;
    if (sending) {
      url = url + '?enable=' + enable;
    }
    return this.api.get(`${url}`);
  }

  enableDisablePir(enable: boolean, xid: string) {
    let url = this.pirEnableDisable + xid;
    url = url + '?enable=' + enable;
    return this.api.put(`${url}`);
  }

  pushProfileToNode(xid: string) {
    return this.api.put(`${this.pushProfile}/${xid}`);
  }

  nodeStats() {
    return this.api.get(`${this.nodeStatsUrl}`);
  }

  delete(nodeXid: string): Observable<any> {
    return this.api.delete(`${this.node}/${nodeXid}`);
  }
}
