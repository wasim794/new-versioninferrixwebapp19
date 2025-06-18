import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {BacnetLocalDeviceComponent} from '../bacnetform/bacnet-local-device.component';
import {BacnetLocalDeviceModel} from '../../../bacnet';


@Component({
  selector: 'app-loadbacnetform',
  templateUrl: './loadbacnetform.component.html',
  styleUrls: []
})
export class LoadbacnetformComponent implements OnInit {
  @Output() closeAllSidebar = new EventEmitter<any>();
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry!: ViewContainerRef;
  componentRef: any;


  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  editLocalDevice(model: BacnetLocalDeviceModel<any>) {
    this.createComponent(model);
    this.componentRef.instance.getByID(model.id);
  }

  createComponent(model: BacnetLocalDeviceModel<any>) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(BacnetLocalDeviceComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.closeAllSidebar.subscribe(($event: any) => {
      this.closeAllSidebar.emit($event);
    });
  }

  addLocalDevice() {
    this.createFreshComponent();
  }

  createFreshComponent() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(BacnetLocalDeviceComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.newLocalDevice('IP');
    this.componentRef.instance.closeAllSidebar.subscribe(($event: any) => {
      this.closeAllSidebar.emit($event);
    });
  }
}
