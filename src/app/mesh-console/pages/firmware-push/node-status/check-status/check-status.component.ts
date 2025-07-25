import { Component, OnInit } from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {MeshOtaService} from '../../../../shared/services';
import { DictionaryService } from "../../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';

@Component({
  standalone:true,
  imports:[ CommonModule, MatModuleModule],
  providers: [ DictionaryService, MeshOtaService],
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: []
})
export class CheckStatusComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['messageType', 'message', 'scratchPadLengthInBytes','scratchPadCrc', 'scratchPadSequenceNumber', 'scratchPadType', 'scratchPadStatus',
    'processedScratchPadLengthInBytes', 'processedScratchPadCrc','processedScratchPadSequenceNumber','firmwareMemoryAreaId','firmwareMajorVersion',
    'firmwareMinorVersion','firmwareMaintenanceVersion','firmwareDevelopmentVersion'];
  dataSource: any=[];
  limit = 5;
  offset = 0;
  pageSizeOptions: number[] = [5, 12, 16, 20];
  UIDICTIONARY : any;

  constructor( public meshOtaService: MeshOtaService,public dictionaryService: DictionaryService,) { super();}

  ngOnInit(): void {
   this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
    this.UIDICTIONARY= this.dictionaryService.uiDictionary;
     });
    this.getNodeStatus();

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
    const container = document.querySelector('.checkStatus') as HTMLElement;

    if (direction === 'left') {
      container.scrollLeft -= 100; // Adjust the scroll distance as needed
    } else if (direction === 'right') {
      container.scrollLeft += 100; // Adjust the scroll distance as needed
    }

    // Add the event listener outside the function
    container?.addEventListener("wheel", (event: WheelEvent) => this.handleWheelScroll(event, container));
  }
  getNodeStatus(): void {
    this.subs.add(this.meshOtaService.getSinkFirmwareStatus().subscribe((data) => {
      const arrayData = [];
      arrayData.push(data);
      this.dataSource = arrayData;
    }));
  }

}
