import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  ModbusDataModel,
  ModbusDeviceAttributesModel,
  ModbusQueryData,
  ModbusQueryModel,
} from "../../../../models";
import { UnsubscribeOnDestroyAdapter } from "../../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import { CommonService } from "../../../../../services/common.service";
import { ModbusDeviceDetailService } from "../../../../service/modbus-device-detail.service";
import { ModbusDeviceAttributesService } from "../../../../service/modbus-device-attributes.service";
import { FormArray, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { DictionaryService } from "../../../../../core/services/dictionary.service";
import {forkJoin, Observable} from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-modbus-device-form",
  templateUrl: "./modbus-device-form.component.html",
  styleUrls: [],
})
export class ModbusDeviceFormComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter<any>();
  modbusDevice: any = new ModbusQueryModel(<any>[]);
  editPermission = [];
  readPermission = [];
  limit = 50;
  offset = 0;
  public messageError: boolean;
  public ListError: any;
  saveMessage = "Save Successfully";
  updateMessage = "Update Successfully";
  isEdit: boolean = false;
  attributeValue = [];
  modbusQueryData: any = new ModbusQueryData(<any>[]);
  modbusData: any = ModbusDataModel;
  public detailNameForm: FormGroup;
  combinedObject: any;
  fields: any[] = [];
  options: any[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  selectedOptions: any[] = [];
  private convertValueToString: any;
  UIDICTIONARY:any;
  modbusDeviceName:boolean;

  constructor(
    private commonService: CommonService,
    private modbusDeviceDetail: ModbusDeviceDetailService,
    private modbusDeviceAttributes: ModbusDeviceAttributesService,
    public dictionaryService: DictionaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getDataAllFilter();
    this.setPointsandPermission();
    const param = "like(name,%2A" + "" + "%2A)";
    this.getAttributeList(param);

  }

  private getDataAllFilter() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }
  private _filter(value: string): any[] {
    const filterValue = value;
    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: any) {
    const selectedOption = event.option.value;
    console.log("selection", selectedOption);
    this.selectedOptions.push(selectedOption);
    this.myControl.setValue(""); // Clear the input field after selection
    this.convertValueToString = this.selectedOptions.map((item) =>
      parseInt(item.id, 10)
    );
    this.modbusDevice.attributes = this.convertValueToString;
  }
  removeOption(option: any): void {
    const index = this.selectedOptions.indexOf(option);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    }

    this.selectedOptions.map((item) =>
      parseInt(item.id, 10)
    );
    const objects = [option];
    // console.log(objects, this.modbusDevice.attributes);

    const remainingIds = this.modbusDevice.attributes.filter(id => !objects.some(obj => obj.id === id));
    // console.log(remainingIds);
    this.modbusDevice.attributes = remainingIds;

  }

  getAttributeList(params: string): void {
    this.subs.add(
      this.modbusDeviceAttributes.get(params).subscribe((data) => {
        this.attributeValue = data;
        this.options = data;
      })
    );
  }

  // getAttributeByID(ID){
  //   this.subs.add(this.modbusDeviceAttributes.getById(ID).subscribe(data=>{
  //     console.log("attribute data", data);
  //     this.myControl.setValue(data.name);
  //
  //   }))
  // }

  getAttributesByIDs(IDs: number[]) {
    const filteredIDs = IDs.slice(1); // Remove first ID
    const names: any[] = [];

    const observables = filteredIDs.map(ID =>
      this.modbusDeviceAttributes.getById(ID)
    );

    this.subs.add(
      forkJoin(observables).subscribe(results => {
        results.forEach(data => {
          if (data.name && data.name.trim() !== '') { // Remove blank names
            names.push({ name: data.name });
          }
        });

        console.log("Filtered names:", results);
        this.selectedOptions = results; // Set filtered names
      })
    );
  }

// // Function to remove a selected option
//   removeOption(option: any) {
//     this.selectedOptions = this.selectedOptions.filter(item => item !== option);
//   }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let param;
    if (filterValue.length) param = "like(name,%2A" + filterValue + "%2A)";
    else param = "like(name,%2A" + filterValue + "%2A)";
    this.getAttributeList(param);
  }

  setPointsandPermission() {
    this.subs.add(
      this.commonService.getPermission().subscribe(
        (data) => {
          this.editPermission = data;
        },
        (err) => console.log(err)
      )
    );
  }

  save() {
    this.modbusData = this.combinedObject;
    this.modbusDevice.pointDetails = this.modbusData;
    this.PermissionToModel();
    this.subs.add(
      this.modbusDeviceDetail.save(this.modbusDevice).subscribe(
        (data) => {
          this.commonService.notification(this.saveMessage);
          this.closeSidebar.emit(data);
        },
        (error) => {
          this.ListError = error.result.message;
          this.timeOutFunction();
        }
      )
    );
    // return
  }

  updateDeviceList() {
    this.modbusDevice.queryData = this.modbusQueryData;
    this.modbusDevice.writeData = null;
    this.PermissionToModel();
    this.subs.add(
      this.modbusDeviceDetail.update(this.modbusDevice).subscribe(
        (data) => {
          this.commonService.notification(this.updateMessage);
          this.closeSidebar.emit(data);
          const detailNameSettingFormArray = this.detailNameForm.get(
            "detailNameSetting"
          ) as FormArray;
          detailNameSettingFormArray.clear();
        },
        (error) => {
          this.ListError = error.result.message;
          this.timeOutFunction();
        }
      )
    );
  }

  showData(event) {
    this.isEdit = false;
    this.selectedOptions=[];
    this.subs.add(
      this.modbusDeviceDetail.getById(event.id).subscribe((data) => {
        this.modbusDevice = data;
        console.log("show data modbus", this.modbusDevice.attributes);
        // this.modbusDevice.attributes.forEach(item=>{
        //   console.log("item", item);
          this.getAttributesByIDs(this.modbusDevice.attributes);
        // })
        // this.getAttributeByID(this.modbusDevice.attributes[1]);
        this.displayPermissions();
        this.modbusDeviceName = true;
      })
    );
  }

  addNewMain(event) {
    this.isEdit = true;
    this.modbusDeviceName = false;
    this.modbusDevice = new ModbusDeviceAttributesModel(<any>[]);
    this.modbusQueryData = new ModbusQueryData(<any>[]);
    this.displayPermissions();
    this.modbusDevice = new ModbusQueryModel(<any>[]);

  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  private PermissionToModel() {
    this.modbusDevice.editPermissions = this.readPermission.toString();
  }

  displayPermissions() {
    this.readPermission = [];
    const readPermission = this.modbusDevice.editPermissions;
    this.readPermission = readPermission.split(",");
  }
}
