import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { HttpSenderComponent } from '../components/http';
import { MqttComponent } from '../components/mqtt/mqtt.component';
import { Publisher } from '../model/publisher';
import { BacnetSenderComponent } from '../../bacnet/pages/publisher/bacnet-sender/bacnet-sender.component';
import { MeshSenderComponent } from '../components/mesh';
import { PlatformIntegrationsComponent } from '../components/platform-integrations/platform-integrations.component';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

// Common interface for all dynamic components
interface DynamicPublisherComponent {
  responsePublisherSave: EventEmitter<any>;
  responsePublisherUpdate: EventEmitter<any>;
  getHttSenderPublisher?(xid: string): void;
  getMqtt?(xid: string): void;
  getPubBacnet?(xid: string): void;
  getMeshSender?(xid: string): void;
  getPlatform?(xid: string): void;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, MqttComponent, HttpSenderComponent, BacnetSenderComponent, PlatformIntegrationsComponent, MeshSenderComponent],
  providers: [],
  selector: 'app-publisher-edit',
  templateUrl: './publisher-edit.component.html',
})
export class PublisherEditComponent implements OnInit {
  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef }) entry!: ViewContainerRef;
  private componentRef: any; // Temporarily use any, will refine later

  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {}

  addPublisher(publisherType: string) {
    this.entry.clear();
    console.log(publisherType);
    const factory = this.componentLoaded(publisherType);

    if (!factory) {
      console.error('Component factory not found for publisherType:', publisherType);
      return;
    }

    // Create component with proper typing
    this.componentRef = this.entry.createComponent(factory, undefined, this.entry.injector);
    const componentInstance = this.componentRef.instance as DynamicPublisherComponent;

    // Subscribe to the save event
    componentInstance.responsePublisherSave.subscribe(($event: any) => {
      this.responsePublisherSave.emit($event);
    });
  }

  getPublisher(publisher: any, edit: boolean) {
    this.entry.clear();
    console.log(publisher);
    const factory = this.componentLoaded(publisher.modelType);
    if (!factory) {
      console.error('Component factory not found for publisherType:', publisher.modelType);
      return;
    }

    // Create component with proper typing
    this.componentRef = this.entry.createComponent(factory, undefined, this.entry.injector);
    const componentInstance = this.componentRef.instance as DynamicPublisherComponent;

    // Call component-specific methods with type safety
    if (publisher.modelType === 'HTTP_SENDER.PUB' && componentInstance.getHttSenderPublisher) {
      componentInstance.getHttSenderPublisher(publisher.xid);
    } else if (publisher.modelType === 'MQTT_SENDER.PUB' && componentInstance.getMqtt) {
      componentInstance.getMqtt(publisher.xid);
    } else if (publisher.modelType === 'BACNET_SENDER.PUB' && componentInstance.getPubBacnet) {
      componentInstance.getPubBacnet(publisher.xid);
    } else if (publisher.modelType === 'MESH_SENDER.PUB' && componentInstance.getMeshSender) {
      componentInstance.getMeshSender(publisher.xid);
    } else if (publisher.modelType === 'INTEGRATION_MQTT_SENDER.PUB' && componentInstance.getPlatform) {
      componentInstance.getPlatform(publisher.xid);
    } else {
      console.warn(`No matching method for modelType: ${publisher.modelType}`);
    }

    // Subscribe to the update event
    componentInstance.responsePublisherUpdate.subscribe(($event: any) => {
      this.responsePublisherUpdate.emit($event);
    });
  }

  private componentLoaded(dataSourceType: string): any {
    switch (dataSourceType) {
      case 'HTTP_SENDER.PUB':
        return this.resolver.resolveComponentFactory(HttpSenderComponent);
      case 'MQTT_SENDER.PUB':
        return this.resolver.resolveComponentFactory(MqttComponent);
      case 'BACNET_SENDER.PUB':
        return this.resolver.resolveComponentFactory(BacnetSenderComponent);
      case 'MESH_SENDER.PUB':
        return this.resolver.resolveComponentFactory(MeshSenderComponent);
      case 'INTEGRATION_MQTT_SENDER.PUB':
        return this.resolver.resolveComponentFactory(PlatformIntegrationsComponent);
      default:
        return null;
    }
  }
}