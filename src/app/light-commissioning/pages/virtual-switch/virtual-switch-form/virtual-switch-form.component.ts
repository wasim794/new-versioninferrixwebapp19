import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GradeSettingsMap, GradeSettingsMapModel, VirtualSwitchModel} from '../../../shared/model';
import {IntStringPairModel} from '../../../../core/models';
import {JsonDataService} from '../../../../core/services';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {VirtualSwitchService} from '../../../shared/service';
import {CommonService} from 'src/app/services/common.service';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import {grade_Types} from '../../../../common/static-data/static-data';

@Component({
  selector: 'app-virtual-switch-form',
  templateUrl: './virtual-switch-form.component.html',
  styleUrls: []
})
export class VirtualSwitchFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  gradeData: boolean;
  model: VirtualSwitchModel;

  gradeName = 'Site';
  gradeSelected: number;
  vsError = [];
  errorMsg: string;
  gradeMapping: IntStringPairModel[];
  @Output() virtualSwitchClose = new EventEmitter<any>();
  @Input() buttonsView;
  isEdit: boolean;
  virtualSwitchTitle: boolean = false;
  saveSuccessMsg = 'Saved successfully';
  updateSuccessMsg = 'Updated successfully';
  public UIDICTIONARY:any;
  gradeTypes = grade_Types;

  gradeSettingsMap = {} as GradeSettingsMapModel[];
  gradeJsonData = {} as GradeSettingsMap;
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
  public messageError: boolean;

  constructor(
    private jsonDataService: JsonDataService,
    public dictionaryService: DictionaryService,
    private virtualSwitchService: VirtualSwitchService,
    private _commonService: CommonService
  ) {
    super();
  }

  ngOnInit() {
  this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
  this.isEdit = false;
  this.getGradeMappingSetting();
  this.model = new VirtualSwitchModel();
  this.model.gradeType = 'SITE';

  }

  getGradeMappingSetting() {
    this.subs.add(this.jsonDataService.getJsonData('definition=GRADE.MAPPING').subscribe(data => {
      this.gradeSettingsMap = data['items'];
      this.gradeJsonData = this.gradeSettingsMap[0].jsonData;
      this.siteNameMapping = this.gradeSettingsMap[0].jsonData.siteNameMapping;
      this.buildingNameMapping = this.gradeSettingsMap[0].jsonData.buildingNameMapping;
      this.floorNameMapping = this.gradeSettingsMap[0].jsonData.floorNameMapping;
      this.roomNameMapping = this.gradeSettingsMap[0].jsonData.roomNameMapping;
      this.zoneNameMapping = this.gradeSettingsMap[0].jsonData.zoneNameMapping;
      this.groupNameMapping = this.gradeSettingsMap[0].jsonData.groupNameMapping;
    }));
  }

  gradeUpdate() {
    if (this.gradeName === 'NULL') {
      this.gradeData = false;
      this.gradeMapping = [];
    } else if (this.gradeName === 'SITE') {
      this.gradeData = true;
      this.gradeMapping = this.siteNameMapping;
    } else if (this.gradeName === 'BUILDING') {
      this.gradeData = true;
      this.gradeMapping = this.buildingNameMapping;
    } else if (this.gradeName === 'FLOOR') {
      this.gradeData = true;
      this.gradeMapping = this.floorNameMapping;
    } else if (this.gradeName === 'ROOM') {
      this.gradeData = true;
      this.gradeMapping = this.roomNameMapping;
    } else if (this.gradeName === 'ZONE') {
      this.gradeData = true;
      this.gradeMapping = this.zoneNameMapping;
    } else if (this.gradeName === 'GROUP') {
      this.gradeData = true;
      this.gradeMapping = this.groupNameMapping;
    }
  }

  save() {
    this.model.gradeType = this.gradeName;
    this.model.grade = this.gradeSelected;
    this.virtualSwitchService.save(this.model).subscribe(data => {
      this.model = new VirtualSwitchModel(data);
      this._commonService.notification('virtual switch  ' + this.model.name + ' ' + this.saveSuccessMsg);
      this.virtualSwitchClose.emit(this.model);
    }, error => {
      this.vsError = error.result.message;
      this.timeOutFunction();
    });
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  update() {
    delete this.model.id;
    this.model.gradeType = this.gradeName;
    this.model.grade = this.gradeSelected;
    this.virtualSwitchService.update(this.model).subscribe(data => {
      this.model = new VirtualSwitchModel(data);
      this._commonService.notification('virtual switch  ' + this.model.name + ' ' + this.updateSuccessMsg);
      this.virtualSwitchClose.emit(this.model);
    });
  }

  edit(model: VirtualSwitchModel) {
    this.isEdit = true;
    this.model = new VirtualSwitchModel(model);
    this.gradeName = this.model.gradeType;
    this.gradeUpdate();
    this.gradeSelected = this.model.grade;
    this.virtualSwitchTitle = true;
  }

  addInit() {
    this.isEdit = false;
    this.model = new VirtualSwitchModel();
    this.gradeName = 'NULL';
    this.gradeSelected = 0;
    this.virtualSwitchTitle = false;
  }
}
