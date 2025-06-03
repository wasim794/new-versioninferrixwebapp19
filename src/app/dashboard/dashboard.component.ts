import { CommonModule, isPlatformBrowser } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MenuModel} from '../frame/model/menuModel';
import {CommonService} from '../services/common.service';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import {DictionaryService} from "../core/services/dictionary.service";
import { MatModuleModule } from '../common/mat-module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
      MatModuleModule,
      CommonModule,
      RouterModule,
      RouterLink
    ],
    providers:[DictionaryService],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {
  menuData!: MenuModel[];
  UIDICTIONARY : any;

  constructor(private commonService: CommonService, public dictionaryService: DictionaryService) {
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getMenu();
  }

  private getMenu() {
    this.commonService.getMenu().subscribe(data => {
      // console.log(data);
      if (data) {
        this.commonService['hideloader']();
        this.menuData = data;
      }
      
    });
  }

}
