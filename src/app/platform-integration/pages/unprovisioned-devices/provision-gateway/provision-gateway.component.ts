import { Component, OnInit } from '@angular/core';
import {PlatformIntegrationService} from '../../../../platform-integration';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { MatModuleModule } from '../../../../common/mat-module';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatModuleModule, CommonModule],
  providers: [PlatformIntegrationService, DictionaryService],
  selector: 'app-provision-gateway',
  templateUrl: './provision-gateway.component.html'
})
export class ProvisionGatewayComponent extends  UnsubscribeOnDestroyAdapter implements OnInit {
 public name! :string;
 public id! : number;
 public queryList: any=[];
  myControl = new FormControl('');
  UIDICTIONARY : any;

  constructor(private platformIntegrationService: PlatformIntegrationService,
              public dictionaryService: DictionaryService,
              public dialogRef: MatDialogRef<ProvisionGatewayComponent>) { super(); }

  ngOnInit(): void {
      this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
         this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
    this.getDeviceList();
  }

  pushAndSave(){
    this.subs.add(this.platformIntegrationService.provisionGateway(this.id, this.name).subscribe(data=>{
      this.dialogRef.close('success');
    }))
  }

  getDeviceList() {
    this.subs.add(this.platformIntegrationService.getDeviceProfiles().subscribe(data => {
        this.queryList = data;
      }, err => console.log(err)
    ));
  }

  deviceChange(selectedOption: { id: number, name: string }, event: any): void {
    if (event.isUserInput) {
      this.id = selectedOption.id;
    }
  }

  onInputChange(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    const param = 'like(name,%2A' + filterValue + '%2A)';
    this.subs.add(this.platformIntegrationService.getDeviceProfiles(param).subscribe(data => {
        this.queryList = data;
      }, err => console.log(err)
    ));
  }
}
