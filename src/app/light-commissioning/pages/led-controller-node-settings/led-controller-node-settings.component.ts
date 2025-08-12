import {Component, OnInit, ViewChild} from '@angular/core';
import {NodeService} from '../../shared/service';
import {
  BandSettingsModel,
  ControllerNodeModel,
  ControllerProfile,
  GradeSettingsMap,
  GradeSettingsMapModel,
  LuxSettingsModel,
  NodeSettingsModel,
  PirSettingsModel,
  SwitchSettingsModel
} from '../../shared/model';
import {BandSettingsComponent, LuxFormComponent, PirFormComponent, SwitchFormComponent} from '../../components';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {IntStringPairModel} from '../../../core/models';
import {JsonDataService} from '../../../core/services';
import {HoldTimeOneComponent} from '../../components/hold-time-one/hold-time-one.component';
import {HoldTimeTwoComponent} from '../../components/hold-time-two/hold-time-two.component';
import {Common} from '../../shared';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-edit-commission',
  templateUrl: './led-controller-node-settings.component.html',
  styleUrls: []
})
export class ReadCommissionedNodeSettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  isPirChecked = false;
  isLuxChecked = false;
  isSwitchChecked = false;
  isEnoceanRelay = false;
  isBandChecked = false;
  controllerNodeModel = {} as ControllerNodeModel;
  profile = {} as ControllerProfile;
  nodeSettings = {} as NodeSettingsModel;
  pirSettings = {} as PirSettingsModel;
  luxSettings = {} as LuxSettingsModel;
  switchSettings = {} as SwitchSettingsModel;
  bandSettings = {} as BandSettingsModel;
  gradeSettingsMap = {} as GradeSettingsMapModel[];
  gradeJsonData = {} as GradeSettingsMap;
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
  isEnableHoldTimeOne = false;
  isEnableHoldTimeTwo = false;
  nodeTypes = Common.nodeTypes;
  @ViewChild(PirFormComponent) pirFormComponent: PirFormComponent;
  @ViewChild(LuxFormComponent) luxFormComponent: LuxFormComponent;
  @ViewChild(SwitchFormComponent) switchFormComponent: SwitchFormComponent;
  @ViewChild(BandSettingsComponent) bandSettingsComponent: BandSettingsComponent;
  @ViewChild(HoldTimeOneComponent) holdTimeOneComponent: HoldTimeOneComponent;
  @ViewChild(HoldTimeTwoComponent) holdTimeTwoComponent: HoldTimeTwoComponent;
  nodeXid: any;
  UIDICTIONARY:any;

  constructor(
    private nodeService: NodeService,
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
      this.controllerNodeModel = data;
      this.profile = this.controllerNodeModel.profile;
      this.nodeSettings = this.profile.nodeSettings;
      this.pirSettings = this.profile.pirSettings;
      this.luxSettings = this.profile.luxSettings;
      this.switchSettings = this.profile.switchSettings;
      this.bandSettings = this.profile.bandSettings;

      if (this.nodeSettings.enableHoldTimeOne) {
        this.isEnableHoldTimeOne = this.nodeSettings.enableHoldTimeOne;
        this.holdTimeOneComponent.setHoldTimeOne(this.nodeSettings);
      }
      if (this.nodeSettings.enableHoldTimeTwo) {
        this.isEnableHoldTimeTwo = this.nodeSettings.enableHoldTimeTwo;
        this.holdTimeTwoComponent.setHoldTimeTwo(this.nodeSettings);
      }

      if (this.pirSettings) {
        this.isPirChecked = this.profile.pirSettingsEnabled;
        this.pirFormComponent.setPirModel(this.pirSettings);
      }
      if (this.luxSettings) {
        this.isLuxChecked = this.profile.luxSettingsEnabled;
        this.luxFormComponent.setLuxModel(this.luxSettings);
      }
      if (this.profile.nodeSettings.type === this.nodeTypes.get('Enocean Relay')) {
        this.isEnoceanRelay = true;
        this.luxFormComponent.enableAddressField(this.isEnoceanRelay && !this.nodeSettings.enableHoldTimeOne);
        this.isSwitchChecked = this.profile.enoceanSwitchEnabled;
        this.switchSettings = this.profile.switchSettings;
        this.switchFormComponent.setSwitchModel(this.profile.switchSettings);
      }
      if (this.profile.bandSettings) {
        this.isBandChecked = this.profile.bandSettingsEnabled;
        this.bandSettings = this.profile.bandSettings;
        this.bandSettingsComponent.setBandModel(this.profile.bandSettings);
      }
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
