import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModbusQueryModel} from '../../../models/modbus-query.model';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {MatSelectChange} from '@angular/material/select';
import {CommonService} from '../../../../services/common.service';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {ConfigProfileComponent} from '../config-profile.component';
import {ModbusQueryService} from "../../../service/modbus-query.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [ModbusQueryService, CommonService, DictionaryService],
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  styleUrls: []
})
export class ConfigFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Output() sidebarClose: EventEmitter<any> = new EventEmitter<any>();
  errorMsg!: any;
  configList: any = new ModbusQueryModel();
  selectedData: any;
  condition!: boolean;
  pollingCondition!: boolean;
  permissions!: [];
  deviceTypeKey: any = [];
  atributeTypeKey: any = [];
  readPermission!: [];
  editPermission!: [];
  isEdit!: boolean;
  configFormError: any = [];
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated successfully';
  UIDICTIONARY:any;
  configListName!:boolean;

  constructor(private modbusQueryService: ModbusQueryService, private commonService: CommonService, public dictionaryService: DictionaryService, public configpro: ConfigProfileComponent) {
    super();
    this.setPointsandPermission();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getDeviceType(event);
  }

  setPointsandPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
        this.permissions = data;
      }
    ));
  }

  getConfigList(id: any) {
    this.subs.add(this.modbusQueryService.getById(id).subscribe(data => {
      this.configList = data;
      this.displayPermissions();
      this.getAttributeType(this.configList.definition);
      this.configListName = true;

    }));
  }

  displayPermissions() {
    /* set readPermission data */
    this.readPermission = [];
    this.editPermission = [];
    const readPermission = this.configList.readPermission;
    this.readPermission = readPermission.split(',');
    const editPermission = this.configList.editPermission;
    this.editPermission = editPermission.split(',');
  }

  getDeviceType(id: any) {
    this.subs.add(this.modbusQueryService.getDeviceTypes().subscribe(data => {
        const obj = data;
        // this.deviceTypeKey = Object.keys(obj).map(key => ({type: key, value: obj[key]}));
      },
    ));
  }

  getAttributeType(key: any) {
    this.subs.add(this.modbusQueryService.getDeviceTypeAttributes(key).subscribe(data => {
        const obj = data;
        // this.atributeTypeKey = Object.keys(obj).map(key => ({type: key, value: obj[key]}));
      },
    ));
  }

  selectedValue(event: MatSelectChange) {
    this.selectedData = {
      value: event.value, text: event.source.triggerValue
    };
    this.condition = true;
    this.getAttributeType(event.value);
  }

  attributeValue(event: MatSelectChange) {
    this.selectedData = {
      value: event.value, text: event.source.triggerValue
    };
    this.pollingCondition = true;
  }

  getConfigListReset(id: any) {
    this.readPermission = [];
    this.editPermission = [];
    this.configList = new ModbusQueryModel();
    this.isEdit = false;
    this.condition = false;
    this.pollingCondition = false;
  }

  updateConfigForm() {
    this.configFormPermissionToModel();
    this.configList.mappings = [];
    this.subs.add(this.modbusQueryService.update(this.configList).subscribe(data => {
      this.commonService.notification('Update successfully');
      this.sidebarClose.emit(data);
    }));
  }

  saveConfigForm() {
    this.configFormPermissionToModel();
    this.subs.add(this.modbusQueryService.save(this.configList).subscribe(data => {
      this.commonService.notification('Save successfully');
      this.sidebarClose.emit(data);
      this.configpro.ngOnInit();
    }));
  }

  public configFormPermissionToModel() {
    if (this.readPermission) {
      this.configList.readPermission = this.readPermission.toString();
    }
    if (this.editPermission) {
      this.configList.editPermission = this.editPermission.toString();
    }
  }
}
