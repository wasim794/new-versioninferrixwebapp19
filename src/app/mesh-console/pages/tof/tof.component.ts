import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {TofService} from '../../shared/services';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {DictionaryService} from "../../../core/services";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommonService} from "../../../services/common.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers:[CommonService, DictionaryService, TofService],
  selector: 'app-tof',
  templateUrl: './tof.component.html'
})
export class TofComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public UIDICTIONARY:any;
  displayedColumns: string[] = ['S.No.', 'Address', 'Name', 'Actions'];
  dataSource: any = new MatTableDataSource<any>();
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [8, 15, 20];
  public tofTypesSensors ="DISTANCE_SENSOR.DS";

  constructor(public _tofService : TofService, private dictionaryService:DictionaryService,
              public dialog: MatDialog, public _commonService:CommonService) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary("meshConsole").subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = `limit(${this.limit},${this.offset})&type=${encodeURIComponent(this.tofTypesSensors)}`;
    this.getTofData(param);
  }

  getTofData (params:string){
    this.subs.add(this._tofService.getTofMeshOn(params).subscribe((data) => {
        this.dataSource = data;
    },
(error) => {
    console.error('Error fetching data:', error);
    }));
    }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = `limit(${this.limit},${this.offset})&type=${this.tofTypesSensors}`;
    this.getTofData(param);
  }

  startActions(element: any, actions: any) {
    const dialogRef = this.dialog.open(TofDialogComponent, {
      data: {
        element: element,
        action: actions
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      result=='success'? this._commonService.notification("Successfully applied"):'';

    });
  }
  goBack() {
    this._commonService.goBackHistory();
  }
}

/*start second row*/
@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers:[CommonService, DictionaryService],
  selector: 'content-dialog',
  templateUrl: 'content-dialog.html',
})


export class TofDialogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public UIDICTIONARY: any;
  public tofData: any;
  public targetAddress!: number;

  constructor(private dictionaryService: DictionaryService,
              public dialogRef: MatDialogRef<TofDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private tofService: TofService) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary("meshConsole").subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.tofData = this.data;
  }

  sendToTof(){
    const address = this.tofData.element.address;
    this.subs.add(this.tofService.displayDataConfiguration(address, this.targetAddress).subscribe(data=>{
      this.dialogRef.close("success")
    }))
  }

}


