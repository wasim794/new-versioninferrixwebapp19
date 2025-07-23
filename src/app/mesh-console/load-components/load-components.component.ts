import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {MeshConsolePropertiesComponent} from '../pages';

import {Router} from '@angular/router';

@Component({
  selector: 'app-load-components',
  templateUrl: './load-components.component.html',
  styleUrls: []
})
export class LoadComponentsComponent implements OnInit {
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry: ViewContainerRef;
  private componentRef: any;
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

  createMeshConsole(meshConsoleComponent, meshConsoleSideNav) {
    this.entry.clear();
    this.showMeshConsoleDetails(meshConsoleComponent, meshConsoleSideNav);
    this.createComponent(meshConsoleComponent);
    this.componentRef.instance.meshConsolesidebar.subscribe($event => {
      this.meshConsoleSidebar.emit($event);
    });
  }

  showMeshConsoleDetails(meshConsoleComponent: string, meshConsoleSideNav: MatDrawer) {
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
    let factory;
    this.entry.clear();
    switch (componentType) {
      case 'MESH_CONFIGURATION.MENU':
        factory = this.resolver.resolveComponentFactory(MeshConsolePropertiesComponent);
        break;
    }
    this.componentRef = this.entry.createComponent(factory);
  }
}
