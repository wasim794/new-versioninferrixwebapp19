import {Component, OnInit, ViewChild} from '@angular/core';
import {
  DigitalControllerNodeModel,
  DigitalControllerProfile,
  GpioSettingsModel,
  GradeSettingsMap,
  GradeSettingsMapModel,
  NodeSettingsModel
} from '../../shared/model';
import {GpioSettingsComponent} from '../../components';
import {NodeService, ProfileService} from '../../shared/service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {IntStringPairModel} from '../../../core/models';
import {JsonDataService} from '../../../core/services';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-read-commissioned-node-di-settings',
  templateUrl: './di-controller-node-settings.component.html',
  styleUrls: []
})
export class DiControllerNodeSettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  isGpioEnabled = false;
  digitalControllerNode = {} as DigitalControllerNodeModel;
  profile = {} as DigitalControllerProfile;
  nodeSettings = {} as NodeSettingsModel;
  gpioSettings = {} as GpioSettingsModel;
  gradeSettingsMap = {} as GradeSettingsMapModel[];
  gradeJsonData = {} as GradeSettingsMap;
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
  @ViewChild(GpioSettingsComponent) gpioSettingsComponent: GpioSettingsComponent;
  nodeXid: any;
  public UIDICTIONARY:any;
  public digitalControllerTitle:boolean = false;

  constructor(
    private nodeService: NodeService,
    private profileService: ProfileService,
    public dictionaryService: DictionaryService,
    private jsonDataService: JsonDataService) {
    super();
  }

  ngOnInit() {

    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.nodeXid = this.nodeService.nodeXid;
    this.subs.add(this.nodeService.getNodeByXid(this.nodeXid).subscribe(data => {
      this.digitalControllerNode = data;
      this.profile = this.digitalControllerNode.profile;
      this.nodeSettings = this.profile.nodeSettings;
      this.gpioSettings = this.profile.gpioSettings;

      if (this.profile.gpioSettings) {
        this.isGpioEnabled = this.profile.gpioSettingsEnabled;
        this.gpioSettings = this.profile.gpioSettings;
        this.gpioSettingsComponent.setGpioSettingsModel(this.profile.gpioSettings);
      }
      this.digitalControllerTitle = true;
    }));
    this.getGradeMappingSetting();
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
}

