import {Component, HostListener, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {DatasourceService} from '../service/datasource.service';
import {DataSourceService} from "../../core/services";
import {DatasourceModel} from '../model';
import {commonHelp} from '../../help/commonHelp';
import {Router} from '@angular/router';
import {DataPointModel} from '../../core/models/dataPoint';
import {DatasourceEditComponent} from '../datasource-edit/datasource-edit.component';
import {DatapointPropertiesComponent} from '../components/common';
import {MatSidenav} from '@angular/material/sidenav';
import {MatPaginator} from '@angular/material/paginator';
// import {EventDetectorComponent} from '../../event-detector/components/event-detector/event-detector.component';
import {MatDialog} from '@angular/material/dialog';
import {HelpModalComponent} from '../../help/help-modal/help-modal.component';
import {CommonService} from '../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../common';
// import {CopyDatasourceComponent} from '../components';
import {DictionaryService} from "../../core/services";
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {Sort} from '@angular/material/sort';
import { MatModuleModule } from '../../common/mat-module';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [MatModuleModule, CommonModule, DatasourceEditComponent],
  providers: [DatasourceService, DataSourceService, DictionaryService],
  selector: 'app-datasource-list',
  templateUrl: './datasource-list.component.html',
  styleUrls: [],
})
export class DatasourceListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('datasourceSideBar_tag')
  layoutSideBarRef!: ElementRef;
  @ViewChild(DatasourceEditComponent)
  private datasourceEditComponent!: DatasourceEditComponent;
  // @ViewChild(DatapointPropertiesComponent)
  // private pointProperties!: DatapointPropertiesComponent;
  // @ViewChild(EventDetectorComponent)
  // private eventDetector: EventDetectorComponent;
  @ViewChild('sidebar')
  public sidenav!: MatSidenav;
  @ViewChild('datasource_sidebar')
  public dataFunctionSidebar!: MatSidenav;
  dataPointModel: DataPointModel = new DataPointModel();
  datasourceList!: DatasourceModel[];
  searchDatasourceList:any = [];
  allDatasourceList:any = new MatTableDataSource<DatasourceModel>();
  datasource!: DatasourceModel;
  datasourceType: any = [];
  dataPoints!: DataPointModel[];
  datasourceName!: any;
  errorMsg!: string;
  info = new commonHelp();
  type!: string;
  limit = 10;
  offset = 0;
  eventName!: string;
  totalNoDataSource!: number;
  pageSizeOptions: number[] = [10, 16, 20];
  searchDatasource!: string;
  isSticky: boolean = false;
  deleteAllButtons!: boolean;
  removeAllButtons!: boolean;
  displayedColumns: string[] = ['select', 'position', 'name', 'enable',  'actions'];
  dataSources:any = new MatTableDataSource<DatasourceModel>();
  selection = new SelectionModel<string>(true, []);
  UIDICTIONARY : any;
  deleteMsg ="Successfully Deleted";
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 150;
  }

  constructor(
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private commonService: CommonService,
    public  dictionaryService: DictionaryService,
    private dialog: MatDialog,
    private _dataSource : DataSourceService,
    private cdr: ChangeDetectorRef
  ) {
    super();

  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    const savedPageIndex = localStorage.getItem('currentPageIndex');
    const savedPageSize = localStorage.getItem('currentPageSize');
    let param = 'limit(' + this.limit + ',' + this.offset + ')';

    if (savedPageIndex !== null && savedPageSize !== null) {
      this.limit = +savedPageSize;
      this.offset = +savedPageIndex * +savedPageSize;
      param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getDatasource(param);
    }else {
      this.getDatasource(param);
    }

    this.subs.add(
    this._dataSource.dataSourceType().subscribe(
        (data) => {
          this.datasourceType = data;
           },
      (err) => console.log(err)
      )
    );

  }

  ngAfterViewInit() {
      setTimeout(() => {
        const savedPageIndex = localStorage.getItem('currentPageIndex');
        const savedPageSize = localStorage.getItem('currentPageSize');

        if (this.paginator) {
          if (savedPageIndex !== null && savedPageSize !== null) {
            this.paginator.pageIndex = +savedPageIndex;
            this.paginator.pageSize = +savedPageSize;

            // Trigger internal MatPaginator method to update the view
            this.paginator._changePageSize(+savedPageSize);
            this.dataSources.paginator = this.paginator;
          }
        }
      });
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
    this.dataSources = data.sort((a: { name: string | number; enable: string | number; }, b: { name: string | number; enable: string | number; }) => {
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
    // return this.selection.isSelected(node.xid);
    return false;
  }

  addDataPointXid(event: { checked: any; }, dataPoint: { xid: string; }) {
    if (event.checked) {
      this.selection.select(dataPoint.xid);
    } else {
      this.selection.deselect(dataPoint.xid);
    }
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.deleteAllButtons = false;
      return;
    }
    this.dataSources.forEach((value: { xid: string; }) =>
     this.selection.select(value.xid));
    this.deleteAllButtons = true;
  }
  dataSourceSideBar(dataFunctionSidebar: any) {
    this.dataFunctionSidebar?.close();
    this.sidenav.close();
  }

  filterDatasource(event: { key: string; type: string; }) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchDatasource) {
        const param = 'like(name,%2A' + this.searchDatasource + '%2A)';
        this.subs.add(this._dataSource.get(param).subscribe(data => {
          this.searchDatasourceList = data;
          this.datasourceList = this.searchDatasourceList;
          this.dataSources = data;
        }));
      } else {
        this.datasourceList = this.allDatasourceList;
        this.dataSources = this.datasourceList;
      }
    }

  }

  addNew(event: { source: { selected: any; }; }, val: any) {
    if (event.source.selected) {
      val === 'MODBUS_SLAVE_DEVICE.DS'         ||
      val === 'PEOPLE_COUNTER.DS'              ||
      val === 'MODBUS_SLAVE_DEVICE_POLLING.DS' ||
      val === 'PEOPLE_COUNT_CAMERA.DS'         ||
      val === 'INTERNAL.DS'                    ||
      val === 'CURRENT_SENSOR.DS'              ||
      val === 'STUDENT_ASSET_TAG.DS'           ||
      val === 'LED_ASSET_TAG.DS'               ||
      val === 'SENSOR_TAG_TH_SHT45.DS'         ||
      val === 'DISTANCE_SENSOR.DS'             ||
      val === 'SENSOR_TAG_DOOR_SENSOR.DS'      ||
      val === 'SENSOR_TAG_IAQ.DS'              ||
      val === 'SENSOR_TAG_PIR.DS'              ||
      val === 'SENSOR_TAG_TH_SHT21.DS'         ||
      val === 'SENSOR_TAG_IAQ_V2.DS'           ||
      val === 'SENSOR_TAG_LUX.DS'

        ?
      alert("This data source is update Only")     :
      this.dataFunctionSidebar.toggle()
      this.datasourceEditComponent.addNew(val);

    }
  }


  dataSourceDetails(dataSource: any) {
    console.log(dataSource);
    this.datasourceEdit(dataSource, 0, false);
  }

  dataPointsList(datasource: DatasourceModel) {
    this.datasource = datasource;
    this.datasourceEdit(datasource, 1, false);
  }

  addDatapoint(datasource: any) {
    this.datasourceEdit(datasource, 1, true);
  }

  datasourceEdit(data: DatasourceModel, index: number, edit: boolean) {
    this.dataFunctionSidebar.open().then(r => console.log(r));
    this.datasourceEditComponent.getDataSource(data, index, edit);
  }

  getNext(event: { pageSize?: any; pageIndex?: any; key?: string; type?: string; }) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    // Save pagination state to localStorage
    localStorage.setItem("param", param);
    localStorage.setItem('currentPageIndex', event.pageIndex.toString());
    localStorage.setItem('currentPageSize', event.pageSize.toString());
    console.log(event.pageIndex.toString(),  event.pageSize.toString());
    this.getDatasource(param);
    localStorage.setItem("param", param);
    this.removeAllButtons = true;
    // this.filterDatasource(event);
  }

   getDatasource(param: string): void {
    this.subs.add(
      this._dataSource.get(param).subscribe(
        (data) => {
          if (data) {
            this.commonService.hideloader();
          }
          this.totalNoDataSource = this._dataSource.total ?? 0;
          this.allDatasourceList = data;
          this.datasourceList = this.allDatasourceList;
          this.dataSources = data;
          // console.log("get data source", data);
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
        },
        (err) => (this.errorMsg = err)
      )
    );
  }

  dsListHelp() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'Data Source List', content: this.info.htmlDataSource},
      disableClose: true,
    });
  }

  copyDatasource(datasource: any) {
    // this.dialog.open(CopyDatasourceComponent, {
    //   data: {alldata: datasource},
    //   disableClose: true,
    //   panelClass:['copyDataSource'],

    // }).afterClosed()
    //   .subscribe((response) => {
    //     if (response) {
    //       const param = 'limit(' + this.limit + ',' + this.offset + ')';
    //       this.getDatasource(param);
    //     }
    //   });


  }

  datasourceStatus(event: { checked: any; }, datasource: DatasourceModel) {
    const indexValue = this.datasourceList.indexOf(datasource);
    const statusValue = event.checked;
    this.subs.add(
      this._dataSource
        .enableDisable(datasource.xid, statusValue)
        .subscribe((data) => {
          this.datasourceList[indexValue].enabled = statusValue;
            this.datasourceList[indexValue].enabled===true?this.commonService.notification("DataSource Enabled")
              :this.commonService.notification("DataSource Disabled");
        })
    );
  }

  savedDatasource(dataSource: DatasourceModel | undefined) {
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDatasource(param);
    this.sidenav.close();
    this.dataFunctionSidebar.close();
  }

  updatedDatasource(dataSource: DatasourceModel) {
    const updateItem = this.datasourceList.find((x) => x.id === dataSource.id);
    // const index = this.datasourceList.indexOf(updateItem);
    // this.datasourceList[index] = dataSource;
    //add after this function to long time
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDatasource(param);
    //end here
    this.sidenav.close();
    this.dataFunctionSidebar.close();
  }

  deleteDatasource(datasource: any) {
    this.datasource = datasource;
    this.datasourceName = this.datasource.name;
    this.commonService
      .openConfirmDialog('Would you like to delete this DataSource? ', this.datasourceName)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this._dataSource
            .delete(this.datasource.xid)
            .subscribe((data) => {
              this.commonService.notification(this.deleteMsg);
              const param = 'limit(' + this.limit + ',' + this.offset + ')';
              this.getDatasource(param);
            });
        }
      });
  }

  refreshData(){
    ["param", "currentPageIndex", "currentPageSize"].forEach(key => localStorage.removeItem(key));
    // console.log("Removed param, currentPageIndex, and currentPageSize from localStorage.");
    let param = 'limit(' + 10 + ',' + 0 + ')';
    this.getDatasource(param);
  }


  refreshItemData(){
    let param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDatasource(param);
  }

}


