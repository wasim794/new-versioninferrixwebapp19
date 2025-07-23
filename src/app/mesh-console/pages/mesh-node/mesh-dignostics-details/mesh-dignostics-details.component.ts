import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {FormGroup, FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MeshDiagnosticDataService} from '../../../shared/services';
import {CommonService} from '../../../../services/common.service';
import {DignosticsSomeDataComponent} from './dignostics-some-data/dignostics-some-data.component';
@Component({
  selector: 'app-mesh-dignostics-details',
  templateUrl: './mesh-dignostics-details.component.html'
})
export class MeshDignosticsDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  dataColumns: string[] = ['address', 'timestamp', 'nodeType', 'bootData', 'role', 'voltage',
    'bufferUsage', 'memoryAllocationFailures', 'packetsDropped', 'cbmacDetails',
    'cbmac', 'nextHopDetails','cfmac', 'networkScansAmount', 'sleepTime',
    'installationQuality', 'droppedUnackBcsPacket','unackBroadCastChannel','wbnRssiCorrectionVal','networkChannelPer','ccaLimitDbm',
    'addressClashes','nborDeviceInfo','clusterChannel','clusterChannelReliability','event','blacklistedChannelAmount','traceOptions',
    'cbmacUnicastMembersPending','cbmacBlacklistingChannels41ToMax','llDeviceCountInRadioRange','clusterMemberAmount','clusterRouterAmount','scanTotalTime','bleScannerActive','costComp','joiningBeaconActive','floodingPacketsAmount'
    ,'ftdmaTable','droppedReassemblyPacket'];
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  dataSource : any = [];
  firstData:boolean;
  secondData:boolean;
  filterButton:boolean;
  filterButtonTwo:boolean;
  XID:any;
  dateFrom = new Date();
  dateTo = new Date();
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 12, 16, 20];
  numbers: number;
  UIDICTIONARY : any;

  constructor(private route: ActivatedRoute, private router: Router, public dictionaryService: DictionaryService,
              private meshDiagnostic:MeshDiagnosticDataService,private dialog: MatDialog, private _commonService: CommonService) {super(); }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
   this.getAndReturnUrl();
  }

  private getAndReturnUrl(){
    const urlID = this.route.snapshot.paramMap.get('id');
    this.XID = urlID;
    this.getDetail(urlID, this.numbers);
  }

  private getDetail(xid, number){
    this.subs.add(this.meshDiagnostic.getLatestDiagnosticsData(xid, number).subscribe(data=>{
      this.dataSource = data;
    }))
  }

  handleWheelScroll(event: WheelEvent, container: HTMLElement): void {
    // Adjust the scrollLeft property of the container based on the horizontal scroll direction
    if (container) {
      container.scrollLeft += event.deltaY;
    }
    // Prevent the default scroll behavior to avoid interference
    event.preventDefault();
  }
  scrollTable(direction: 'left' | 'right'): void {
    const table = document.getElementById('scrollingTables') as HTMLTableElement;
    const container = document.querySelector('.meshConsoleTables') as HTMLElement;

    if (direction === 'left') {
      container.scrollLeft -= 100; // Adjust the scroll distance as needed
    } else if (direction === 'right') {
      container.scrollLeft += 100; // Adjust the scroll distance as needed
    }

    // Add the event listener outside the function
    container?.addEventListener("wheel", (event: WheelEvent) => this.handleWheelScroll(event, container));
  }

  showHide(event){
    if(event==='dateFilter'){
    this.firstData = true;
    this.filterButton = true;
    this.filterButtonTwo= true;
    } else if(event==='searchFilter'){
      this.firstData = false
      this.secondData = true;
      this.filterButton = true;
      this.filterButtonTwo= true;
    }
  }

  closeThisFunction(){
     this.firstData = false;
     this.secondData = false;
     this.filterButtonTwo = false;
     this.filterButton = false;
     this.getAndReturnUrl();
  }

  applyFilter(event){
   this.getDetail(this.XID, this.numbers)
  }

  // Function to implement date-wise search logic
  searchByDate() {
    const epochDateFrom = this.getEpochTimestamp(this.dateFrom, this._commonService.fromTime);
    const epochDateTo = this.getEpochTimestamp(this.dateTo, this._commonService.toTime);
    this.subs.add(
      this.meshDiagnostic
        .getDiagnosticsDataBetween(this.XID, epochDateFrom, epochDateTo)
        .subscribe(data => {
          this.dataSource = data;
        })
    );
  }

  private getEpochTimestamp(date: Date, time: Date): number {
    return Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(),
      time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()
    );
  }

  getTooltipText(item: any, nodeData: any): any {
    // Construct the tooltip content based on item properties
    this.dialog.open(DignosticsSomeDataComponent, {
      data: {dignosticsData: item, 'dataName': nodeData}
    });
  }


}
