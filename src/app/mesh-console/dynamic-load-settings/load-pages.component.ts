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
import {SinkSettingFormComponent} from '../Component/sink-setting-form/sink-setting-form.component';
import {
  DiagnosticsSettingFormComponent
} from '../Component/diagnostics-setting-form/diagnostics-setting-form.component';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule, MeshConsolePropertiesComponent, SinkSettingFormComponent, DiagnosticsSettingFormComponent],
  providers: [],
  selector: 'app-load-pages',
  templateUrl: './load-pages.component.html',
  styleUrls: []
})
export class LoadPagesComponent implements OnInit {
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry!: ViewContainerRef;
  private componentRef: any;
  @Output() meshConsoleSidebar = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver,
              private router: Router) {
  }

  ngOnInit() {
  }

  createMeshConsole(meshConsoleComponent: any, configDrawer: any) {
    this.entry.clear();
    this.showMeshConsoleDetails(meshConsoleComponent, configDrawer);
    this.createComponent(meshConsoleComponent);
    this.componentRef.instance.meshConsolesidebar.subscribe(($event: any) => {
      this.meshConsoleSidebar.emit($event);
    });
  }

  showMeshConsoleDetails(meshConsoleComponent: string, configDrawer: MatDrawer) {
    configDrawer.open();
  }

  createComponent(componentType: string) {
    let factory;
    this.entry.clear();
    switch (componentType) {
      case 'config':
        factory = this.resolver.resolveComponentFactory(MeshConsolePropertiesComponent);
        break;
      case 'sink-setting':
        factory = this.resolver.resolveComponentFactory(SinkSettingFormComponent);
        break;
      case 'diagnostics-setting':
        factory = this.resolver.resolveComponentFactory(DiagnosticsSettingFormComponent);
        break;
    }
    // this.componentRef = this.entry.createComponent(factory);
  }
}
