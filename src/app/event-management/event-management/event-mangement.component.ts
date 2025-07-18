import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {MenuModel} from '../../frame/model/menuModel';
import {Router} from '@angular/router';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService, CommonService],
  selector: 'app-event-mangement',
  templateUrl: './event-mangement.component.html',
  styleUrls: []
})
export class EventMangementComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  UIDICTIONARY : any;

  constructor(private commonService: CommonService, private router: Router, public dictionaryService: DictionaryService) {
    super();
  }

  menuData!: MenuModel[];
  subMenus!: MenuModel[];

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventManegment').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getMenus();

  }

  private getMenus() {
    this.subs.add(this.commonService.getMenu().subscribe(data => {
      if (data) {
        this.commonService.hideloader();
      }
      this.menuData = data;
      this.menuData.forEach(data => {
        if (data.type === 'EVENTS_MANAGEMENT.MENU' && data.hasSubMenu) {
          this.subMenus = data.subMenus;
        }
      });
    }));
  }

  navigatingToUrl(path: any) {
    this.router.navigateByUrl(path);
  }
}
