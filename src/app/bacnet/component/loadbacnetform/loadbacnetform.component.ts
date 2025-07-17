import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { BacnetLocalDeviceComponent } from '../bacnetform/bacnet-local-device.component';
import { BacnetLocalDeviceModel } from '../../../bacnet';
import { CommonModule } from '@angular/common';

// Interface for compatibility with BacnetLocalDeviceComponent
interface DynamicPublisherComponent {
  responsePublisherSave: EventEmitter<any>;
  responsePublisherUpdate: EventEmitter<any>;
  getPubBacnet?(xid: string): void;
  getByID?(id: string): void;
  newLocalDevice?(type: string): void;
  closeAllSidebar: EventEmitter<void>;
}

@Component({
  standalone: true,
  imports: [CommonModule], // Add necessary modules if used in template
  selector: 'app-loadbacnetform',
  templateUrl: './loadbacnetform.component.html',
  styleUrls: [], // Add CSS file if needed, e.g., ['./loadbacnetform.component.css']
})
export class LoadbacnetformComponent implements OnInit {
  @Output() closeAllSidebar = new EventEmitter<void>();
  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef }) entry!: ViewContainerRef;
  private componentRef!: ComponentRef<BacnetLocalDeviceComponent>;

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {}

  editLocalDevice(model: any) {
    this.createComponent(model);
    const instance = this.componentRef.instance as DynamicPublisherComponent;
    if (instance.getByID) {
      instance.getByID(model.id);
    } else {
      console.error('getByID method not available on BacnetLocalDeviceComponent');
    }
  }

  createComponent(model: any) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(BacnetLocalDeviceComponent);
    this.componentRef = this.entry.createComponent(factory);
    const instance = this.componentRef.instance as DynamicPublisherComponent;

    // Subscribe to closeAllSidebar
    instance.closeAllSidebar.subscribe(() => {
      this.closeAllSidebar.emit();
    });

    // Optionally subscribe to save and update events
    instance.responsePublisherSave.subscribe((data: any) => {
      // Handle save event if needed
      console.log('Publisher saved:', data);
    });
    instance.responsePublisherUpdate.subscribe((data: any) => {
      // Handle update event if needed
      console.log('Publisher updated:', data);
    });
  }

  addLocalDevice() {
    this.createFreshComponent();
  }

  createFreshComponent() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(BacnetLocalDeviceComponent);
    this.componentRef = this.entry.createComponent(factory);
    const instance = this.componentRef.instance as DynamicPublisherComponent;

    if (instance.newLocalDevice) {
      instance.newLocalDevice('IP');
    } else {
      console.error('newLocalDevice method not available on BacnetLocalDeviceComponent');
    }

    // Subscribe to closeAllSidebar
    instance.closeAllSidebar.subscribe(() => {
      this.closeAllSidebar.emit();
    });

    // Optionally subscribe to save and update events
    instance.responsePublisherSave.subscribe((data: any) => {
      console.log('Publisher saved:', data);
    });
    instance.responsePublisherUpdate.subscribe((data: any) => {
      console.log('Publisher updated:', data);
    });
  }
}