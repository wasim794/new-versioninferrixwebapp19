import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DictionaryService} from "../../../../core/services";
import {MatSidenav} from "@angular/material/sidenav";
import {ModbusDeviceAttributesModel} from '../../../models';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {ModbusDeviceAttributesService} from "../../../service/modbus-device-attributes.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {SelectionModel} from "@angular/cdk/collections";
import {Sort} from "@angular/material/sort";
import {DataPointModel} from "../../../../core/models/dataPoint";
import {ModbusAttributeFormComponent} from './modbus-attribute-form/modbus-attribute-form.component';
import {CommonService} from '../../../../services/common.service';

@Component({
  selector: 'app-modbus-device-attributes',
  templateUrl: './modbus-device-attributes.component.html',
  styleUrls: []
})
export class ModbusDeviceAttributesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(ModbusAttributeFormComponent)
  private modbusAttribute: ModbusAttributeFormComponent;
  @ViewChild('input') nameInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['select','position', 'name', 'actions'];
  dataSources:any = new MatTableDataSource<ModbusDeviceAttributesModel>();
  selection = new SelectionModel<string>(true, []);
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 20, 30, 50];
  totalDataSource: number;
  deleteMsg = "Delete Successfully";
  copyMsg="Copy Successfully";
  UIDICTIONARY:any;
  deleteAllButtons: boolean;
  removeAllButtons: boolean;

  @ViewChild('modbusDeviceAttr') public Sidebar: MatSidenav;
  constructor(public dictionaryService: DictionaryService,
              public modbusDeviceAttributesService: ModbusDeviceAttributesService,
              public _commonService: CommonService) {super(); }

  ngOnInit(): void {
    const savedPageIndex = localStorage.getItem('currentPageIndex');
    const savedPageSize = localStorage.getItem('currentPageSize');
    let param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name)';
    this.getModbusAttributeDevice(param);
    if (savedPageIndex !== null && savedPageSize !== null) {
      this.limit = +savedPageSize;
      this.offset = +savedPageIndex * +savedPageSize;
      param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getModbusAttributeDevice(param);
    }else {
      this.getModbusAttributeDevice(param);
    }
     this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });

  }
  deviceSidebar() {
    this.Sidebar.open();
    this.modbusAttribute.addNewMain(event);
  }

  sidebarclose(event){
    this.Sidebar.close();
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name)';
    this.getModbusAttributeDevice(param);
  }

  getNext(event) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name))';
    localStorage.setItem("param", param);
    localStorage.setItem('currentPageIndex', event.pageIndex.toString());
    localStorage.setItem('currentPageSize', event.pageSize.toString());
    console.log(event.pageIndex.toString(),  event.pageSize.toString());
    localStorage.setItem("param", param);
    this.removeAllButtons = true;
    this.getModbusAttributeDevice(param);
  }

  getModbusAttributeDevice(params: string): void {
    this.subs.add(this.modbusDeviceAttributesService.get(params).subscribe(data => {
      this.dataSources = data;
      const savedPageIndex = localStorage.getItem('currentPageIndex');
      const savedPageSize = localStorage.getItem('currentPageSize');
      if (savedPageIndex !== null && savedPageSize !== null) {

        this.paginator.pageIndex = +savedPageIndex;
        this.paginator.pageSize = +savedPageSize;
        this.dataSources.paginator = this.paginator;
        // console.log("if", this.dataSources.paginator);
      }else {
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = 10;
        this.dataSources.paginator = this.paginator;
        // console.log("else", this.dataSources.paginator);
      }
    }));
  }
  copyData(params:any){
    this._commonService.openConfirmDialog('Would you like to copy',
      params.name).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.modbusDeviceAttributesService.copy(params.id).subscribe(data => {
      this._commonService.notification(this.copyMsg);
      const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name))';
      this.getModbusAttributeDevice(param);
      }, error => {
      error.result.message.forEach(value =>
        this._commonService.notification(value.message));
      })
    );
      }
    });

  }

  showUpdate(event){
  this.modbusAttribute.showData(event);
    this.Sidebar.open();
  }

  delete(element){
    this._commonService.openConfirmDialog('Would you like to delete',
      element.name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.modbusDeviceAttributesService.delete(element.id).subscribe(data => {
          const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name))';
          this.getModbusAttributeDevice(param);
          this._commonService.notification(this.deleteMsg);
        }));
      } else {
        return false;
      }
    });
  }

  applyFilter(event) {
    if (event.key === "Enter" || event.type === "click") {
      const filterValue = this.nameInput.nativeElement.value;
      let param;
      if (filterValue) {
        param = 'like(name,*' + encodeURIComponent(filterValue) + '*)';
      } else {
        param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name)';
      }

      this.getModbusAttributeDevice(param);
    }
  }


  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortingData(sort: Sort) {
    const data = this.dataSources.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSources = data;
      return;
    }
    this.dataSources = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'enable':
          return this.compare(a.enable, b.enable, isAsc);
        default:
          return 0;

      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSources.length;
    return numSelected === numRows;
  }

  isChecked(node: DataPointModel): boolean {
    return this.selection.isSelected(node.xid);
  }

  addDataPointXid(event, dataPoint) {
    if (event.checked) {
      this.selection.select(dataPoint.xid);
    } else {
      this.selection.deselect(dataPoint.xid);
    }
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSources.forEach(value =>
      this.selection.select(value.xid));
  }


  refreshItemData(){
    let param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getModbusAttributeDevice(param);
  }

}
