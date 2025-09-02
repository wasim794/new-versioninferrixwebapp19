import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import { DictionaryService } from "../../../../core/services/dictionary.service";
import { MatSidenav } from "@angular/material/sidenav";
import { ModbusDeviceDetailsModel } from "../../../models";
import { UnsubscribeOnDestroyAdapter } from "../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import { ModbusDeviceDetailService } from "../../../service/modbus-device-detail.service";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { Sort } from "@angular/material/sort";
import { DataPointModel } from "../../../../core/models/dataPoint";
import { ModbusDeviceFormComponent } from "./modbus-device-form/modbus-device-form.component";
import { CommonService } from "../../../../services/common.service";
import { CopyModbusComponent } from "./copy-modbus/copy-modbus.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-modbus-device",
  templateUrl: "./modbus-device.component.html",
  styleUrls: [],
})
export class ModbusDeviceComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild(ModbusDeviceFormComponent)
  private modbusDevice: ModbusDeviceFormComponent;
  displayedColumns: string[] = ["select", "position", "name", "actions"];
  dataSources: any = new MatTableDataSource<ModbusDeviceDetailsModel>();
  selection = new SelectionModel<string>(true, []);
  @ViewChild('input') nameInput: ElementRef;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 12, 16, 20];
  copyMsg = "Copy Successfully";
  @ViewChild("modbusDevice") public Sidebar: MatSidenav;
  private deleteMsg = "delete successful";
  UIDICTIONARY:any;

  constructor(
    public dictionaryService: DictionaryService,
    public commonService: CommonService,
    public modbusDeviceDetail: ModbusDeviceDetailService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
   this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = "limit(" + this.limit + "," + this.offset + ")&sort(+name)";
    this.getModbusDevice(param);
  }

  deviceSidebar() {
    this.Sidebar.open();
    this.modbusDevice.addNewMain(event);
  }

  sidebarclose(event) {
    this.Sidebar.close();
    const param = "limit(" + this.limit + "," + this.offset + ")&sort(+name)";
    this.getModbusDevice(param);
  }

  getNext(event) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = "limit(" + this.limit + "," + this.offset + ")&sort(+name))";
    this.getModbusDevice(param);
  }

  getModbusDevice(params: string): void {
    this.subs.add(
      this.modbusDeviceDetail.get(params).subscribe((data) => {
        this.dataSources = data;
      })
    );
  }

  showUpdate(event) {
    this.modbusDevice.showData(event);
    this.Sidebar.open();
  }

  delete(element) {
    this.commonService
      .openConfirmDialog("Would you like to delete", element.name)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.subs.add(
            this.modbusDeviceDetail.delete(element.id).subscribe((data) => {
              const param =
                "limit(" + this.limit + "," + this.offset + ")&sort(+name))";
              this.getModbusDevice(param);
              this.commonService.notification(this.deleteMsg);
            })
          );
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
      this.getModbusDevice(param);
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortingData(sort: Sort) {
    const data = this.dataSources.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSources = data;
      return;
    }
    this.dataSources = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "name":
          return this.compare(a.name, b.name, isAsc);
        case "enable":
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

  copyData(params: any) {
    this.commonService
      .openConfirmDialog("Would you like to copy", params.name)
      .afterClosed()
      .subscribe((response) => {
        if (response) {

        } else {
          return false;
        }

        this.dialog
          .open(CopyModbusComponent, {
            data: { copyData: params },
            disableClose: true,
            panelClass: ["copyDataModbus"],
          })
          .afterClosed()
          .subscribe((response) => {
            if (response) {
              const param =
                "limit(" + this.limit + "," + this.offset + ")&sort(+name)";
              this.getModbusDevice(param);
            }
          });
      });
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSources.forEach((value) =>
      this.selection.select(value.xid)
    );
  }
}
