import {Component, OnInit} from '@angular/core';
import {MeshDiagnosticModel, MeshNodeInfoModel} from '../../shared/models';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {MeshConsoleService} from '../../shared/services';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {CommonService} from '../../../services/common.service';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import {UpdateNodeSettingsComponent} from '../../Component/update-node-settings/update-node-settings.component';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[ CommonModule, MatModuleModule],
  providers: [ CommonService, DictionaryService, MeshConsoleService ],
  selector: 'app-mesh-node',
  templateUrl: './mesh-node.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MeshNodeComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  dataColumns: string[] = ['Address', 'Node Type', 'Manufacturer Name', 'Hardware Version', 'Application Version', 'WM Version'];
  meshNodeInfoModels: MeshNodeInfoModel[] = [];
  columnsToDisplayWithExpand = [...this.dataColumns, 'expand'];
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 12, 16, 20];
  dataSource = this.meshNodeInfoModels;
  expandedElement!: MeshNodeInfoModel | null;
  isNeighbors: boolean = false;
  isBoot: boolean = false;
  isEvent: boolean = false;
  meshNodeControllers!: boolean;
  dignoSticsDetails='/mesh-console/mesh-node/dignostics-detail';
  successNode='reboot Successfully';
  UIDICTIONARY : any;

  constructor(
    public service: MeshConsoleService,
    public dictionaryService: DictionaryService,
    public commonService:CommonService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address)';
    this.getMeshNodesData(param);
  }

  getNextPage(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address))';
    this.getMeshNodesData(param);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let param;
    if (filterValue.length)
      param = 'limit(' + this.limit + ',' + this.offset + ')&address=' + Number(filterValue);
    else
      param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address)'
    this.getMeshNodesData(param)
  }

  getMeshNodesData(params: string): void {
    this.subs.add(this.service.getMeshNodesData(params).subscribe((data) => {
      this.meshNodeInfoModels = data;
    }));
  }

  toggleRow(element: MeshNodeInfoModel, row: string) {
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

  rebootNode(element: MeshNodeInfoModel, row: string){
    this.subs.add(this.service.rebootNode(element.address).subscribe((data) => {
      this.commonService.notification(this.successNode);
    }));

  }

  nodeUpdateSettings(element: any){
    const dialogRef = this.dialog.open(UpdateNodeSettingsComponent, {
      data: {data: element,},
      width: '320',
      height: 'auto',
      disableClose: true,
      panelClass:['updateNodeSettings']
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


  startStopMeshController(element: any, enable: boolean): void {
    console.log("Clicked:", enable);
     if(enable===false){
       element.meshNodeControllers = true;
     } else if(enable===true){
      element.meshNodeControllers = false;
    }
    // return;
    // Call backend to start or stop the controller
    this.subs.add(this.service.startStopMeshControllerPublisher(element.address, enable)
      .subscribe((data: any) => {
        this.commonService.notification(data.responseMessage);
        if(data.isComplete===true){
          element.meshNodeControllers = true;
        } else if(data.isComplete===false){
          element.meshNodeControllers = false;
        }
      }));
  }
  enableDisableMeshController(element: any, boolean: any){
    this.subs.add(this.service.enableDisableMeshControllerWifi(element.address, boolean).subscribe((data) => {
      this.commonService.notification(data.responseMessage+' '+element.address);
    }));
  }

  private detailUrl(element: any){
   return  this.router.navigate([this.dignoSticsDetails, element.xid]);
  }

  detailDiagnotics(element: any){
    this.detailUrl(element).then(r => console.log(r));
  }

}
