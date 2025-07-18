import {
  Component, ComponentFactoryResolver, Input, OnInit, ViewChild,
  ViewContainerRef, Output, EventEmitter
} from '@angular/core';
import {EmailComponent, ProcessComponent, SetPointComponent, SmsComponent} from '../../handler-type';
import {AbstractEventHandlerModel} from '../../../../core/models/events/handlers';
import {OnAddInit, OnEditInit} from '../../common';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import { CommonService } from '../../../../services/common.service';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers:[CommonService],
  selector: 'app-event-handler-edit',
  templateUrl: './event-handler-edit.component.html',
  styleUrls: []
})
export class EventHandlerEditComponent implements OnInit, OnEditInit, OnAddInit {

  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  private componentRef: any;
  @Input() selectedHandlerType: any;
  @Output() eventHandlerClose = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  createComponent(handlerType: string) {
    let factory;
    switch (handlerType) {
      case 'EMAIL_HANDLER':
        factory = this.resolver.resolveComponentFactory(EmailComponent);
        break;
      case 'PROCESS_HANDLER':
        factory = this.resolver.resolveComponentFactory(ProcessComponent);
        break;
      case 'SET_POINT_HANDLER':
        factory = this.resolver.resolveComponentFactory(SetPointComponent);
        break;
      case 'SMS_HANDLER':
        factory = this.resolver.resolveComponentFactory(SmsComponent);
        break;
    }
    return factory;
  }

  eventHandlerAddInit(type: string): void {
    this.entry.clear();
    const factory = this.createComponent(type);
    // this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.eventHandlerAddInit(type);
    this.componentRef.instance.eventHandlerClose.subscribe(($event: any) => {
      this.eventHandlerClose.emit($event);
    });
  }

  eventHandlerEditInit(handler: AbstractEventHandlerModel<any>): void {
    this.entry.clear();
    const factory = this.createComponent(handler.handlerType);
    // this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.eventHandlerEditInit(handler);
    this.componentRef.instance.eventHandlerClose.subscribe(($event: any) => {
      this.eventHandlerClose.emit($event);
    });
  }
}
