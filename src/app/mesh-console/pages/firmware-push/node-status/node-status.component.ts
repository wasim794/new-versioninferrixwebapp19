import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog} from "@angular/material/dialog";
import {CommonService} from '../../../../services/common.service';
import {MeshOtaService} from '../../../shared/services';
import {ConfigurationService} from '../../../../services/configuration.service';
import {WebsocketService} from '../../../../core/services'
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {CheckStatusComponent} from './check-status/check-status.component';
import {ScratchpadactionComponent} from './scratchpadaction/scratchpadaction.component';
import { DictionaryService } from "../../../../core/services/dictionary.service";
import {ACTIONSNODESTATUS} from "./shared";
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers: [ DictionaryService, CommonService, ConfigurationService, WebsocketService, MeshOtaService],
  selector: 'app-node-status',
  templateUrl: './node-status.component.html',
  styleUrls: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class NodeStatusComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  websocket_URL = '/mesh-scratchpad-status?token=';
  websocket: any;
  token: any;
  displayedColumnsResponse: string[] = ['nodeType', 'address', 'timestamp','storedScratchpadLength', 'storedScratchpadCrc', 'storedScratchpadSequenceNumber', 'storedScratchpadType',
    'storedScratchpadStatus', 'processedScratchpadLength','processedScratchpadCrc','processedScratchpadSequenceNumber','processedFirmwareAreaId',
    'firmwareVersion','applicationProcessedScratchPadLength','applicationProcessedScratchPadCrc','applicationProcessedScratchPadSequenceNumber',
    'applicationProcessedApplicationAreaId','applicationVersion','action','targetSequence','targetCrc','processingDelay','remainingDelay'];
  dataSource:any;
  limit = 5;
  offset = 0;
  divHidden!:boolean;
  sequenceNumbersAll!:boolean;
  notSequenceNumbersAll!:boolean;
  sequenceNumbersAllActions!:boolean;
  sequenceNumbersAllMatchActions!:boolean;
  sequenceNumbersAllMatch!:boolean;
  notSequenceNumbersAllMatch!:boolean;
  filterNotSequenceNumbersMatch!:boolean;
  notSequenceNumbersMatch:any;
  sequenceActionsMatch:any;
  filterSequenceNumbersMatch!:boolean;
  filterDropdownMatch!:boolean;
  sequenceNumbersMacth:any;
  pageSizeOptions: number[] = [5, 12, 16, 20];
  startMsg:any;
  stopMsg:any;
  conditionFalse!:boolean;
  conditionTrue!:boolean;
  conditionFalseOtap!:boolean;
  actionMethod="Mesh scratchpad update request sent";
  names:any;
  numberAll:boolean =false;
  @ViewChild(MatPaginatorModule) paginator!: MatPaginatorModule;
  sequenceNumbers:any;
  sequenceActions:any;
  filterSequenceNumbers!:boolean;
  filterDropdown!:boolean;
  filterNotSequenceNumbers!:boolean;
  matchActionsButton!: boolean;
  notEqual:boolean=true;
  ACTIONSNODESTATUS=ACTIONSNODESTATUS;
  notSequenceNumbers:any;
  UIDICTIONARY : any;
  constructor(private dialog: MatDialog, public commonService: CommonService, private _configurationService: ConfigurationService,
              public meshOtaService: MeshOtaService,
              private _WebSocketService: WebsocketService,
              public dictionaryService: DictionaryService, private location: Location) {
    super();
    this.token = (localStorage.getItem('access_token'));
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getNodeStatus(param);

  }

  getWebSocket() {
    this._configurationService.connect(event);
    this._WebSocketService.subscribeWebsocket().subscribe(data => {
      const parseData = JSON.parse(data);
      parseData.payload.object.legacyUpdate===false?this.conditionFalse=true:this.conditionTrue=true;
      this.divHidden=true;
      if(this.names===undefined){
        this.getStatus();
      }else{
        this.getNodeStatus(this.names);
      }

    });
    }

  getNodeStatus(param: string): void {
    this.subs.add(this.meshOtaService.nodeStatus(param).subscribe((data) => {
      this.dataSource = data;
      this.divHidden = true;
      this.conditionFalse = true;
    }));
  }

  getNextPage(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getNodeStatus(param);
  }

  scratchPadStart(){
    this.subs.add(this.meshOtaService.scratchpadStatusCollectionStart().subscribe((data) => {
      this.startMsg = data;
      this.commonService.notification(this.startMsg);
      this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
      this.getWebSocket();

    }));
  }
  scratchPadStop(){
    this.subs.add(this.meshOtaService.scratchpadStatusCollectionStop().subscribe((data) => {
      this.stopMsg = data;
      this.commonService.notification(this.stopMsg);
    }));
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let param;
    if (filterValue.length)
      this.names = 'like(address,%2A' + filterValue + '%2A)';

    else
      this.names = 'limit(' + this.limit + ',' + this.offset + ')&sort(+address)'
    this.getNodeStatus(this.names);

  }

  checkStatus(){
    this.conditionFalseOtap=false;
    const dialogRef = this.dialog.open(CheckStatusComponent, {
      data: {data: event,},
      width: '1200px',
      height: '400px',
      disableClose: true,
      panelClass:['checkStatusModel']
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  applyFilterSequenceNumber(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let param;
    if (filterValue.length)
      this.names = 'like(applicationProcessedScratchPadSequenceNumber,%2A' + filterValue + '%2A)';

    else
      this.names = 'limit(' + this.limit + ',' + this.offset + ')&sort(+applicationProcessedScratchPadSequenceNumber)'
    this.getNodeStatus(this.names);
  }

  applyFilterActions(event: any) {
    if (event.source.selected) {
      const filterValue = event.source.value;
      let param;
      if (filterValue.length) {
        this.names = 'like(action,%2A' + filterValue + '%2A)';
        this.getNodeStatus(this.names);
      } else {
        this.getNextPage(event);
        this.names = 'limit(' + this.limit + ',' + this.offset + ')&sort(+action)'
        this.getNodeStatus(this.names);
      }
    }
  }

  applyFilterActionsMatch(event: any) {
    if (event.source.selected) {
      const filterValue = event.source.value;
      this.sequenceActionsMatch = filterValue;
    }
  }

  filerNotEqualSequenceNumber(event: any){
      this.dataSource = this.dataSource.filter((item: any) => item.data.applicationProcessedScratchPadSequenceNumber !== parseInt(this.notSequenceNumbers));
}

  filerNotEqualActions(event: any) {
    this.numberAll = true;
    if (event.checked) {
      this.dataSource = this.dataSource.filter((item: any) => item.data.action !== this.sequenceActions);
    } else {
      this.numberAll = false;
    }
  }


  getStatus(){
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getNodeStatus(param);
  }
  updateAllNode(){
    this.subs.add(this.meshOtaService.updateSinkScratchpad().subscribe((data) => {
      this.startMsg = data.confirmMessage.message;
      this.commonService.notification(this.startMsg);
    }));
  }

  /*New Condition Start Here*/

  allActions(event: any) {
    const dialogRef = this.dialog.open(ScratchpadactionComponent, {
      data: {data: event,},
      disableClose: true,
      panelClass: ['modelAction']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.commonService.notification(this.actionMethod);
        this.getWebSocket();
      }
    });
  }

  updateLegacy(event: any){
    const dialogRef = this.dialog.open(ScratchpadactionComponent, {
      data: {data: event,},
      disableClose: true,
      panelClass: ['modelAction']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.commonService.notification(this.actionMethod);
        this.getWebSocket();
      }
    });
  }

  sequenceNumbersFunction(){
    this.hideAllActionsButtonsEnabled();
    this.filterSequenceNumbers = true;
  }

  notSequenceNumbersFunction(){
    this.hideAllActionsButtonsEnabled();
    this.filterNotSequenceNumbers = true;
  }

  SequenceActionsFunction(){
    this.hideAllActionsButtonsEnabled();
    this.filterDropdown = true;
  }

  hideAllActionsButtonsEnabled(){
    this.sequenceNumbersAll=true;
    this.notSequenceNumbersAll=true;
    this.sequenceNumbersAllActions=true;
    this.sequenceNumbersAllMatchActions=true;
  }

  hideAllActionsButtonsDisabled(){
    this.sequenceNumbersAll=false;
    this.notSequenceNumbersAll=false;
    this.sequenceNumbersAllActions=false;
    this.sequenceNumbersAllMatchActions=false;
    this.sequenceNumbersAllMatch=false;
    this.notSequenceNumbersAllMatch=false;
    this.filterDropdownMatch = false;
    this.filterNotSequenceNumbersMatch = false;
    this.filterSequenceNumbersMatch = false;
    this.matchActionsButton = false;
    this.sequenceNumbersMacth="";
    this.notSequenceNumbersMatch="";
    this.sequenceActionsMatch = "";
  }

  hideAllInputsFields(){
    this.filterSequenceNumbers=false;
    this.filterDropdown=false;
    this.filterNotSequenceNumbers=false;
  }

  matchActions(){
    this.hideAllActionsButtonsEnabled();
    this.filterDropdownMatch=true;
    this.sequenceNumbersAllMatch = true;
    this.notSequenceNumbersAllMatch =true;
  }

  matchActionsDisable(){
    this.sequenceNumbersAllMatch=false;
    this.notSequenceNumbersAllMatch=false;
  }

  matchActionsEnable(){
    this.sequenceNumbersAllMatch=true;
    this.notSequenceNumbersAllMatch=true;
  }
  matchSequenceNumber(){
    this.matchActionsDisable();
    this.filterSequenceNumbersMatch = true;
    this.matchActionsButton = true;
  }
  matchNotSequenceNumber(){
    this.matchActionsDisable();
 this.filterNotSequenceNumbersMatch = true;
    this.matchActionsButton = true;
  }


  searchData() {
    if (this.sequenceNumbersMacth){
      this.dataSource = this.dataSource.filter((item:any) => item.data.applicationProcessedScratchPadSequenceNumber == this.sequenceNumbersMacth && item.data.action == this.sequenceActionsMatch);
  }else {
      this.dataSource = this.dataSource.filter((item:any) =>
        item.data.applicationProcessedScratchPadSequenceNumber !== parseInt(this.notSequenceNumbersMatch) &&
        item.data.action !== parseInt(this.sequenceActionsMatch)
      );

    }
  }


  clearAll(){
    this.hideAllActionsButtonsDisabled();
    this.hideAllInputsFields();
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getNodeStatus(param);
  }

  goBack() {
    this.location.back();
  }


}
