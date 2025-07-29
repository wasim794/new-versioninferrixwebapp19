import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Router} from '@angular/router';
import {
  EmailComponent,
  LicenseComponent,
  SystemInformationComponent,
  PurgeSettingsComponent,
   GlobalScriptsComponent
} from '../pages';
import {PermissionComponent} from '../../permission/permission.component';
import {DbUtilityComponent} from '../../db-utility';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [],
  selector: 'app-load-components',
  templateUrl: './load-components.component.html',
  styleUrls: []
})
export class LoadComponentsComponent implements OnInit {
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry!: ViewContainerRef;
  componentRef: any;
  @Output() systemsettingsidebar = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver,
              private router: Router) {
  }

  ngOnInit() {

  }

  nagivate() {
    this.router.navigate(['/system-setting/bacnet']);
  }

  nagivate_platform() {
    this.router.navigate(['/system-setting/platform-integration']);
  }

  dynamicLoad(componentType: string) {
    this.entry.clear();
    const factory = this.componentLoaded(componentType);
    // this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.systemsettingsidebar.subscribe(($event: any) => {
      this.systemsettingsidebar.emit($event);
    });

  }

  /** Method for creating the component dynamically */
  componentLoaded(componentType: string) {
    let factory;
    this.entry.clear();
    if (componentType === 'BACNET_LOCAL_DEVICE.MENU') {
      this.nagivate();
    } else if (componentType === 'PLATFORM_INTEGRATION.MENU') {
      this.nagivate_platform();
    }
    switch (componentType) {
      case 'STACK_INFORMATION.MENU':
        factory = this.resolver.resolveComponentFactory(SystemInformationComponent);
        break;
      case 'LICENSE.MENU':
        factory = this.resolver.resolveComponentFactory(LicenseComponent);
        break;
      case 'MAIL_SETTINGS.MENU':
        factory = this.resolver.resolveComponentFactory(EmailComponent);
        break;
      case 'PERMISSIONS.MENU':
        factory = this.resolver.resolveComponentFactory(PermissionComponent);
        break;
      case 'DB_UTILS.MENU':
        factory = this.resolver.resolveComponentFactory(DbUtilityComponent);
        break;
      case 'DATA_PURGE.MENU':
        factory = this.resolver.resolveComponentFactory(PurgeSettingsComponent);
        break;
      case 'GLOBAL_SCRIPTING.MENU':
        factory = this.resolver.resolveComponentFactory(GlobalScriptsComponent);
        break;
    }
    return factory;

  }

}
