import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
  Injector,
  Type,
} from '@angular/core';
import { DatasourceModel } from '../model';
import { AssetTagComponent } from '../components/asset-tag';
import { BanetIpComponent } from '../components/banet-ip';
import { BanetMstpComponent } from '../components/banet-mstp';
import { HttpJsonRetrieverComponent } from '../components/http-json-retriever';
import { HttpReceiverDatasourceComponent } from '../components/http-receiver-datasource';
import { InternalDatasourceComponent } from '../components/internal-datasource';
import { MetaDataSourceComponent } from '../components/meta-data-source';
import { ModbusIpComponent } from '../components/modbus-ip';
import { ModbusSerialComponent } from '../components/modbus-serial';
import { MqttDatasourceComponent } from '../components/mqtt-datasource';
import { OpcDaComponent } from '../components/opc-da';
import { PingDatasourceComponent } from '../components/ping-datasource';
import { ScriptingComponent } from '../components/scripting';
import { SlBusComponent } from '../components/sl-bus';
import { SnmpComponent } from '../components/snmp';
import { ThermostatComponent } from '../components/thermostat';
import { VirtualDatasourceComponent } from '../components/virtual-datasource';
import { DistanceSensorComponent } from '../components/distance-sensor';
import { PeopleCounterComponent } from '../components/people-counter';


@Component({
  selector: 'app-datasource-edit',
  templateUrl: './datasource-edit.component.html',
  styleUrls: [],
})
export class DatasourceEditComponent {
  datasource: any = DatasourceModel;
  modal: DatasourceModel = new DatasourceModel();
  @Output() addedUpdatedDatasource = new EventEmitter<DatasourceModel>();
  @Output() addedSavedDatasource = new EventEmitter<DatasourceModel>();
  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  componentRef?: any; // Consider defining a specific interface for component instances

  constructor(private resolver: ComponentFactoryResolver) {}

  addNew(datasourceType: string) {
    this.entry.clear();
    const factory = this.componentLoaded(datasourceType);

    if (!factory) {
      console.error('Component factory not found for datasourceType:', datasourceType);
      return;
    }

   this.componentRef = this.entry.createComponent(factory, undefined, this.entry.injector);

    this.componentRef.instance.addNewDatasource(datasourceType);
    this.componentRef.instance.addedSavedDatasource.subscribe(($event: DatasourceModel) => {
      this.addedSavedDatasource.emit($event);
    });
  }

  getDataSource(datasource: DatasourceModel, index: number, edit: boolean) {
    console.log(datasource);
    this.entry.clear();
    const factory = this.componentLoaded(datasource.modelType);

    if (!factory) {
      console.error('Component factory not found for modelType:', datasource.modelType);
      return;
    }

    this.componentRef = this.entry.createComponent(factory, undefined, this.entry.injector);

    this.componentRef.instance.getDataSource(datasource, index, edit);
    this.componentRef.instance.addedUpdatedDatasource.subscribe(($event: DatasourceModel) => {
      this.addedUpdatedDatasource.emit($event);
    });
  }

  private componentLoaded(dataSourceType: string) {
    const componentMapping: Record<string, Type<any>> = {
      'STUDENT_ASSET_TAG.DS': AssetTagComponent,
      'BACNET_IP.DS': BanetIpComponent,
      'BACNET_MSTP.DS': BanetMstpComponent,
      'HTTP_JSON_RETRIEVER.DS': HttpJsonRetrieverComponent,
      'HTTP_RECEIVER.DS': HttpReceiverDatasourceComponent,
      'INTERNAL.DS': InternalDatasourceComponent,
      'META.DS': MetaDataSourceComponent,
      'MODBUS_IP.DS': ModbusIpComponent,
      'MODBUS_SERIAL.DS': ModbusSerialComponent,
      'MQTT.DS': MqttDatasourceComponent,
      'OPC.DS': OpcDaComponent,
      'PING.DS' : PingDatasourceComponent,
      'SCRIPTING.DS': ScriptingComponent,
      'SL_BUS.DS': SlBusComponent,
      'SNMP.DS': SnmpComponent,
      'THERMOSTAT.DS': ThermostatComponent,
      'VIRTUAL.DS': VirtualDatasourceComponent,
      'DISTANCE_SENSOR.DS': DistanceSensorComponent,
      'PEOPLE_COUNTER.DS': PeopleCounterComponent
    };

    const component = componentMapping[dataSourceType];
    return component ? this.resolver.resolveComponentFactory(component) : null;
  }
}