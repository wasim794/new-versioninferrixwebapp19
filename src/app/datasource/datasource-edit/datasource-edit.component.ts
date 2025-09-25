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
import { MeshModbusControllerComponent } from '../components/mesh-modbus-controller';
import { SensorTagPirComponent } from '../components/sensor-tag-pir';
import { DiDoCardSensorComponent } from '../components/di-do-card-sensor';
import { DoorSensorComponent } from '../components/door-sensor';
import { IaqSensorComponent } from '../components/iaq-sensor';
import { InjectionMouldCountComponent } from '../components/injection-mould-count-sensor';
import { LeakageDetectorComponent } from '../components/leakage-detector';
import { LightControllerV4Component } from '../components/light-controller-v4';
import { LightDiControllerComponent } from '../components/light-di-controller';
import { PeopleCountCameraComponent } from '../components/people-count-camera';
import { CurrentSensorComponent } from '../components/current-sensor';
import { PoeLightingComponent } from '../components/poe-lighting';
import { BacnetIpNodeComponent, BacnetSerialNodeComponent, MetaDatasourceNodeComponent, ModbusIpNodeComponent, ModbusSerialNodeComponent, SnmpNodeComponent } from '../components/mesh-node';
import { DustbinLevelComponent } from '../components/mesh-node/dustbin-level';
import { PaperTowelLevelComponent } from '../components/mesh-node/paper-towel-level';
import { SoapDispenserComponent } from '../components/mesh-node/soap-dispenser/soap-dispenser.component';
import { VirtualSwitchComponent } from '../components/virtual-switch/virtual-switch.component';




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
      'PEOPLE_COUNTER.DS': PeopleCounterComponent,
      'MODBUS_CONTROLLER.DS': MeshModbusControllerComponent,
      'SENSOR_TAG_PIR.DS': SensorTagPirComponent,
      '4DI_2DO_CARD.DS': DiDoCardSensorComponent,
      'DOOR_SENSOR.DS': DoorSensorComponent,
      'SENSOR_TAG_DOOR_SENSOR.DS': DoorSensorComponent,
      'SENSOR_TAG_IAQ_V.DS': IaqSensorComponent,
      'SENSOR_TAG_INJECTION_MOULD_COUNT.DS': InjectionMouldCountComponent,
      'WATER_LEAKAGE_DETECTOR.DS': LeakageDetectorComponent,
      'LIGHT_CONTROLLER_V4.DS': LightControllerV4Component,
      'LIGHT_RELAY_CONTROLLER.DS': LightDiControllerComponent,
      'PEOPLE_COUNT_CAMERA.DS': PeopleCountCameraComponent,
      'CURRENT_SENSOR.DS': CurrentSensorComponent,
      'POE_LIGHTING.DS': PoeLightingComponent,
      'BACNET_IP_MESH_NODE.DS': BacnetIpNodeComponent,
      'BACNET_MSTP_MESH_NODE.DS': BacnetSerialNodeComponent,
      'DUSTBIN_LEVEL_SENSOR.DS': DustbinLevelComponent,
      'META_MESH_NODE.DS': MetaDatasourceNodeComponent,
      'MODBUS_IP_MESH_NODE.DS': ModbusIpNodeComponent,
      'MODBUS_SERIAL_MESH_NODE.DS': ModbusSerialNodeComponent,
      'PAPER_TOWEL_LEVEL_SENSOR.DS': PaperTowelLevelComponent,
      'SNMP_MESH_NODE.DS': SnmpNodeComponent,
      'SOAP_DISPENSER_SENSOR.DS': SoapDispenserComponent,
      'VIRTUAL_SWITCH.DS': VirtualSwitchComponent,
    };

    const component = componentMapping[dataSourceType];
    return component ? this.resolver.resolveComponentFactory(component) : null;
  }
}