import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MeshConsolePropertiesComponent } from '../pages';
import { SinkSettingFormComponent } from '../Component/sink-setting-form/sink-setting-form.component';
import {
  DiagnosticsSettingFormComponent
} from '../Component/diagnostics-setting-form/diagnostics-setting-form.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatModuleModule,
    MeshConsolePropertiesComponent,
    SinkSettingFormComponent,
    DiagnosticsSettingFormComponent
  ],
  selector: 'app-load-pages',
  templateUrl: './load-pages.component.html',
  styleUrls: []
})
export class LoadPagesComponent implements OnInit {
  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef, static: true })
  entry!: ViewContainerRef;
  private componentRef: any;
  @Output() meshConsoleSidebar = new EventEmitter<any>();

  constructor(private router: Router) {}

  ngOnInit() {}

  createMeshConsole(componentType: string, configDrawer: MatDrawer) {
    this.entry.clear();
    this.showMeshConsoleDetails(configDrawer);
    this.createComponent(componentType);
    if (this.componentRef?.instance?.meshConsolesidebar) {
      this.componentRef.instance.meshConsolesidebar.subscribe(($event: any) => {
        this.meshConsoleSidebar.emit($event);
      });
    }
  }

  showMeshConsoleDetails(configDrawer: MatDrawer) {
    configDrawer.open();
  }

  createComponent(componentType: string) {
    this.entry.clear();
    let componentClass: any;
    switch (componentType) {
      case 'config':
        componentClass = MeshConsolePropertiesComponent;
        break;
      case 'sink-setting':
        componentClass = SinkSettingFormComponent;
        break;
      case 'diagnostics-setting':
        componentClass = DiagnosticsSettingFormComponent;
        break;
      default:
        console.error(`Component not found for dynamic loading: ${componentType}`);
        return;
    }
    this.componentRef = this.entry.createComponent(componentClass);
    console.log(`Successfully loaded component: ${componentType}`);
  }
}
