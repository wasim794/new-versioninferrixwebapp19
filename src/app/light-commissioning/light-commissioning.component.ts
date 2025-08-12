import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HelpModalComponent} from '../help/help-modal/help-modal.component';
import {DictionaryService} from "../core/services";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';
import { CommonService } from '../services/common.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService, CommonService],
  selector: 'app-light-commissioning',
  templateUrl: './light-commissioning.component.html',
  styleUrls: ['./light-commissioning.component.css']
})
export class LightCommissioningComponent implements OnInit {
  public UIDICTIONARY:any;

  constructor(private dialog: MatDialog, public dictionaryService: DictionaryService, private router: Router,
    public commonService:CommonService
  ) {
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });

  }

  lightHelp() {
    this.dialog.open(HelpModalComponent, {
      data: {
        title: 'Light Commissioning',
      },
      disableClose: true
    });
  }

  getProfileSettings() {
    this.navigateSettings();
  }

  getCommissionedNodes() {
    this.navigateCommissionedNodes();
  }

  getDiscoveredNodes() {
    this.navigateDiscoveredNodes();
  }

  getGradeMappings() {
    this.navigateGradeMapping();
  }

  getVirtualSwitch() {
    this.navigateVirtualSwitch();
  }

  private navigateSettings() {
    this.router.navigate(['/light/profiles']);
  }

  private navigateCommissionedNodes() {
    this.router.navigate(['/light/commissioned-nodes']);
  }

  private navigateDiscoveredNodes() {
    this.router.navigate(['/light/discovered-nodes']);
  }

  private navigateGradeMapping() {
    this.router.navigate(['/light/grade-mapping']);
  }

  private navigateVirtualSwitch() {
    this.router.navigate(['./light/virtual-switch']);
  }

  public getSettings() {
    this.router.navigate(['./light/settings']);
  }

  goBack() {
    this.commonService.goBackHistory();
  }
}
