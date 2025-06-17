import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpModalComponent } from '../help/help-modal/help-modal.component';
import {UnsubscribeOnDestroyAdapter} from '../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DeviceService} from './service/devices.service';
import {chillerDataModel} from './model/deviceModel';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DeviceService],
  selector: 'app-device-management-system',
  templateUrl: './device-management-system.component.html',
  styleUrls: ['./device-management-system.component.scss']
})
export class DeviceManagementSystemComponent extends  UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {
  fanStatus!:boolean;
  fanStatus1!:boolean;
  private timeoutId: any;
  titleContent=30;
  chillerData1:any = new chillerDataModel();
  chillerData2:any = new chillerDataModel();
  private lastTriggerTime: any;
  private readonly holdTimeMs: number = 1120224; // 5 minutes in ms
  private readonly threshold: number = 2; // ±5°C threshold
  private readonly callback!: () => void;
  constructor(private dialog: MatDialog, private deviceServices: DeviceService,
             ) {
    super();
  }

  ngOnInit(): void {
    this.getDataAll();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subs.unsubscribe();
  }









  getDataAll(){
    this.subs.add(this.deviceServices.getData().subscribe(data=>{
      this.chillerData1 = data.chillersData;
      this.chillerData2 = data;
      console.log(this.chillerData2);
      data.chillersData.forEach((items: { dataname: string; fanStatus: boolean; tmp: any; setpoint: any; load: any; })=>{
        if((items.dataname == 'Chiller 1') && (items.fanStatus==true)){
          this.chillerData1 = items;
          this.fanStatus = items.fanStatus;
          this.updateCon(items.tmp, items.setpoint, items.load);
        }else if((items.dataname == 'Chiller 2') && (items.fanStatus==true)){
          this.chillerData2 = items;
          this.fanStatus1 = items.fanStatus;
          this.updateCon(items.tmp, items.setpoint, items.load);

        }
      })
      console.log(this.chillerData1);
    }));
  }


  updateCon(temp: any, setpoint: any, load: number) {
    this.checkCondition(temp, setpoint, load);
    console.log(load);
      if (load >= 70) {
        console.log(load);
        this.setCallFunction();
      }

  }


  public checkCondition(temp: number, setpoint: number, load: number){
    const tempDifference = temp - setpoint;

    // Check if temperature exceeds threshold
    if (Math.abs(tempDifference) >= this.threshold) {
      const now = new Date();
      console.log(now);
      if (!this.lastTriggerTime) {
        this.lastTriggerTime = new Date("May 16 2025 11:58:32 GMT+0530");
        console.log(`Threshold exceeded (Δ=${tempDifference}°C). Waiting 5 minutes...`);
        console.log(now.getTime() - this.lastTriggerTime);
      } else if (now.getTime() - this.lastTriggerTime >= this.holdTimeMs) {
        console.log(`5 minutes passed! Triggering action (Δ=${tempDifference}°C)`);
        this.callback(); // Execute the callback (e.g., adjust HVAC)
        this.lastTriggerTime = null; // Reset
      }
    } else {
      this.lastTriggerTime = null; // Reset if within threshold
    }

    // Optional: Handle load condition (from your original code)
    if (load >= 70) {
      console.log(`High load detected (${load}%). Taking action.`);
      this.callback();
    }
  }

  setCallFunction(): void {
    console.log("Function called after 5 minutes");
    console.log(this.chillerData2);

    // Check if chillersData exists and is a non-empty array
    if (this.chillerData2.chillersData[1] && Array.isArray(this.chillerData2.chillersData) && this.chillerData2.chillersData.length > 0) {
      this.chillerData2.chillersData.forEach((items: { id: number; load: number; fanStatus: boolean; }) => {
        items.id = 2;
        items.load = 70;
        items.fanStatus = true;
        this.subs.add(this.deviceServices.updateData(items).subscribe(data => {
          console.log("1",data);
          //this.getDataAll();
          clearTimeout(this.timeoutId);
        }));
      });
    }
  }


// Call the function after 5 minutes (300000 milliseconds)



  statusFan(): void {
    const dialogRef = this.dialog.open(DeviceManagementSystemsComponents, {
      data: { title: 'Fan Status'},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      result===true?this.fanStatus = true : this.fanStatus = false;
      this.titleContent = 25;
    });
  }
}

  @Component({
    standalone: true,
    imports: [CommonModule, MatModuleModule],
    selector: 'app-device-management-systems',
    template: `
      <div class="dialog-container">
        <h2 class="dialog-title">{{ data.title }}</h2>
        <div class="toggle-section">
          <span class="toggle-label">Fan Status</span>
          <mat-slide-toggle
            [(ngModel)]="fanStatus"
            (change)="onToggleChange($event)"
            color="primary"
            aria-label="Toggle fan on or off">
            {{ fanStatus ? 'On' : 'Off' }}
          </mat-slide-toggle>
        </div>
        <div class="button-section">
          <button mat-raised-button color="primary" (click)="close()">Close</button>
        </div>
      </div>
    `,
    styles: [`
      .dialog-container {
        padding: 20px;
        min-width: 300px;
        font-family: 'Roboto', sans-serif;
      }
      .dialog-title {
        font-size: 24px;
        font-weight: 500;
        color: #3f51b5;
        margin-bottom: 20px;
      }
      .toggle-section {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
      }
      .toggle-label {
        font-size: 16px;
        color: #333;
      }
      .button-section {
        display: flex;
        justify-content: flex-end;
      }
      button {
        font-size: 14px;
        padding: 8px 16px;
      }
    `],
  })
  export class DeviceManagementSystemsComponents {
    fanStatus = false; // Default toggle state

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { title: string },
      private dialogRef: MatDialogRef<DeviceManagementSystemsComponents>
    ) {}

    onToggleChange(event: any) {
      this.fanStatus = event.checked;
      console.log('Fan is now:', this.fanStatus ? 'On' : 'Off');
      this.dialogRef.close(this.fanStatus);
      // Add logic to handle toggle state change (e.g., API call)
    }

    close() {
      this.dialogRef.close();
    }
  }
