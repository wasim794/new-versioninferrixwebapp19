import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {HttpSenderComponent} from '../components/http';
import {MqttComponent} from '../components/mqtt/mqtt.component';
import {Publisher} from '../model/publisher';
import {BacnetSenderComponent} from '../../bacnet/pages/publisher/bacnet-sender/bacnet-sender.component';
import {MeshSenderComponent} from "../components/mesh";
import {PlatformIntegrationsComponent} from '../components/platform-integrations/platform-integrations.component';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, PlatformIntegrationsComponent, MeshSenderComponent, BacnetSenderComponent],
  providers: [],
  selector: 'app-publisher-edit',
  templateUrl: './publisher-edit.component.html',
})
export class PublisherEditComponent implements OnInit {

  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  private componentRef: any;
  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  addPublisher(publisherType: any) {
    this.entry.clear();
    const factory = this.componentLoaded(publisherType);
   
    if (!factory) {
      console.error('Component factory not found for publisherType:', publisherType);
      return;
    }

   this.componentRef = this.entry.createComponent(factory, undefined, this.entry.injector);
    this.componentRef.instance.responsePublisherSave.subscribe(($event: any) => {
      this.responsePublisherSave.emit($event);
    });
  }

  getPublisher(publisher: Publisher, edit: boolean) {
    this.entry.clear();
    const factory = this.componentLoaded(publisher.modelType);
    if (!factory) {
      console.error('Component factory not found for publisherType:', publisher);
      return;
    }

   this.componentRef = this.entry.createComponent(factory, undefined, this.entry.injector);
    if (publisher.modelType === 'HTTP_SENDER.PUB') {
      this.componentRef.instance.getHttSenderPublisher(publisher.xid);
    } else if (publisher.modelType === 'MQTT_SENDER.PUB') {
      this.componentRef.instance.getMqtt(publisher.xid);
    } else if (publisher.modelType === 'BACNET_SENDER.PUB') {
      this.componentRef.instance.getPubBacnet(publisher.xid);
    }
    else if (publisher.modelType === 'MESH_SENDER.PUB') {
      this.componentRef.instance.getMeshSender(publisher.xid);
    }
    else if (publisher.modelType === 'INTEGRATION_MQTT_SENDER.PUB') {
        this.componentRef.instance.getPlatform(publisher.xid);
      }
    // else if(publisher.modelType==''){
    //   this.componentRef.ins
    // }

    this.componentRef.instance.responsePublisherUpdate.subscribe(($event: any) => {
      this.responsePublisherUpdate.emit($event);
    });
  }

  componentLoaded(dataSourceType: any) {
    let factory;
    switch (dataSourceType) {
      case 'HTTP_SENDER.PUB':
        factory = this.resolver.resolveComponentFactory(HttpSenderComponent);
        break;

      case 'MQTT_SENDER.PUB':
        factory = this.resolver.resolveComponentFactory(MqttComponent);
        break;

      case 'BACNET_SENDER.PUB':
        factory = this.resolver.resolveComponentFactory(BacnetSenderComponent);
        break;
      case 'MESH_SENDER.PUB':
        factory = this.resolver.resolveComponentFactory(MeshSenderComponent);
        break;
      case 'INTEGRATION_MQTT_SENDER.PUB':
        factory = this.resolver.resolveComponentFactory(PlatformIntegrationsComponent);
    }
    return factory;
  }
}
