import {Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {commonHelp} from '../../help/commonHelp';
import {HelpModalComponent} from '../../help/help-modal/help-modal.component';
import {MatSidenav} from '@angular/material/sidenav';
import {MatDialog} from '@angular/material/dialog';
import {CommonService} from '../../services/common.service';
import {PublisherEditComponent} from '../publisher-edit/publisher-edit.component';
import {UnsubscribeOnDestroyAdapter} from '../../common';
import {PublisherService} from '../../core/services';
import {ModuleDefinitionModel} from '../../core/models';
import {AbstractPublisherModel} from '../../core/models/publisher';
import {DictionaryService} from "../../core/services/dictionary.service";
import {MatPaginator} from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {DatasourceModel} from "../../datasource/model/datasourceModel";
import {DataPointModel} from "../../core/models/dataPoint";
import {HttpSenderService} from '../service/publisher.service';
import {Sort} from "@angular/material/sort";
import {CopyPublisherComponent} from "../components/copy-publisher/copy-publisher.component";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';
import { DatapointsListComponent } from '../datapoints-list/datapoints-list.component';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, DatapointsListComponent, PublisherEditComponent, HelpModalComponent],
  providers:[HttpSenderService, PublisherService, DictionaryService, CommonService],
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: []
})
export class PublisherListComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit {
  errorMsg!: string;
  publisherModules!: ModuleDefinitionModel[];
  info = new commonHelp();
  publisherDetail: any;
  publisherHelpTitle = 'Publisher';
  publishers!: AbstractPublisherModel<any>[];
  searchPublisher: any;
  @ViewChild('publisherSideNav') public publisherSideNav!: MatSidenav;
  @ViewChild(PublisherEditComponent, {static: true}) private publisherEditComponent!: PublisherEditComponent;
  totalPublisher!: number;
  deleteAllButtons!: boolean;
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [10, 12, 16, 20];
  status = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['select', 'position', 'name', 'enable',  'actions'];
  dataSources:any = new MatTableDataSource<DatasourceModel>();
  selection: any = new SelectionModel<string>(true, []);
  sortingType = 'default';
  enableMessage = 'Enable Successfully';
  disableMessage= 'Disable Successfully';
  deleteMsg = "Delete Successfully";
  private sortingProperty!: string;
  UIDICTIONARY : any;

  constructor(
    private _service: PublisherService,
    public dictionaryService: DictionaryService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private abstractPublished:HttpSenderService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('publisher').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    // const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getPublisherType();
    const savedPageIndex = localStorage.getItem('currentPageIndex');
    const savedPageSize = localStorage.getItem('currentPageSize');


    if (savedPageIndex !== null && savedPageSize !== null) {
      this.limit = +savedPageSize;
      this.offset = +savedPageIndex * +savedPageSize;
     const param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getAllPublisher(param);
    }else {
      let param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getAllPublisher(param);
    }
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


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSources.length;
    return numSelected === numRows;
  }

  isChecked(node: any): boolean {
    return this.selection.isSelected(node.xid);
  }

  addDataPointXid(event: any, dataPoint: any) {
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
    this.dataSources.forEach((value:any) =>
      this.selection.select(value.xid));
    this.deleteAllButtons = true;
  }


  sidebarclose(publisherSideNav: any) {
    publisherSideNav.close();
  }

  getPublisherType() {
    this.subs.add(this._service.getTypes().subscribe((data: any) => {
      this.publisherModules = [];
      this.publisherModules = data;
    }));
  }

  getAllPublisher(param: string) {
    this.subs.add(this.abstractPublished.get(param).subscribe(data => {

      if (data) {
        this.commonService.hideloader();
      }
      this.totalPublisher = this.abstractPublished.total;
      this.publishers = data;
      this.dataSources = data;
      const savedPageIndex = localStorage.getItem('currentPageIndex');
      const savedPageSize = localStorage.getItem('currentPageSize');
      if (savedPageIndex !== null && savedPageSize !== null) {
        this.paginator.pageIndex = +savedPageIndex;
        this.paginator.pageSize = +savedPageSize;
        this.dataSources.paginator = this.paginator;
      }else {
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = 10;
        this.dataSources.paginator = this.paginator;
      }

    }, err => this.errorMsg = err));
  }

  addPublisher(event: any, publisherType: any) {
    if (event.source.selected) {

      if (publisherType === 'BACNET_SENDER.PUB') {
        this.status = true;
        let someElement = document.getElementById('increaseValue')!;
        someElement.className += ' publisherClass';
      } else if (publisherType !== 'BACNET_SENDER.PUB') {
        let someElement = document.getElementById('increaseValue')!;
        someElement.classList.remove('publisherClass');
      }
      this.publisherSideNav.open();
      this.publisherEditComponent.addPublisher(publisherType);

    }
  }

  changePublisherStatus(element: any, event: any) {
    const param = 'enabled=' + element.enabled + '&restart=' + element.enabled;
    this.subs.add(this.abstractPublished.enableDisable(element.xid, param).subscribe(data=>{
    }));
    element.enabled===true?this.commonService.notification(this.enableMessage)
      :this.commonService.notification(this.disableMessage)
  }

  showPublisherDetails(publisher: any) {
    this.publisherSideNav.open();
    this.publisherDetail = publisher;
    this.publisherEditComponent.getPublisher(publisher, true);
  }

  deletePublisher(publisher: any) {
    this.subs.add(
      this.commonService.openConfirmDialog('Are you want to delete ', publisher.name).afterClosed()
        .subscribe(response => {
          if (response) {
            this.abstractPublished.delete(publisher.xid).subscribe(data => {
              const param = 'limit(' + this.limit + ',' + this.offset + ')';
              this.getAllPublisher(param);
              this.commonService.notification(this.deleteMsg);
            });
          }
        }));
  }

  publisherSavedAction(event:any) {
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getAllPublisher(param);
    this.publisherSideNav.close();
  }

  publisherUpdateAction(event: any) {
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getAllPublisher(param);
    this.publisherSideNav.close();
  }

  publisherHelpModel() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'publisherHelpTitle', content: this.info.htmlPermissionHelp},
      disableClose: true
    });
  }

  filterPublisher(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchPublisher) {
        const param = 'like(name,%2A' + this.searchPublisher + '%2A)';
        this.subs.add(this.abstractPublished.get(param).subscribe(data => {
          this.publishers = data;
          this.dataSources = data;
        }));
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getAllPublisher(param);
      }
    }
  }


  getPublisherNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';

    localStorage.setItem("param", param);
    localStorage.setItem('currentPageIndex', event.pageIndex.toString());
    localStorage.setItem('currentPageSize', event.pageSize.toString());
    this.getAllPublisher(param);
    localStorage.setItem("param", param);
  }
  copyPublishers(event: any) {
    this.dialog.open(CopyPublisherComponent, {
      data: {copyDataPub: event},
      disableClose: true,
      panelClass:['copyPublisher'],

    }).afterClosed()
      .subscribe((response) => {
        if (response) {
          const param = 'limit(' + this.limit + ',' + this.offset + ')';
          this.getAllPublisher(param);
        }
      });


  }


  sortingData(sort: Sort) {
    const data = this.dataSources.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSources = data;
      return;
    }
    this.dataSources = data.sort((a: any, b: any) => {
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

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  refreshItemData(){
    let param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getAllPublisher(param);
  }

}



