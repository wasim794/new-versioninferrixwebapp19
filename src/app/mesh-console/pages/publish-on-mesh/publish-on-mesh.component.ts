import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone:true,
  imports: [CommonModule, MatModuleModule],
  providers:[DictionaryService],
  selector: 'app-publish-on-mesh',
  templateUrl: './publish-on-mesh.component.html',
  styleUrls: []
})
export class PublishOnMeshComponent implements OnInit {
    UIDICTIONARY : any;

  constructor(private router: Router,public dictionaryService: DictionaryService,) { }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
  }

 getProvision() {
    this.router.navigate(['/mesh-console/publish-on-mesh/provision']);
  }
 getUnProvision() {
    this.router.navigate(['/mesh-console/publish-on-mesh/unprovision']);
  }

  provision(){
    this.getProvision();
  }

  unProvision(){
    this.getUnProvision();
  }


}
