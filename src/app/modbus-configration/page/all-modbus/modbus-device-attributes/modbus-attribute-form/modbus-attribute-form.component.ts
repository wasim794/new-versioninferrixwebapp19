import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ModbusDeviceAttributesModel, ModbusQueryData, ModbusDataModel, ModbusQueryModel} from '../../../../models';
import {UnsubscribeOnDestroyAdapter} from '../../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {CommonService} from '../../../../../services/common.service';
import {DATA_TYPES} from '../../../../../common/static-data/static-data';
import {POINT_SIZE, FUNCTION_CODE} from '../../../../data/dropdown.data';
import {ModbusDeviceAttributesService} from '../../../../../modbus-configration';
import {DictionaryService} from "../../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../../common/mat-module';

export interface IntStringPair {
  key: number;
  value: ModbusDataModel;
}

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, ReactiveFormsModule],
  providers:[ModbusDeviceAttributesService, CommonService, DictionaryService],
  selector: 'app-modbus-attribute-form',
  templateUrl: './modbus-attribute-form.component.html',
  styleUrls: []
})
export class ModbusAttributeFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public detailNameForm:any= FormGroup;
  public listDataForm!: FormArray
  public detailKeyValuePair!:IntStringPair[];
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter<any>();
  modbusDeviceAttributes: any = new ModbusDeviceAttributesModel(<any>[]);
  modbusQueryData: any = new ModbusQueryData(<any>[]);
  modbusData:any= ModbusDataModel;
  QueryDataFunction!: boolean;
  fields: any[] = [];
  editPermission = [];
  readPermission = [];
  DataTypes = DATA_TYPES;
  pointSize = POINT_SIZE;
  functionCodes = FUNCTION_CODE;
  convertObjects:any;
  public messageError!: boolean;
  public ListError: any;
  saveMessage  = "Save Successfully";
  updateMessage  = "Update Successfully";
  combinedObject:any;
  isEdit: boolean=false;
  arrayDataPush:any;
  modbusAttr!:boolean;
  UIDICTIONARY:any;

  constructor( private fb: FormBuilder, private commonService: CommonService,
              private modbusDeviceAttributesService: ModbusDeviceAttributesService,
  public dictionaryService: DictionaryService) {
    super();

  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.setPointsandPermission();
    this.appendForms();

  }

  appendForms(){
  this.detailNameForm = this.fb.group({
    detailNameSetting: this.fb.array([this.createArrayForm(1)]),
  });
}
  createArrayForm(index: any): FormGroup {
    return this.fb.group({
      key:'',
      pointName: '',
      pointSize:'',
      dataType:''
    });
  }

  get FormGroups() {
    return this.detailNameForm.get('detailNameSetting') as FormArray;
  }

  setPointsandPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.editPermission = data;
    }, err => console.log(err)));
  }

  addField() {
    const items = this.detailNameForm.get('detailNameSetting') as FormArray;
    items.push(this.fb.group({
      key:'',
      pointName: '',
      pointSize:'',
      dataType:''
    }));
  }

  removeField(index: number) {
    const items = this.detailNameForm.get('detailNameSetting') as FormArray;
    items.removeAt(index);
  }

  save() {
    this.modbusDeviceAttributes.queryData = this.modbusQueryData;
    this.PermissionToModel();
    this.detailKeyValuePair = this.detailNameForm.value.detailNameSetting;
    const obj = this.detailKeyValuePair;
    const allObj = Object.keys(obj).map((key:any) => ({key: obj[key].key, value: obj[key]}));
    this.convertObjects = allObj.reduce((acc, cur) => {
    // delete cur.value.key;
    // acc[cur.key] = cur.value;
    this.combinedObject = Object.assign(acc);
    return acc;
    }, {});
    this.modbusData= this.combinedObject;
    this.modbusDeviceAttributes.pointDetails = this.modbusData;
    // return;
    // return ;
    this.subs.add(this.modbusDeviceAttributesService.save(this.modbusDeviceAttributes).subscribe(data => {
     this.commonService.notification(this.saveMessage);
     this.closeSidebar.emit(data);
    }, error => {
      this.ListError = error.result.message;
      this.timeOutFunction();
    }));
  }

  showData(event: any){
    this.modbusAttr = true;
    this.arrayDataPush = [];
    this.appendForms();
    this.isEdit = false;
    this.subs.add(this.modbusDeviceAttributesService.getById(event.id).subscribe(data => {
      this.modbusDeviceAttributes = data;
      this.displayPermissions();
      this.modbusQueryData = data.queryData;
      this.modbusData = data.pointDetails;
      const allValues = Object.values(this.modbusData);
      const keys = Object.keys(this.modbusData);
      const s = Object.keys(this.modbusData).length;
      for (let i = 1; i < s; i++) {
        const dataFetchArray = this.detailNameForm.get('detailNameSetting') as FormArray;
        dataFetchArray.push(this.setData());
      }
     this.arrayDataPush = [];
      let counter = keys;
      keys.forEach((key, index) => {
        const keyAll = counter[index];
        const obj = Object.assign({}, allValues[index], { key: keyAll });
        this.arrayDataPush.push(obj);
      });
      this.detailNameForm.get("detailNameSetting").setValue(this.arrayDataPush);
    }));
  }

  updateDeviceList(){
    this.modbusDeviceAttributes.queryData = this.modbusQueryData;
    this.modbusDeviceAttributes.writeData = null
    this.PermissionToModel();
    this.detailKeyValuePair = this.detailNameForm.value.detailNameSetting;
    const obj = this.detailKeyValuePair;
    const allObj = Object.keys(obj).map((key: any) => ({key: obj[key].key, value: obj[key]}));
    this.convertObjects = allObj.reduce((acc, cur) => {
      // delete cur.value.key;
      // acc[cur.key] = cur.value;
      this.combinedObject = Object.assign(acc);
      return acc;
    }, {});
    this.modbusData= this.combinedObject;
    this.modbusDeviceAttributes.pointDetails = this.modbusData;
    this.subs.add(this.modbusDeviceAttributesService.update(this.modbusDeviceAttributes).subscribe(data => {
      this.commonService.notification(this.updateMessage);
      this.closeSidebar.emit(data);
      const detailNameSettingFormArray = this.detailNameForm.get('detailNameSetting') as FormArray;
      detailNameSettingFormArray.clear();
      this.appendForms();
    }, error => {
      this.ListError = error.result.message;
      this.timeOutFunction();
    }));
  }

  private PermissionToModel() {
    if (this.readPermission) {
      this.modbusDeviceAttributes.editPermissions = this.readPermission.toString();
    }
  }

  addNewMain(event: any) {
    this.isEdit = true;
    this.modbusAttr = false;
    this.modbusDeviceAttributes=new ModbusDeviceAttributesModel(<any>[]);
    this.modbusQueryData = new ModbusQueryData(<any>[]);
    this.modbusData= new ModbusDataModel(<any>[]);
    this.readPermission = [];
    const detailNameSettingFormArray = this.detailNameForm.get('detailNameSetting') as FormArray;
    detailNameSettingFormArray.clear();
    this.appendForms();

  }

  private timeOutFunction(){
    this.messageError = true;
    setTimeout(()=>{
      this.messageError = false;
    }, 3000);
  }

  queryData(e: any) {
    e.checked === true ? this.QueryDataFunction = true : this.QueryDataFunction = false;
  }

  displayPermissions() {
    this.readPermission  = [];
    const readPermission = this.modbusDeviceAttributes.editPermissions;
    this.readPermission  = readPermission.split(',');
  }

  setData(): FormGroup {
    return this.fb.group({
      key: [this.modbusQueryData.key],
      pointName: [this.modbusQueryData.pointName],
      pointSize: [this.modbusQueryData.pointSize],
      dataType: [this.modbusQueryData.dataType]
    });
  }

}
