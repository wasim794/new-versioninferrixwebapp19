import {Component, OnInit} from '@angular/core';
import {DictionaryService} from "../../core/services/dictionary.service";
import { MatModuleModule } from '../../common/mat-module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatModuleModule],
  templateUrl: './footer.component.html',
  styleUrls: []
})
export class FooterComponent implements OnInit {
  startYear = 2016;
  UIDICTIONARY : any;
  currentYear: number = new Date().getFullYear();
  constructor(public dictionaryService: DictionaryService) {
  }
  ngOnInit() {
  this.dictionaryService.getUIDictionary('core').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
  }

}
