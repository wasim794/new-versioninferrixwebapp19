import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {UnsubscribeOnDestroyAdapter} from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {LoadPagesComponent} from "../../dynamic-load-settings/load-pages.component";
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule, Location  } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone:true,
  imports:[CommonModule , MatModuleModule, LoadPagesComponent],
  providers:[DictionaryService],
  selector: 'app-config-settings',
  templateUrl: './config-settings.component.html',
  styleUrls: []
})
export class ConfigSettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  saveSuccessMsg = 'Saved successfully';
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry!: ViewContainerRef;
  private componentRef: any;
  @ViewChild(LoadPagesComponent)
  private LoadPagesComponent!: LoadPagesComponent;
  @ViewChild('configDrawer') public configDrawer!: MatSidenav;
  UIDICTIONARY : any;

  constructor(
    private resolver: ComponentFactoryResolver,
    public dictionaryService: DictionaryService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
   this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY= this.dictionaryService.uiDictionary;
     });
  }

  addMesh(meshConsoleComponent: any, configDrawer: MatDrawer) {
    this.LoadPagesComponent.createMeshConsole(meshConsoleComponent, configDrawer);
  }

  meshConsolesidebar(event: any) {
    this.configDrawer.close();
  }

  editMesh() {
    this.configDrawer.open();
  }

  allClose() {
    this.configDrawer.close();
  }

goBack(): void {
  this.location.back();
}


}
