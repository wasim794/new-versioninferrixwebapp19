import {Component, OnInit} from '@angular/core';
import {MeshDiagnosticModel} from '../../shared/models';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {MeshConsoleService} from '../../shared/services';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {CommonService} from '../../../services/common.service';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-mesh-console-diagnostics',
  templateUrl: './mesh-console-diagnostics.component.html',
  styleUrls: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MeshConsoleDiagnosticsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  diagnosticDataColumns: string[] = ['Address', 'Node Type', 'Role', 'Battery', 'Buffer Usage',
    'Dropped Packets', 'Access Cycle', 'Quality', 'Error'];
  diagnosticData: MeshDiagnosticModel[] = [];
  columnsToDisplayWithExpand = [...this.diagnosticDataColumns, 'expand'];
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 12, 16, 20];
  dataSource = this.diagnosticData;
  expandedElement: MeshDiagnosticModel | null;
  isNeighbors: boolean = false;
  isBoot: boolean = false;
  isEvent: boolean = false;
  successNode='reboot Successfully';
  UIDICTIONARY : any;

  constructor(
    public service: MeshConsoleService,
    public dictionaryService: DictionaryService,
    public commonService:CommonService
  ) {
    super();
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address)';
    this.getDiagnosticData(param);
  }

  getNextPage(event) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address))';
    this.getDiagnosticData(param);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let param;
    if (filterValue.length)
      param = 'limit(' + this.limit + ',' + this.offset + ')&address=' + Number(filterValue);
    else
      param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address)'
    this.getDiagnosticData(param)
  }

  getDiagnosticData(params: string): void {

  }

  toggleRow(element: MeshDiagnosticModel, row: string) {
    this.expandedElement = this.expandedElement === element ? null : element;
    const flag = this.expandedElement == element;
    if (row === 'neighbors') {
      this.isNeighbors = flag;
      this.isBoot = false;
      this.isEvent = false;
    } else if (row === 'boot') {
      this.isBoot = flag;
      this.isNeighbors = false;
      this.isEvent = false;
    } else if (row === 'events') {
      this.isEvent = flag;
      this.isNeighbors = false;
      this.isBoot = false;
    }
  }

  rebootNode(element: MeshDiagnosticModel, row: string){
    this.subs.add(this.service.rebootNode(element.address).subscribe((data) => {
     this.commonService.notification(this.successNode);
    }));

  }


  startStopMeshController(element){
    this.subs.add(this.service.startStopMeshControllerPublisher(element.address, true).subscribe((data) => {
      this.commonService.notification(data.responseMessage);
    }));
  }
  enableDisableMeshController(element){
    this.subs.add(this.service.enableDisableMeshControllerWifi(element.address, true).subscribe((data) => {
      this.commonService.notification(data.responseMessage);
    }));
  }


}
