import {
  Component, Input, OnInit, ViewChild,
  ViewContainerRef, Output, EventEmitter, EnvironmentInjector, inject
} from '@angular/core';
import { EmailComponent, ProcessComponent, SetPointComponent, SmsComponent } from '../../handler-type';
import { AbstractEventHandlerModel } from '../../../../core/models/events/handlers';
import { OnAddInit, OnEditInit } from '../../common';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import { CommonService } from '../../../../services/common.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule], // Removed dynamic components from imports as they will be loaded dynamically
  providers: [CommonService],
  selector: 'app-event-handler-edit',
  templateUrl: './event-handler-edit.component.html',
  styleUrls: []
})
export class EventHandlerEditComponent implements OnInit, OnEditInit, OnAddInit {

  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef, static: true }) entry!: ViewContainerRef; // static: true if accessed in ngOnInit
  private componentRef: any;
  @Input() selectedHandlerType: any;
  @Output() eventHandlerClose = new EventEmitter<any>();

  // Inject EnvironmentInjector for createComponent
  private environmentInjector = inject(EnvironmentInjector);

  constructor() { } // Removed ComponentFactoryResolver from constructor

  ngOnInit() {
  }

  // This method will now return the component class itself, or a Promise for lazy loaded components
  private async getComponentClass(handlerType: any): Promise<any> {
    switch (handlerType) {
      case 'EMAIL_HANDLER':
        return EmailComponent; // If not lazy loaded
      // If you want to lazy load, it would look like this:
      // return (await import('../../handler-type')).EmailComponent;
      case 'PROCESS_HANDLER':
        return ProcessComponent;
      case 'SET_POINT_HANDLER':
        return SetPointComponent;
      case 'SMS_HANDLER':
        return SmsComponent;
      default:
        return null;
    }
  }

  async eventHandlerAddInit(type: any): Promise<void> {
    this.entry.clear();
    const componentClass = await this.getComponentClass(type);

    if (!componentClass) {
      console.error('Component class not found for handlerType:', type);
      return;
    }

    // Create the component directly using the component class
    this.componentRef = this.entry.createComponent(componentClass, {
      environmentInjector: this.environmentInjector // Pass the injector
    });

    this.componentRef.instance.eventHandlerAddInit(type);
    this.componentRef.instance.eventHandlerClose.subscribe(($event: any) => {
      this.eventHandlerClose.emit($event);
    });
  }

  async eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): Promise<void> {
    this.entry.clear();
    const componentClass = await this.getComponentClass(handler.handlerType);

    if (!componentClass) {
      console.error('Component class not found for handlerType:', handler.handlerType);
      return;
    }

    // Create the component directly using the component class
    this.componentRef = this.entry.createComponent(componentClass, {
      environmentInjector: this.environmentInjector // Pass the injector
    });

    // It seems there was a potential issue in your original code where eventHandlerEditInit was called
    // on a potentially uninitialized this.componentRef in the edit path.
    // Ensure that this.componentRef is created before calling methods on its instance.
    this.componentRef.instance.eventHandlerEditInit(handler);
    this.componentRef.instance.eventHandlerClose.subscribe(($event: any) => {
      this.eventHandlerClose.emit($event);
    });
  }
}