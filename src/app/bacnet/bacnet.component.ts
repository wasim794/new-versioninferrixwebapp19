import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef, AfterViewInit
} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../common';
import {MatSidenav} from '@angular/material/sidenav';
import {BacnetLocalDeviceComponent, BacnetLocalDeviceModel} from '../bacnet';
import {LoadbacnetformComponent} from '../bacnet/component/loadbacnetform/loadbacnetform.component';
import {BacnetService} from '../bacnet/shared/service/bacnet.service';
import {CommonService} from '../services/common.service';
import {commonHelp} from '../help/commonHelp';
import {MatDialog} from '@angular/material/dialog';
import {HelpModalComponent} from '../help/help-modal/help-modal.component';
import {DictionaryService} from "../core/services/dictionary.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Observable} from "rxjs";
import {DatasourceModel} from "../datasource/model/datasourceModel";
import {SelectionModel} from "@angular/cdk/collections";
import {DataPointModel} from "../core/models/dataPoint";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module/mat-module.module';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, ReactiveFormsModule, LoadbacnetformComponent],
  providers:[BacnetService, DictionaryService],
  selector: 'app-bacnet',
  templateUrl: './bacnet.component.html'

})
export class BacnetComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('localDeviceDrawer') public bacnetSidebar!: MatSidenav;
  @ViewChild(BacnetLocalDeviceComponent) private bacnetLocalDevice!: BacnetLocalDeviceComponent;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  @ViewChild(LoadbacnetformComponent)
  private loadBacnet!: LoadbacnetformComponent;
  private componentRef: any;
  deleteSuccessMsg = 'is deleted successfully!';
  bacnet = true;
  info = new commonHelp();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['select', 'position', 'name',  'actions'];
  obs:any= new Observable;
  displayData!: boolean;
  public dataSource: MatTableDataSource<BacnetLocalDeviceModel<any>> = new MatTableDataSource<BacnetLocalDeviceModel<any>>();
  dataSources:MatTableDataSource<any> = new MatTableDataSource<DatasourceModel>();
  selection = new SelectionModel<string>(true, []);
  sortingType = 'default';
  private sortingProperty!: string;
  UIDICTIONARY : any;

  constructor(
    private resolver: ComponentFactoryResolver,
    public _service: BacnetService,
    public commonService: CommonService,
    private dialog: MatDialog,
    public dictionaryService: DictionaryService, private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getLocalDevices();
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  sortingCommissionedNodes(event: any) {
    if (event.direction !== '') {
      this.sortingType = event.direction;
      this.sortingProperty = event.active.trim().toLowerCase();
      if (event.active.trim().toLowerCase() === 'node type') {
        this.sortingProperty = 'definition';
      }
      if (event.active.trim().toLowerCase() === 'profiles') {
        this.sortingProperty = 'jsonDataId';
      }
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isChecked(node: any): boolean {
    return this.selection.isSelected(node.id);
  }

  addDataPointXid(event: any, dataPoint: any) {
    if (event.checked) {
      this.selection.select(dataPoint.id);
    } else {
      this.selection.deselect(dataPoint.id);
    }
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSource.data.forEach(value =>
      this.selection.select(value.id));
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getLocalDevices() {
    this.subs.add(this._service.get().subscribe((data) => {
      this.dataSource.data = data;
      const dataAll = this.dataSource.data;
      dataAll.push();
      this.dataSource.data = dataAll;
      this.dataSource.data.length > 8 ? this.displayData = true : this.displayData = false;
    }));
  }

  loadBacnetLocalDeviceHelpModel() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'HelpBacnetLocalDeviceHelpModel', content: this.info.HtmlHelpBACNetLocalDevices},
      disableClose: true
    });
  }

  editLocalDevice(model: BacnetLocalDeviceModel<any>) {
    this.bacnetSidebar.open();
    this.loadBacnet.editLocalDevice(model);
  }

  addLocalDevice() {
    this.bacnetSidebar.open();
    this.loadBacnet.addLocalDevice();
  }

  closeAllSidebar(event: any) {
    this.bacnetSidebar.close();
    this.getLocalDevices();
  }

  deleteLocalDevice(model: BacnetLocalDeviceModel<any>) {
    this.subs.add(this.commonService.openConfirmDialog('Are you want to delete ', model.deviceName).afterClosed().subscribe(response => {
      if (response) {
        this._service.delete(model.id).subscribe((data) => {
          this.commonService.notification(model.deviceName + ' ' + this.deleteSuccessMsg);
          this.getLocalDevices();
        });
      }
    }));
  }

   goBack() {
    this.commonService.goBackHistory();
  }


}

