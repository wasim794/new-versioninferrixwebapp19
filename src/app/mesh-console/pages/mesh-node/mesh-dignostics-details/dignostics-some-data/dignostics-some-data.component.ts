import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DictionaryService} from "../../../../../core/services/dictionary.service";

@Component({
  selector: 'app-dignostics-some-data',
  templateUrl: './dignostics-some-data.component.html'
})



export class DignosticsSomeDataComponent implements OnInit {
  dataCbmacDetails:boolean=false;
  bootDataDetails:boolean=false;
  cbmacDataDetails:boolean=false;
  nextDataDetails:boolean=false;
  cfmacDataDetails:boolean=false;
  buttons:boolean=false;
  dataAll:any;
  arrays:any;
  public nborDeviceInfoDetails: boolean=false;
  public eventDetails: boolean=false;
  public costCompDetails: boolean=false;
  public ftdmaTableDetail: boolean=false;
  public eventsData:any;
  UIDICTIONARY : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dictionaryService: DictionaryService,) { }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.dataAll = this.data.dignosticsData;
    this.dataHideShow();
  }
 private dataHideShow(){
   if (this.data.dataName === 'cbmacDetails') {
     this.dataCbmacDetails = true;
   } else if (this.data.dataName === 'bootData') {
     this.bootDataDetails = true;
     this.buttons = true;
   }
   else if(this.data.dataName === 'Cbmac'){
     this.cbmacDataDetails = true;
     this.buttons = true;
   }
   else if(this.data.dataName==='nextHopDetails'){
     this.nextDataDetails = true;
   }
   else if(this.data.dataName=== 'cfmac'){
     this.cfmacDataDetails = true;
   }
   else if(this.data.dataName === 'nborDeviceInfo'){
     this.nborDeviceInfoDetails = true;
   }
   else if(this.data.dataName === 'event'){
     this.eventDetails = true;
     this.eventsData = this.dataAll.diagnosticsData;
     this.arrays = Object.entries(this.eventsData.events);
   }
   else if(this.data.dataName === 'costComp'){
     this.costCompDetails = true;
   }
   else if(this.data.dataName === 'ftdmaTable'){
     this.ftdmaTableDetail = true;
   }
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
    const table = document.getElementById('scrollingTable') as HTMLTableElement;
    const container = document.querySelector('.scrollTable') as HTMLElement;

    if (direction === 'left') {
      container.scrollLeft -= 100; // Adjust the scroll distance as needed
    } else if (direction === 'right') {
      container.scrollLeft += 100; // Adjust the scroll distance as needed
    }

    // Add the event listener outside the function
    container?.addEventListener("wheel", (event: WheelEvent) => this.handleWheelScroll(event, container));
  }

}
