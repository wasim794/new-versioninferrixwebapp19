import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, inject, Injector, EnvironmentInjector } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WatchlistService } from '../service';
import { ConfigurationService } from '../../services/configuration.service';
import { WatchList, WatchListPointModel } from '../../watchlist';
import { ObservableWebSocketService } from '../../core/services';
import { commonHelp } from '../../help/commonHelp';
import { CommonService } from '../../services/common.service';
import { MatSidenavModule, MatSidenav, MatDrawer } from '@angular/material/sidenav';
import { HelpModalComponent } from '../../help/help-modal/help-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from '../../common';
import { DictionaryService } from "../../core/services/dictionary.service";
import { MatModuleModule } from '../../common/mat-module';
import { WatchlistEditComponent } from '../../watchlist/watchlist-edit/watchlist-edit.component';
import { WatchlistDataPointListComponent } from '../../watchlist/watchlist-data-point-list/watchlist-data-point-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    MatModuleModule,
    MatSidenavModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    WatchlistEditComponent
  ],
  providers: [CommonService, ConfigurationService, WatchlistService, ObservableWebSocketService],
  selector: 'app-watchlist-list',
  templateUrl: './watchlist-list.component.html',
  styleUrls: []
})
export class WatchlistListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(WatchlistEditComponent)
  private watchlistEditComponent!: WatchlistEditComponent;
  watchListXid!: string;
  watchLists: any = new WatchList();
  private watchList = new WatchList();
  selectedItems: WatchListPointModel[] = [];
  watchListName!: string;
  errorMsg!: string;
  websocket_URL = '/point-value?token=';
  token!: string | null;
  dataPointData: any;
  info = new commonHelp();
  buttons!: boolean;
  dataPoints: WatchListPointModel[] = [];
  allDataPoints: any[] = [];
  watchlistData: any;
  status: any;
  watchListLimit = 12;
  offset = 0;
  totalWatchlist: any;
  pageSizeOptions: number[] = [12, 16, 20];
  deleteWatchlist: any;
  endDate!: string;
  isSticky: boolean = false;
  public DictionaryUI: any;
  UIDICTIONARY: any;

  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  @ViewChild('watchlist_drawer')
  public watchsidenav!: MatSidenav;
  @ViewChild('watchlist_drawer_data_points')
  public watchsidenavtwo!: MatDrawer;
  private componentRef: any;
  searchWatchList: any;
  submitMsg = "Submit successfully";
  updateMsg = "Update successfully";
  private deleteMsg = "delete successfully";

  private watchlistService = inject(WatchlistService);
  private _configurationService = inject(ConfigurationService);
  private observableWebSocketService = inject(ObservableWebSocketService);
  private router = inject(Router);
  private commonService = inject(CommonService);
  public dictionaryService = inject(DictionaryService);
  private dialog = inject(MatDialog);
  // private resolver = inject(ComponentFactoryResolver);

  constructor() {
    super();
    this.token = JSON.parse(localStorage.getItem('access_token')!).token;
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('watchlist').subscribe(data => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getWatchList(this.watchListLimit, this.offset);
  }

  sidebarclose(watchsidenav: MatDrawer) {
    watchsidenav.close();
  }

  sidebarclosetwo(watchsidenavtwo: MatDrawer) {
    watchsidenavtwo.close();
  }

  getNext(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getWatchList(limit, this.offset);
  }

  getWatchList(watchListLimit: number, offSet: number) {
    this.subs.add(this.watchlistService.getWatchLists(watchListLimit, offSet).subscribe(data => {
      if (data) {
        this.commonService.hideloader();
      }
      this.watchLists = data;
      this.totalWatchlist = data;
      console.log(this.watchLists);
    }, err => this.errorMsg = err
    ));
  }

  updatedListAfterSave(watchList: WatchList) {
    this.commonService.notification(this.submitMsg);
    this.watchsidenav.close().then(r => console.log(r));
    this.watchLists.push(watchList);
  }

  updatedListAfterUpdate(watchList: WatchList) {
    this.commonService.notification(this.updateMsg);
    this.watchsidenav.close().then(r => console.log(r));
    const updateItem = this.watchLists.find((x: { xid: string; }) => x.xid === watchList.xid);
    const index = this.watchLists.indexOf(updateItem);
    this.watchLists[index] = watchList;
  }

  watchlistPoints(watchListXid: string, watchlist_drawer_data_points: MatDrawer) {
    // With standalone, accessing child component via @ViewChild might not be the best approach
    // Consider using a service or shared state if WatchlistEditComponent needs to interact
    this.watchlistEditComponent.watchListXid = watchListXid;
    watchlist_drawer_data_points.open();
    this.watchListXid = watchListXid;
    this.subs.add(this.watchlistService.getWatchListData(watchListXid).subscribe(data => {
      this.watchlistData = data;
      this.watchListName = this.watchlistData.name;
      this.createComponent();
    }));
  }

  /** Method for creating the component dynamically */
  createComponent() {
    this.entry.clear();
    this.componentRef = this.entry.createComponent(WatchlistDataPointListComponent, {
      // Optional: Provide the injector of the ViewContainerRef.
      // This allows the dynamically created component to access providers from the parent component's injector scope.
      injector: this.entry.injector,
      });
    this.componentRef.instance.isWatchlist = true;
    this.componentRef.instance.watchList = this.watchlistData;
    this.componentRef.instance.watchListXid = this.watchListXid;
    this.componentRef.instance.saveModel.subscribe((results: any) => {
      this.watchsidenavtwo.close().then((r: any) => console.log(r));
    });
  }

  getSelectedPoints(dataPoints: WatchListPointModel[]) {
    this.dataPoints = this.allDataPoints.filter(({ xid: id1 }) => !dataPoints.some(({ xid: id2 }) => id2 === id1));
    this.selectedItems = [];
    dataPoints.forEach((element) => {
      this.selectedItems.push(element);
      this.updatedData(element.xid);
    });
  }

  updatedData(xid: any) {
    const message = { 'dataPointXid': xid, 'eventTypes': ['CHANGE', 'UPDATE'] };
    this._configurationService.connect(message);
    this.subs.add(this.observableWebSocketService.createObservableWebSocket(this.websocket_URL + this.token).subscribe(data => {
      this.dataPointData = JSON.parse(data);
      if (this.dataPointData?.payload?.value != null) {
        const date = new Date(this.dataPointData.payload.value.timestamp);
        this.endDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        this.status = this.dataPointData.payload.value.value;
      } else {
        this.endDate = 'No Record';
        this.status = 'No Record';
      }
      const dp_xid = this.dataPointData.payload.xid;
      this.updateTable(dp_xid, this.status, this.endDate);
    }));
  }

  updateTable(xid: any, status: any, time: string) {
    setTimeout(function () {
      // (<any>$('.text-shadow')).removeClass('text-shadow');
    }, 3000);
  }

  deleteWatchList(watchlist: WatchList): void {
    this.deleteWatchlist = watchlist;
    this.watchListName = watchlist.name;
    this.commonService.openConfirmDialog('Are you want to delete ', this.watchListName).afterClosed().subscribe((response: any) => {
      if (response) {
        this.watchlistService.deleteWatchList(this.deleteWatchlist.xid).subscribe(data => {
          this.watchLists = this.watchLists.filter((h: any) => h !== this.deleteWatchlist);
          this.commonService.notification(this.deleteMsg);
        });
      }
    });
  }

  editWatchList(xid: any) {
    this.watchlistEditComponent.showWatchListDetail(xid);
    this.buttons = false;
    // this.commonService['hideInputFalse']();
    this.watchsidenav.open().then(r => console.log(r));
  }

  addNewWatchlist() {
    this.buttons = true;
    // this.commonService['hideInputTrue']();
    this.watchlistEditComponent.resetWatchList();
    this.watchsidenav.open().then(r => console.log(r));
  }

  deleteDataPoint(dataPoint: WatchListPointModel): void {
    this.dataPoints.push(dataPoint);
    const dp = [dataPoint];
    this.selectedItems = this.selectedItems.filter(h => h !== dataPoint);
    this.subs.add(this.watchlistService.deleteDataPoint(dp, this.watchListXid).subscribe());
  }

  dataPointDetails(xId: any) {
    // (<any>$('#watchlistPointsModal')).modal('hide');
    // (document.getElementById('watchlistPointsModal') as HTMLElement).modal('hide');
    const modalElement = document.getElementById('watchlistPointsModal') as HTMLDivElement | null;
    if (modalElement) {
      const modal = (modalElement as any); // Type assertion to 'any' to access Bootstrap's modal method
      if (typeof modal.modal === 'function') {
        modal.modal('hide');
      } else {
        console.warn('Bootstrap modal function not found on the element.');
      }
    } else {
      console.warn('Element with ID "watchlistPointsModal" not found.');
    }
    localStorage.setItem('dpXid', xId);
    this.router.navigate(['/datapoint/detail']).then(r => console.log(r));
  }

  watchListHelp() {
    this.dialog.open(HelpModalComponent, {
      data: { title: 'Watchlist', content: this.info.htmlDataHelp },
      disableClose: true
    });
  }

  filterWatchList() {
    if (this.searchWatchList) {
      this.subs.add(this.watchlistService.filterWatchList(this.searchWatchList).subscribe(data => {
        this.watchLists = data;
      }));
    } else {
      this.getWatchList(this.watchListLimit, this.offset);
    }
  }
}