import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {QueryModelComponent} from './query-model/query-model.component';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {ModbusControllerModel} from '../../models';
import {DictionaryService} from "../../../core/services";
import {CommonService} from '../../../services/common.service';
import {ModbusControllerService} from "../../service/modbus-controller.service";
import {CommandModel} from '../../models';

@Component({
  selector: 'app-discovered-nodes',
  templateUrl: './discovered-nodes.component.html',
  styleUrls: []
})
export class DiscoveredNodesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  discoverNodes: any = new ModbusControllerModel();
  searchDiscovered: any;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 12, 16, 20];
  startPollingCommand="Start polling command sent";
  stopPollingCommand="Stop polling command sent";
  UIDICTIONARY:any;

  constructor(public dialog: MatDialog, public modbusController: ModbusControllerService,
              public dictionaryService: DictionaryService, private commonService:CommonService) {
    super();
  }

  displayedColumns: string[] = ['position', 'name', 'status', 'actions'];

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.renderFetchData();
  }

  renderFetchData() {
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
    this.getDiscoveredNodes(param);
  }

  filterDiscovered(event) {
      if (this.searchDiscovered) {
        const encodedSearchValue = encodeURIComponent(this.searchDiscovered);
        const param = 'like(address,%2A' + encodedSearchValue + '%2A)';

        this.subs.add(this.modbusController.get(param).subscribe(data => {
          this.discoverNodes = data;
        }));
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getDiscoveredNodes(param);
      }
  }

  getDiscoveredNodes(param: any) {
    this.subs.add(this.modbusController.get(param).subscribe(data => {
      this.discoverNodes = data;
    }));
  }

  startPollingAll(element){
    this.commonService.openConfirmDialog("Would you like to start polling", element.address).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.modbusController.startPolling(element.id).subscribe(data => {
          this.commonService.notification(this.startPollingCommand);
        }));
      }
    });
  }

  stopPollingAll(element){
    this.commonService.openConfirmDialog("Would you like to stop polling", element.address).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.modbusController.stopPolling(element.id).subscribe(data => {
      this.commonService.notification(this.stopPollingCommand);
    }));
      }
    });
  }

  getNext(event) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + this.limit + ',' + this.offset + ')&sort(+name))';
    this.getDiscoveredNodes(param);
  }

  clearData(element) {
    if (confirm("are you want to sure the clear All data! ")) {
      this.subs.add(this.modbusController.resetController(element.id).subscribe(data => {
        this.commonService.notification('Clear Data Successfully');
        this.renderFetchData();
      }));
    }
  }

  openDialog(event) {
    const dialogRef = this.dialog.open(QueryModelComponent, {
      data: {queryAllList: event,},
      width: '800px',
      height: '362px',
      disableClose: true,
      panelClass:['queryAllModal']
    });
    dialogRef.afterClosed().subscribe(result => {
      this.renderFetchData();
      if (result === undefined || result === false) {
      } else {
        this.renderFetchData();
      }

    });
  }

  dataTransfer(element) {
    const dialogBox = this.dialog.open(ContentDialog, {
      data: {
        element: element
      }
    });
    dialogBox.afterClosed().subscribe(result => {
      result=='success'? this.commonService.notification("Successfully applied"):'';

    });
  }

}


///*START DIALOG CONTAINER HTML*///

@Component({
  selector: 'content-dialog',
  templateUrl: 'content-dialog.html',
})
export class ContentDialog extends UnsubscribeOnDestroyAdapter implements OnInit {
  public UIDICTIONARY: any;
  public command: any = new CommandModel();
  constructor(private dictionaryService:DictionaryService, public dialogRef: MatDialogRef<ContentDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any, public modbusController: ModbusControllerService) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary("menu").subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });

  }
  startActions(){
   const _id = this.data.id;
   this.subs.add(this.modbusController.configureModbusDataTransfer(_id, this.command).subscribe(data=>{
     this.dialogRef.close("success");
   }));
  }

}

