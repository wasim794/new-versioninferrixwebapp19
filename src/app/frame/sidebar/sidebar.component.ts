import {Component, OnInit} from '@angular/core';
import {MenuModel} from '../model/menuModel';
import { CommonModule } from '@angular/common';
import {CommonService} from '../../services/common.service';
import {DictionaryService} from "../../core/services/dictionary.service";
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatModuleModule } from '../../common/mat-module/mat-module.module';

@Component({
  selector: 'app-sidebar',
   standalone: true,
  imports: [MatModuleModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent implements OnInit {
  menuData: MenuModel[] | undefined;
  UIDICTIONARY : any;

  constructor(private commonService: CommonService , public dictionaryService: DictionaryService) {
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.getMenu();
  }

  private getMenu() {
    this.commonService.getMenu().subscribe(data => {
      this.menuData = data;
    });
  }
}
