import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {GradeSettingsMap, GradeSettingsMapModel} from '../../shared/model';
import {IntStringPairModel} from '../../../core/models';
import {CommonService} from 'src/app/services/common.service';
import {JsonDataService} from '../../../core/services';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-grade-mapping-settings',
  templateUrl: './grade-mapping-settings.component.html',
  styleUrls: []
})
export class GradeMappingSettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public siteNameForm: FormGroup;
  public buildingForm: FormGroup;
  public floorForm: FormGroup;
  public roomForm: FormGroup;
  public zoneForm: FormGroup;
  public groupForm: FormGroup;

  public siteGradeList: FormArray;
  public buildingGradeList: FormArray;
  public floorGradeList: FormArray;
  public roomGradeList: FormArray;
  public zoneGradeList: FormArray;
  public groupGradeList: FormArray;

  isSaveEnable: boolean;
  isUpdateEnable: boolean;
  gradeSettingsMap = {} as GradeSettingsMapModel;
  jsonData = {} as GradeSettingsMap;
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
  saveMsg="Saved Successfully!";
  updateMsg = "Updated Successfully!";
  siteIndexArray = [];
  buildingIndexArray = [];
  floorIndexArray = [];
  roomIndexArray = [];
  zoneIndexArray = [];
  groupIndexArray = [];
  UIDICTIONARY:any;
  index = 1;
  readPermission = ['users', 'superadmin'];
  editPermission = ['users', 'superadmin'];
  gradeError = [];
  public messageError: boolean;

  constructor(
    private fb: FormBuilder,
    private jsonDataService: JsonDataService,
    public dictionaryService: DictionaryService,
    private commonService: CommonService) {
    super();

    this.siteNameForm = this.fb.group({
      siteNameSetting: this.fb.array([this.createGradeMappingSetting(1)]),
    });
    this.buildingForm = this.fb.group({
      buildingNumberSetting: this.fb.array([this.createGradeMappingSetting(1)])
    });
    this.floorForm = this.fb.group({
      floorSetting: this.fb.array([this.createGradeMappingSetting(1)])
    });
    this.roomForm = this.fb.group({
      roomSetting: this.fb.array([this.createGradeMappingSetting(1)])
    });
    this.zoneForm = this.fb.group({
      zoneSetting: this.fb.array([this.createGradeMappingSetting(1)])
    });
    this.groupForm = this.fb.group({
      groupSetting: this.fb.array([this.createGradeMappingSetting(1)])
    });
    this.siteIndexArray.push(1);
    this.buildingIndexArray.push(1);
    this.floorIndexArray.push(1);
    this.roomIndexArray.push(1);
    this.zoneIndexArray.push(1);
    this.groupIndexArray.push(1);
    // set switchList to the form control containing contacts
    this.siteGradeList = this.siteNameForm.get('siteNameSetting') as FormArray;
    this.buildingGradeList = this.buildingForm.get('buildingNumberSetting') as FormArray;
    this.floorGradeList = this.floorForm.get('floorSetting') as FormArray;
    this.roomGradeList = this.roomForm.get('roomSetting') as FormArray;
    this.zoneGradeList = this.zoneForm.get('zoneSetting') as FormArray;
    this.groupGradeList = this.groupForm.get('groupSetting') as FormArray;
  }

  ngOnInit() {
    this.getGradeMappingSetting();
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  getGradeMappingSetting() {
    this.subs.add(this.jsonDataService.getJsonData('definition=GRADE.MAPPING').subscribe(data => {
      if (data['total'] === 0) {
        this.isSaveEnable = true;
        this.isUpdateEnable = false;
      } else {
        this.isUpdateEnable = true;
        this.isSaveEnable = false;
        this.gradeSettingsMap = data['items'];
        this.showSiteMappingProperties();
        this.showBuildingMappingProperties();
        this.showFloorMappingProperties();
        this.showRoomMappingProperties();
        this.showZoneMappingProperties();
        this.showGroupMappingProperties();
      }
    }));
  }

  saveGradeMappingSetting() {
    this.gradeSettingsMap.name = 'Grade Settings';
    this.gradeSettingsMap.readPermissions = this.readPermission.toString();
    this.gradeSettingsMap.editPermissions = this.editPermission.toString();
    this.siteNameMapping = this.siteNameForm.value.siteNameSetting;
    this.buildingNameMapping = this.buildingForm.value.buildingNumberSetting;
    this.floorNameMapping = this.floorForm.value.floorSetting;
    this.roomNameMapping = this.roomForm.value.roomSetting;
    this.zoneNameMapping = this.zoneForm.value.zoneSetting;
    this.groupNameMapping = this.groupForm.value.groupSetting;

    this.jsonData.jsonDataType = 'GRADE.MAPPING';
    this.jsonData.siteNameMapping = this.siteNameMapping;
    this.jsonData.buildingNameMapping = this.buildingNameMapping;
    this.jsonData.floorNameMapping = this.floorNameMapping;
    this.jsonData.roomNameMapping = this.roomNameMapping;
    this.jsonData.zoneNameMapping = this.zoneNameMapping;
    this.jsonData.groupNameMapping = this.groupNameMapping;

    this.gradeSettingsMap.jsonData = this.jsonData;
    this.jsonDataService.saveJsonData(this.gradeSettingsMap).subscribe(data => {
        this.gradeSettingsMap = data['items'];
        this.commonService.notification(this.saveMsg);
      }, error => {
        this.gradeError = error.result.message;
      this.timeOutFunction();
      }
    );
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  updateGradeMappingSetting() {
    this.gradeSettingsMap.name = 'Grade Settings';
    this.gradeSettingsMap.readPermissions = this.readPermission.toString();
    this.gradeSettingsMap.editPermissions = this.editPermission.toString();
    this.siteNameMapping = this.siteNameForm.value.siteNameSetting;
    this.buildingNameMapping = this.buildingForm.value.buildingNumberSetting;
    this.floorNameMapping = this.floorForm.value.floorSetting;
    this.roomNameMapping = this.roomForm.value.roomSetting;
    this.zoneNameMapping = this.zoneForm.value.zoneSetting;
    this.groupNameMapping = this.groupForm.value.groupSetting;
    this.jsonData.jsonDataType = 'GRADE.MAPPING';
    this.jsonData.siteNameMapping = this.siteNameMapping;
    this.jsonData.buildingNameMapping = this.buildingNameMapping;
    this.jsonData.floorNameMapping = this.floorNameMapping;
    this.jsonData.roomNameMapping = this.roomNameMapping;
    this.jsonData.zoneNameMapping = this.zoneNameMapping;
    this.jsonData.groupNameMapping = this.groupNameMapping;
    this.gradeSettingsMap[0].jsonData = this.jsonData;
    this.jsonDataService.updateJsonData(this.gradeSettingsMap[0], this.gradeSettingsMap[0].xid).subscribe(data => {
        this.commonService.notification('Updated Successfully!');
      }, error => {
        this.gradeError = error.result.message;
      this.timeOutFunction();
      }
    );
  }

  get siteGradeFormGroup() {
    return this.siteNameForm.get('siteNameSetting') as FormArray;
  }

  get buildingGradeFormGroup() {
    return this.buildingForm.get('buildingNumberSetting') as FormArray;
  }

  get floorGradeFormGroup() {
    return this.floorForm.get('floorSetting') as FormArray;
  }

  get roomGradeFormGroup() {
    return this.roomForm.get('roomSetting') as FormArray;
  }

  get zoneGradeFormGroup() {
    return this.zoneForm.get('zoneSetting') as FormArray;
  }

  get groupGradeFormGroup() {
    return this.groupForm.get('groupSetting') as FormArray;
  }

  addSiteGradeSettingProperties() {
    if (this.siteGradeList.length < 254) {
      const index = this.findMissingIndexArray(this.siteIndexArray, 254, 1)[0];
      this.siteIndexArray.push(index);
      this.siteGradeList.insert(index, this.createGradeMappingSetting(index));
    } else {
      alert('Maximum 254 sites can be added!');
    }
  }

  addBuildingGradeSettingProperties() {
    if (this.buildingGradeList.length < 254) {
      const index = this.findMissingIndexArray(this.buildingIndexArray, 254, 1)[0];
      this.buildingIndexArray.push(index);
      this.buildingGradeList.insert(index, this.createGradeMappingSetting(index));
    } else {
      alert('Maximum 254 buildings can be added!');
    }
  }

  addFloorGradeSettingProperties() {
    if (this.floorGradeList.length < 254) {
      const index = this.findMissingIndexArray(this.floorIndexArray, 254, 1)[0];
      this.floorIndexArray.push(index);
      this.floorGradeList.insert(index, this.createGradeMappingSetting(index));
    } else {
      alert('Maximum 254 floors can be added!');
    }
  }

  addRoomGradeSettingProperties() {
    if (this.roomGradeList.length < 254) {
      const index = this.findMissingIndexArray(this.roomIndexArray, 254, 1)[0];
      this.roomIndexArray.push(index);
      this.roomGradeList.insert(index, this.createGradeMappingSetting(index));
    } else {
      alert('Maximum 254 rooms can be added!');
    }
  }

  addZoneGradeSettingProperties() {
    if (this.zoneGradeList.length < 254) {
      const index = this.findMissingIndexArray(this.zoneIndexArray, 254, 1)[0];
      this.zoneIndexArray.push(index);
      this.zoneGradeList.insert(index, this.createGradeMappingSetting(index));
    } else {
      alert('Maximum 254 zones can be added!');
    }
  }

  addGroupGradeSettingProperties() {
    if (this.groupGradeList.length < 65534) {
      const index = this.findMissingIndexArray(this.groupIndexArray, 65534, 1)[0];
      this.groupIndexArray.push(index);
      this.groupGradeList.insert(index, this.createGradeMappingSetting(index));
    } else {
      alert('Maximum 65534 groups can be added!');
    }
  }

  createGradeMappingSetting(index): FormGroup {
    return this.fb.group({
      key: [index],
      value: [null],
    });
  }

  showSiteMappingProperties() {
    if (this.gradeSettingsMap[0].jsonData.siteNameMapping) {
      this.siteNameMapping = this.gradeSettingsMap[0].jsonData.siteNameMapping.sort((n1, n2) => n1.key - n2.key);
      if (this.siteNameMapping.length) {
        while (this.siteGradeList.length !== 0) {
          this.siteGradeList.removeAt(0);
        }
        this.siteNameMapping.forEach(model => {
          this.siteIndexArray.push(model.key);
          this.siteGradeList.insert(model.key, this.setMapping(model));
        });
      }
    }
  }

  showBuildingMappingProperties() {
    if (this.gradeSettingsMap[0].jsonData.buildingNameMapping) {
      this.buildingNameMapping = this.gradeSettingsMap[0].jsonData.buildingNameMapping.sort((n1, n2) => n1.key - n2.key);
      if (this.buildingNameMapping.length) {
        while (this.buildingGradeList.length !== 0) {
          this.buildingGradeList.removeAt(0);
        }
        this.buildingNameMapping.forEach(model => {
          this.buildingIndexArray.push(model.key);
          this.buildingGradeList.insert(model.key, this.setMapping(model));
        });
      }
    }
  }

  showFloorMappingProperties() {
    if (this.gradeSettingsMap[0].jsonData.floorNameMapping) {
      this.floorNameMapping = this.gradeSettingsMap[0].jsonData.floorNameMapping.sort((n1, n2) => n1.key - n2.key);
      if (this.floorNameMapping.length) {
        while (this.floorGradeList.length !== 0) {
          this.floorGradeList.removeAt(0);
        }
        this.floorNameMapping.forEach(model => {
          this.floorIndexArray.push(model.key);
          this.floorGradeList.insert(model.key, this.setMapping(model));
        });
      }
    }
  }

  showRoomMappingProperties() {
    if (this.gradeSettingsMap[0].jsonData.roomNameMapping) {
      this.roomNameMapping = this.gradeSettingsMap[0].jsonData.roomNameMapping.sort((n1, n2) => n1.key - n2.key);
      if (this.roomNameMapping.length) {
        while (this.roomGradeList.length !== 0) {
          this.roomGradeList.removeAt(0);
        }
        this.roomNameMapping.forEach(model => {
          this.roomIndexArray.push(model.key);
          this.roomGradeList.insert(model.key, this.setMapping(model));
        });
      }
    }
  }

  showZoneMappingProperties() {
    if (this.gradeSettingsMap[0].jsonData.zoneNameMapping) {
      this.zoneNameMapping = this.gradeSettingsMap[0].jsonData.zoneNameMapping.sort((n1, n2) => n1.key - n2.key);
      if (this.zoneNameMapping.length) {
        while (this.zoneGradeList.length !== 0) {
          this.zoneGradeList.removeAt(0);
        }
        this.zoneNameMapping.forEach(model => {
          this.zoneIndexArray.push(model.key);
          this.zoneGradeList.insert(model.key, this.setMapping(model));
        });
      }
    }
  }

  showGroupMappingProperties() {
    if (this.gradeSettingsMap[0].jsonData.groupNameMapping) {
      this.groupNameMapping = this.gradeSettingsMap[0].jsonData.groupNameMapping.sort((n1, n2) => n1.key - n2.key);
      if (this.groupNameMapping.length) {
        while (this.groupGradeList.length !== 0) {
          this.groupGradeList.removeAt(0);
        }
        this.groupNameMapping.forEach(model => {
          this.groupIndexArray.push(model.key);
          this.groupGradeList.insert(model.key, this.setMapping(model));
        });
      }
    }
  }

  setMapping(model: IntStringPairModel): FormGroup {
    return this.fb.group({
      key: [model.key],
      value: [model.value],
    });
  }

  removeSiteGrade(index) {
    const model = this.siteGradeList.at(index).value;
    this.siteGradeList.removeAt(index);
    const idx = this.siteIndexArray.indexOf(model.key);
    this.siteIndexArray.splice(idx, 1);
  }

  removeBuildingGrade(index) {
    const model = this.buildingGradeList.at(index).value;
    this.buildingGradeList.removeAt(index);
    const idx = this.buildingIndexArray.indexOf(model.key);
    this.buildingIndexArray.splice(idx, 1);
  }

  removeFloorGrade(index) {
    const model = this.floorGradeList.at(index).value;
    this.floorGradeList.removeAt(index);
    const idx = this.floorIndexArray.indexOf(model.key);
    this.floorIndexArray.splice(idx, 1);
  }

  removeRoomGrade(index) {
    const model = this.roomGradeList.at(index).value;
    this.roomGradeList.removeAt(index);
    const idx = this.roomIndexArray.indexOf(model.key);
    this.roomIndexArray.splice(idx, 1);
  }

  removeZoneGrade(index) {
    const model = this.zoneGradeList.at(index).value;
    this.zoneGradeList.removeAt(index);
    const idx = this.zoneIndexArray.indexOf(model.key);
    this.zoneIndexArray.splice(idx, 1);
  }

  removeGroupGrade(index) {
    const model = this.groupGradeList.at(index).value;
    this.groupGradeList.removeAt(index);
    const idx = this.groupIndexArray.indexOf(model.key);
    this.groupIndexArray.splice(idx, 1);
  }

  findMissingIndexArray(arrIndex: number[], max: number, min: number): number[] {
    return Array.from(Array(max - min), (v, k) => k + min).filter(idx => !arrIndex.includes(idx)).sort((n1, n2) => n1 - n2);
  }
}
