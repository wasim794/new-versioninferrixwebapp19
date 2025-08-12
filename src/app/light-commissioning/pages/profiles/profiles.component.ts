import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  Output,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

import { LedControllerProfileComponent } from '../led-controller-profile/led-controller-profile.component';
import { DigitalInputControllerProfileComponent } from '../digital-input-controller-profile/digital-input-controller-profile.component';
import { RelayControllerProfileComponent } from '../relay-controller-profile/relay-controller-profile.component';
import { FilterProfileComponent } from '../filter-profile/filter-profile.component';
import { WristbandComponent } from '../wristband/wristband.component';

import { ProfileService } from '../../shared/service';
import { DictionaryService } from "../../../core/services";
import { CommonService } from '../../../services/common.service';
import { UnsubscribeOnDestroyAdapter } from '../../../common';
import { NodesFilterModel, ProfileJsonDataModel } from '../../shared/model';
import { DataPointModel } from "../../../core/models/dataPoint";

@Component({
  selector: 'app-lightsettings',
  templateUrl: './profiles.component.html',
  styleUrls: []
})
export class ProfilesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('profileCreatorSidebar') public profileCreatorSidebar: MatSidenav;
  @ViewChild('profileCreatorSidebars') public profileCreatorSidebars: MatSidenav;
  @ViewChild('dynamicLoadComponent', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild(LedControllerProfileComponent) profileFormComponent: LedControllerProfileComponent;
  @ViewChild(DigitalInputControllerProfileComponent) LedControllerProfileComponent: DigitalInputControllerProfileComponent;

  totalProfiles: number;
  pageSizeOptions: number[] = [8, 12, 16, 20];
  profiles: ProfileJsonDataModel[] = [];
  private componentRef: any;
  limit = 12;
  offset = 0;
  errorMsg: any;
  profileDetail: ProfileJsonDataModel;
  profileToDelete: any;
  publishers: any;
  profileTypes = [];
  componentType: any;
  status = false;
  sortingType = 'default';
  applySuccessMessage = 'Profile Copy Applied Successfully';
  deleteMsg = "delete successful";
  profileFilterModel: any = new NodesFilterModel();
  displayedColumns: string[] = ['select', 'position', 'name', 'actions'];
  dataSources: any = new MatTableDataSource<ProfileJsonDataModel>();
  selection = new SelectionModel<string>(true, []);
  private sortingProperty: string;
  searches: string;
  public UIDICTIONARY: any;

  constructor(
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private profileService: ProfileService,
    private dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private commonService: CommonService
  ) {
    super();

    this.subs.add(this.profileService.getSaveProfile().subscribe((data) => {
      this.profileDetail = data;
      this.profiles.push(data);
      if (this.profiles.length > 12) {
        this.getProfiles(this.limit, this.offset);
      }
      this.getProfileTypes();
      this.closeAllSidebar(data);
    }));

    this.subs.add(this.profileService.getProfileFilterSearch().subscribe((data) => {
      this.profiles = data;
      this.totalProfiles = this.profiles.length;
      this.profileCreatorSidebars.close();
    }));
  }

  ngOnInit() {
    this.getDictionaryUI();
    this.getProfileTypes();
    this.getProfiles(this.limit, this.offset);
  }

  getDictionaryUI(){
      this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  filterPublisher(event) {
    if  (event.key === "Enter" || event.type === "click") {
        const param = 'like(name,%2A' + this.searches + '%2A)';
        this.profileService.get(param).subscribe(data => {
        this.dataSources = data;
      });
    } else {
      this.getProfiles(this.limit, this.offset);
    }
  }

  sortingCommissionedNodes(event) {
    if (event.direction !== '') {
      this.sortingType = event.direction;
      this.sortingProperty = event.active.trim().toLowerCase();
      if (event.active.trim().toLowerCase() === 'node type') {
        this.sortingProperty = 'definition';
      }
      if (event.active.trim().toLowerCase() === 'profiles') {
        this.sortingProperty = 'jsonDataId';
      }
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSources.length;
    return numSelected === numRows;
  }

  isChecked(node: DataPointModel): boolean {
    return this.selection.isSelected(node.xid);
  }

  addDataPointXid(event, dataPoint) {
    if (event.checked) {
      this.selection.select(dataPoint.xid);
    } else {
      this.selection.deselect(dataPoint.xid);
    }
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.dataSources.forEach(value =>
      this.selection.select(value.xid)
    );
  }

  componentLoaded(componentType) {
    this.entry.clear();
    const factories = {
      'LIGHT_CONTROLLER.PROFILE': LedControllerProfileComponent,
      'RELAY_CONTROLLER.PROFILE': RelayControllerProfileComponent,
      'DIGITAL_INPUT_CONTROLLER.PROFILE': DigitalInputControllerProfileComponent,
      'FILTER_PROFILE': FilterProfileComponent,
      'WRIST_BAND.PROFILE': WristbandComponent
    };

    const component = factories[componentType];
    if (component) {
      const factory = this.resolver.resolveComponentFactory(component);
      this.componentRef = this.entry.createComponent(factory);
      this.componentRef.instance.notifyParent.subscribe(data => this.closeAllSidebar(data));
      this.componentRef.instance.notifyParent.subscribe(data => this.getProfiles(this.limit, this.offset));
    }
  }

  getProfileTypes() {
    this.subs.add(this.profileService.getProfileType().subscribe(data => {
      this.profileTypes = data.items;
    }));
  }

  getProfiles(limit, offset) {
    this.subs.add(this.profileService.getAllProfiles(limit, offset).subscribe(data => {
      this.totalProfiles = data['total'];
      this.dataSources = data['items'];
    }, err => this.errorMsg = err));
  }

  addProfile(event, componentType) {
    this.getDictionaryUI();
    if (event.source.selected) {
      this.profileService.profileXid = null;
      this.profileCreatorSidebar.open();
      this.componentLoaded(componentType);
    }
  }

  showProfileDetail(profile) {
    this.componentType = profile.jsonData.jsonDataType;
    this.componentLoaded(this.componentType);
    this.profileCreatorSidebar.open();
    this.profileDetail = profile;
    this.profileService.setProfileXid(this.profileDetail.xid);
  }

  copyProfile(profile) {
    this.subs.add(this.profileService.copyProfile(profile.xid).subscribe(data => {
      this.profileService.setSaveProfile(data);
      this.commonService.notification(this.applySuccessMessage);
      this.getProfiles(this.limit, this.offset);
    }, error => {
      error.result.message.forEach(value =>
        this.commonService.notification(value.message)
      );
    }));
  }

  deleteProfile(profile) {
    this.profileToDelete = profile;
    this.subs.add(this.commonService.openConfirmDialog('Are you sure, you want to delete?', profile.name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.profileService.deleteProfile(this.profileToDelete.xid).subscribe(data => {
          this.commonService.notification(this.deleteMsg);
          this.getProfiles(this.limit, this.offset);
        }));
      }
    }));
  }

  getNext(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getProfiles(limit, this.offset);
  }

  closeAllSidebar(event) {
    this.profileCreatorSidebar.close();
    this.profileCreatorSidebars.close();
    this.getProfiles(this.limit, this.offset);
  }
}
