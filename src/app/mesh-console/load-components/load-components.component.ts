import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {MeshConsolePropertiesComponent} from '../pages';

import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule, MeshConsolePropertiesComponent],
  selector: 'app-load-components',
  templateUrl: './load-components.component.html',
  styleUrls: []
})
export class LoadComponentsComponent implements OnInit {
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry!: ViewContainerRef;
  componentRef?: any; 
  @Output() meshConsoleSidebar = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver,
              private router: Router) {
  }

  ngOnInit() {
  }

  nagivate() {
    this.router.navigate(['/light/commissioning']);
  }

  meshNode() {
    this.router.navigate(['/mesh-console/mesh-node']);
  }

  configSettings() {
    this.router.navigate(['/mesh-console/config-settings']);
  }

  modbusConfigSettings() {
    this.router.navigate(['/mesh-console/modbus']);
  }
  firmWarePush() {
    this.router.navigate(['/mesh-console/firmware-push']);
  }
  publishOnMesh(){
    this.router.navigate(['/mesh-console/publish-on-mesh']);
  }
   thermoStatNivigation(){
    this.router.navigate(['/mesh-console/thermostat']);
   }

   tofNavigation(){
    this.router.navigate(['/mesh-console/tof']);
   }

  createMeshConsole(meshConsoleComponent: any, meshConsoleSideNav: any) {
    this.entry.clear();
    this.showMeshConsoleDetails(meshConsoleComponent, meshConsoleSideNav);
    this.createComponent(meshConsoleComponent);
    this.componentRef.instance.meshConsolesidebar.subscribe(($event: any) => {
      this.meshConsoleSidebar.emit($event);
    });
  }

  showMeshConsoleDetails(meshConsoleComponent: any, meshConsoleSideNav: MatDrawer) {
    if (meshConsoleComponent === 'LIGHT_COMMISSIONING.MENU') {
      this.nagivate();
    } else if (meshConsoleComponent === 'MESH_DIAGNOSTICS.MENU') {
      this.meshNode();
    } else if (meshConsoleComponent === 'MESH_CONFIGURATION.MENU') {
      this.configSettings();
    } else if (meshConsoleComponent === 'MODBUS_CONFIGURATION.MENU') {
      this.modbusConfigSettings();
    }
    else if (meshConsoleComponent === 'MESH_FIRMWARE_PUSH.MENU') {
      this.firmWarePush();
    }
    else if (meshConsoleComponent === 'PUBLISH_ON_MESH.MENU') {
      this.publishOnMesh();
    }
    else if(meshConsoleComponent==='THERMOSTAT.MENU'){
      this.thermoStatNivigation();
    }
    else if(meshConsoleComponent==='TOF_SENSOR.MENU'){
      this.tofNavigation();
    }
  }

   createComponent(componentType: string) {
    console.log(`Attempting to load component: ${componentType}`);
    this.entry.clear(); // Clear existing components before creating a new one

    let componentToLoad: Type<any> | undefined;

    // Use a switch statement to map string identifiers to component classes
    switch (componentType) {
      case 'MESH_CONFIGURATION.MENU':
        componentToLoad = MeshConsolePropertiesComponent;
        break;
      // Add other cases for your dynamic components here:
      // case 'LIGHT_COMMISSIONING.MENU':
      //   componentToLoad = LightCommissioningComponent;
      //   break;
      // case 'MESH_DIAGNOSTICS.MENU':
      //   componentToLoad = MeshNodeComponent;
      //   break;
      // case 'MODBUS_CONFIGURATION.MENU':
      //   componentToLoad = ModbusConfigSettingsComponent;
      //   break;
      // case 'MESH_FIRMWARE_PUSH.MENU':
      //   componentToLoad = FirmwarePushComponent;
      //   break;
      // case 'PUBLISH_ON_MESH.MENU':
      //   componentToLoad = PublishOnMeshComponent;
      //   break;
      // case 'THERMOSTAT.MENU':
      //   componentToLoad = ThermostatComponent;
      //   break;
      // case 'TOF_SENSOR.MENU':
      //   componentToLoad = TofSensorComponent;
      //   break;
      default:
        console.error(`Component type not recognized or defined for dynamic loading: ${componentType}`);
        return; // Exit if no component is found
    }

    if (componentToLoad) {
      // Create the component directly using ViewContainerRef.createComponent
      // No need for ComponentFactoryResolver anymore
      this.componentRef = this.entry.createComponent(componentToLoad);
      console.log(`Successfully loaded component: ${componentType}`);
    } else {
      console.error(`Component not found for dynamic loading: ${componentType}`);
    }
  }
}
