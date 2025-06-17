import {Component, OnInit} from '@angular/core';
import {StackMonitorService} from './service';
import {StackMonitorData} from './model';
import {MatDialog} from '@angular/material/dialog';
import {StackDataAllComponent} from './stack-data-all';
import {staticAllData} from './shareFile';
import {UnsubscribeOnDestroyAdapter} from '../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, StackDataAllComponent],
  providers: [StackMonitorService, DictionaryService],
  selector: 'app-stack-monitor',
  templateUrl: './stack-monitor.component.html',
  styleUrls: []
})
export class StackMonitorComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  private errorMsg: any;
  showBox:boolean = true;
  public StaticAllData: staticAllData = new staticAllData();
  stackMonitors: StackMonitorData[] = [];
  stackWirelessQualities: StackMonitorData[] = [];
  systemMetrics: StackMonitorData[] = [];
  jvmMetrics: StackMonitorData[] = [];
  stackDbMetrics: StackMonitorData[] = [];
  stackThreadMetrics: StackMonitorData[] = [];


  constructor(private stackMonitorService: StackMonitorService, private dialog: MatDialog, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
    this.stackInformation();
    this.dictionaryService.getUIDictionary('stackMonitor').subscribe(data=>{
        data=== undefined ?this.showBox = false:'';
    });
  }


  showValue(event: any) {
    this.dialog.open(StackDataAllComponent, {
      data: {stackAllData: event,},
      width: '600px',
      disableClose: true
    });
  }

  private stackInformation() {
    this.StaticAllData.stackMonitorIds.forEach(stackMonitorId => {
      this.subs.add(this.stackMonitorService.getStackMonitorById(stackMonitorId).subscribe(data => {
        this.stackMonitors.push(data);
      }, err => this.errorMsg = err));
    });

    this.StaticAllData.stackThreadMetricsIds.forEach(stackWirelessQualityId => {
      this.subs.add(this.stackMonitorService.getStackWirelessQualityById(stackWirelessQualityId).subscribe(data => {
        this.stackWirelessQualities.push(data);
      }, err => this.errorMsg = err));
    });

    this.StaticAllData.systemMetricsIds.forEach(stackProcessorUtilizationId => {
      this.subs.add(this.stackMonitorService.getStackProcessorUtilizationById(stackProcessorUtilizationId).subscribe(data => {
        this.systemMetrics.push(data);
      }, err => this.errorMsg = err));
    });
    //
    this.StaticAllData.jvmMemoryIds.forEach(stackMemoryId => {
      this.subs.add(this.stackMonitorService.getStackMemoryById(stackMemoryId).subscribe(data => {
        this.jvmMetrics.push(data);
      }, err => this.errorMsg = err));
    });

    this.StaticAllData.stackDataBaseIds.forEach(stackDataBaseId => {
      this.subs.add(this.stackMonitorService.getStackDataBaseById(stackDataBaseId).subscribe(data => {
        this.stackDbMetrics.push(data);
      }, err => this.errorMsg = err));
    });

    this.StaticAllData.stackThreadMetricsIds.forEach(stackThreadPriorityId => {
      this.subs.add(this.stackMonitorService.getStackThreadPriorityById(stackThreadPriorityId).subscribe(data => {
        this.stackThreadMetrics.push(data);
      }, err => this.errorMsg = err));
    });
  }
}
