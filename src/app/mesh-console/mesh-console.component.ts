import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatDrawer, MatSidenav } from "@angular/material/sidenav";
import { LoadComponentsComponent } from "./load-components";
import { UnsubscribeOnDestroyAdapter } from "../common";
import { CommonService } from "../services/common.service";
import { MenuModel } from "../frame/model/menuModel";
import { DictionaryService } from "../core/services";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../common/mat-module";

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule, LoadComponentsComponent],
  providers: [ DictionaryService, CommonService],
  selector: "app-mesh-console",
  templateUrl: "./mesh-console.component.html",
  styleUrls: ["./mesh-console.component.css"],
})
export class MeshConsoleComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  saveSuccessMsg = "Saved successfully";
  @ViewChild("dynamicLoadComponent", {
    read: ViewContainerRef,
  })
  entry!: ViewContainerRef;
  @ViewChild(LoadComponentsComponent)
  private LoadComponents!: LoadComponentsComponent;
  menuData!: MenuModel[];
  subMenus!: MenuModel[];
  status: boolean = false;
  UIDICTIONARY : any;
  @ViewChild("meshConsoleSideNav") public meshConsoleSideNav!: MatSidenav;

  constructor(
    private resolver: ComponentFactoryResolver,
    private commonService: CommonService,
    public dictionaryService: DictionaryService,
  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
     this.UIDICTIONARY= this.dictionaryService.uiDictionary;
      });
    this.getMenus();
  }

  showMeshConsoleDetail(
    meshConsoleComponent: string,
    meshConsoleSideNav: MatDrawer
  ) {
    this.LoadComponents.createMeshConsole(
      meshConsoleComponent,
      meshConsoleSideNav
    );
  }

  meshConsolesidebar(event: any) {
    this.meshConsoleSideNav.close();
  }

  private getMenus() {
    this.commonService.getMenu().subscribe((data) => {
      if (data) {
        this.commonService.hideloader();
      }
      this.menuData = data;
      this.menuData.forEach((data) => {
        if (data.type === "MESH_CONSOLE.MENU" && data.hasSubMenu) {
          this.subMenus = data.subMenus;
        }
      });
    });
  }
}
