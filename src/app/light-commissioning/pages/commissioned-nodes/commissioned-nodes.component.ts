import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {JsonDataModel} from '../../../common/model/jsonDataModel';
import {
  AutoModeModel,
  ControllerNodeModel,
  NodesFilterModel, NodesModel,
  NodeStatsModel,
  UserControlModel
} from '../../shared/model';
import {CommonService} from '../../../services/common.service';
import {NodeService, ProfileService} from '../../shared/service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {FilterNodesComponent} from '../filter-nodes/filter-nodes.component';
import {
  ReadCommissionedNodeSettingsComponent
} from '../led-controller-node-settings/led-controller-node-settings.component';
import {DiControllerNodeSettingsComponent} from '../di-controller-node-settings/di-controller-node-settings.component';
import {
  WristBandControllerNodeSettingComponent
} from '../wrist-band-controller-node-setting/wrist-band-controller-node-setting.component';
import {
  RelayControllerNodeSettingComponent
} from '../relay-controller-node-setting/relay-controller-node-setting.component';
import {MatPaginator} from "@angular/material/paginator";
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, FilterNodesComponent],
  providers: [NodeService, ProfileService, DictionaryService],
  selector: 'app-tab-commissioning',
  templateUrl: './commissioned-nodes.component.html',
  styleUrls: []
})

export class CommissionedNodesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('commissindrawer') public profileSidebar!: MatSidenav;
  @ViewChild('editcommissindrawer') public profileEditSidebar!: MatSidenav;
  @ViewChild('filterSidebar') public filterSidebar!: MatSidenav;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  componentRef: any;
  commissioned = true;
  nodes!: ControllerNodeModel[];
  nodeModel = {} as ControllerNodeModel;
  profiles!: JsonDataModel[];
  userControlModel = {} as UserControlModel;
  nodesFilter = new NodesFilterModel();
  nodesModels = {} as NodesModel;
  searchDiscovered: any;
  sliderValue: any;
  resetSuccessMsg = 'Node Reset Successfully!';
  profileXid!: string;
  applySuccessMessage = 'Profile Applied Successfully';
  pirIntrruptSuccessMessage = 'Successfully';
  totalNodes!: number;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [8, 12, 16, 20];
  displayedColumns: string[] = ['S.No.', 'Node Type', 'Address', 'Status', 'Profiles', 'Off/On', 'Dimming', 'Auto', 'Actions'];
  checked!: boolean;
  status = false;
  sortingType = 'default';
  sortingProperty!: string;
  offsite!: boolean;
  nodeStats!: NodeStatsModel;
  cardOneCss: any;
  cardTwoCss: any;
  cardThreeCss: any;
  cardFourCss: any;
  cardFiveCss: any;
  isAutoMode!: boolean;
  private disableMsg="Automode Disable";
  public UIDICTIONARY:any;


  constructor(
    private resolver: ComponentFactoryResolver,
    private commonService: CommonService,
    public dictionaryService: DictionaryService,
    private nodeService: NodeService,
    private profileService: ProfileService) {
    super();
    this.subs.add(this.profileService.getSaveProfile().subscribe((data) => {
      this.profiles.push(data);
    }));
    this.subs.add(this.nodeService.getFilterSearch().subscribe((data) => {
      this.nodes = data;
      this.totalNodes = this.nodes.length;
      this.filterSidebar.close();
    }));

  }

  componentLoaded(componentType: any) {
    this.entry.clear();
    if (componentType === 'LIGHT_CONTROLLER_V4.NODE') {
      const factory = this.resolver.resolveComponentFactory(ReadCommissionedNodeSettingsComponent);
      this.componentRef = this.entry.createComponent(factory);
    } else if (componentType === 'LIGHT_DI_CONTROLLER.NODE') {
      const factory = this.resolver.resolveComponentFactory(DiControllerNodeSettingsComponent);
      this.componentRef = this.entry.createComponent(factory);
    } else if (componentType === 'LIGHT_RELAY_CONTROLLER.NODE') {
      const factory = this.resolver.resolveComponentFactory(RelayControllerNodeSettingComponent);
      this.componentRef = this.entry.createComponent(factory);
    } else if (componentType === 'FILTER_NODES') {
      const factory = this.resolver.resolveComponentFactory(FilterNodesComponent);
      this.componentRef = this.entry.createComponent(factory);
    } else if (componentType === 'MOKO_BAND.NODE') {
      const factory = this.resolver.resolveComponentFactory(WristBandControllerNodeSettingComponent);
      this.componentRef = this.entry.createComponent(factory);
    }

  }


  ngOnInit() {

    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
    this.subs.add(this.nodeService.offsite(false, false).subscribe((data) => {
      this.offsite = data.offsite;
      this.getNodes(this.limit, this.offset);
      this.getProfiles();
    }));
    this.getNodeStats();
    this.staticColor();
  }

  getNodes(limit: any, offSet: any) {
    this.subs.add(this.nodeService.getNodes(limit, offSet, this.commissioned, this.sortingType, this.sortingProperty).subscribe((data: any) => {
      this.nodes = data.items;
      this.totalNodes = data?.total ?? 0;
    }));
  }


  filterDiscovered(event: any) {
    if (this.searchDiscovered) {
      const encodedSearchValue = encodeURIComponent(this.searchDiscovered);
      this.nodesModels.address = encodedSearchValue;
      this.nodesFilter.filters = this.nodesModels;
      this.nodeService.query(this.nodesFilter, this.commissioned).subscribe(data => {
        this.nodeService.setFilterSearch(data['items']);
        if (JSON.stringify(data['items']) === '[]') {
          this.commonService.notification('Data does not exist please try again  ');
        } else {
         // this.commonService.notification('Data successfully matched ');
        }
      });
      // }));
    } else {
      this.getNodes(this.limit, this.offset);
    }

  }

  getProfiles() {
    this.subs.add(this.nodeService.getProfiles().subscribe(data => {
      this.profiles = data.items;
    }));
  }

  getNodeStats() {
    this.subs.add(this.nodeService.nodeStats().subscribe((data) => {
      this.nodeStats = new NodeStatsModel(data?.stats ?? {});
    }));
  }

  nodeEnableDisable(node: any) {
    this.userControlModel.address = node.address;
    if (node.onOff) {
      this.userControlModel.dimValue = 100;
      node.dimValue = 100;
    } else {
      this.userControlModel.dimValue = 0;
      node.dimValue = 0;
    }
    const xid = node.xid;
    this.subs.add(this.nodeService.nodeControl(this.userControlModel, xid).subscribe(data => {
      if (node.onOff) {
        this.commonService.notification('Node Switched On');
      } else {
        this.commonService.notification('Node Switched Off');
      }
    }));
  }

  nodeDim(event: any, node: any) {
    this.userControlModel.address = node.address;
    this.userControlModel.dimValue = event.value;
    node.onOff = this.userControlModel.dimValue > 0;
    const xid = node.xid;
    this.subs.add(this.nodeService.nodeControl(this.userControlModel, xid).subscribe(data => {
      this.commonService.notification('Dim value set to ' + this.userControlModel.dimValue + ' %');
    }));
  }

  readNode(node: any) {
    this.commonService.openConfirmDialog('Are you want to sure',
      node.address).afterClosed().subscribe(response => {
      if (response) {
    this.nodeService.setEdit(true);
    this.nodeService.setNodeXid(node.xid);
    this.subs.add(this.nodeService.getNodeByXid(node.xid).subscribe(data => {
      this.nodeModel = data;
      this.nodeService.setNodeAfterEdit(this.nodeModel);
      this.profileSidebar.open();
      this.componentLoaded(node.nodeType);
    }));
    return true;
      } else {
        return false;
      }
    });
  }

  resetNode(node: any) {
    this.commonService.openConfirmDialog('Are you sure , you want to',
      node.address).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.nodeService.resetNode(node.xid).subscribe(data => {
      this.commonService.notification(data.responseMessage);
      this.getNodes(this.limit, this.offset);
      this.getNodeStats();
    }));
    return true;
      } else {
        return false;
      }
    });
  }

  profileChange(event: any) {
    this.profileXid = event;
  }

  applyProfileToNode(node: any) {
    this.commonService.openConfirmDialog('Are you sure you want to Apply',
      node.address).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.nodeService.applyProfileToNode(node.xid, this.profileXid).subscribe(data => {
      this.commonService.notification(this.applySuccessMessage);
      this.getNodes(this.limit, this.offset);
    }));
    return true;
      } else {
        return false;
      }
    });
  }

  pirInterrupt(enableDisable: any, node: any){
    let enableMsg;
    enableDisable===true? enableMsg = 'enabled':enableMsg = 'disabled';
    this.subs.add(this.nodeService.enableDisablePir(enableDisable, node.xid).subscribe(data=>{
      this.commonService.notification(enableMsg+' '+this.pirIntrruptSuccessMessage);
      this.getNodes(this.limit, this.offset);
    }));

  }
  readCommission(node: any) {
    this.commonService.openConfirmDialog('Are you sure , you want to',
      node.address).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.nodeService.getNodeSettings(node.xid).subscribe(data => {
      this.commonService.notification('Node settings read request sent!');
    }));
    return true;
      } else {
        return false;
      }
    });
  }

  getNext(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getNodes(limit, this.offset);
  }

  filterNodes() {
    this.status = !this.status;
    this.filterSidebar.open();
    this.componentLoaded('FILTER_NODES');
  }

  clearFilter() {
    this.getNodes(this.limit, this.offset);
  }

  refreshCommissionedNodes() {
    this.getNodes(this.limit, this.offset);
  }

  closeAllSidebar() {
    this.filterSidebar.close();
  }

  sortingCommissionedNodes(event: any) {
    if (event.direction !== '') {
      this.sortingType = event.direction;
      this.sortingProperty = event.active.trim().toLowerCase();
      if (event.active.trim().toLowerCase() === 'node type') {
        this.sortingProperty = 'definition';
      }
      if (event.active.trim().toLowerCase() === 'profiles') {
        this.sortingProperty = 'jsonDataId';
      }
      this.getNodes(this.limit, this.offset);
    }
  }

  offsiteChange() {
    this.subs.add(this.nodeService.offsite(this.offsite, true).subscribe((data) => {
      this.offsite = data.offsite;
      const message = this.offsite ? 'enabled' : 'disabled';
      this.commonService.notification('Offsite mode is: ' + message);
    }));
  }

  pushProfileToNode(element: any) {
    this.commonService.openConfirmDialog('Are you sure , you want to',
      element.address).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.nodeService.pushProfileToNode(element.xid).subscribe((data) => {
      this.commonService.notification(data.responseMessage);
    }));
    return true;
      } else {
        this.getNodes(this.limit, this.offset);
        return false;
      }
    });
  }

  deleteNode(element: any) {
    this.commonService.openConfirmDialog('Are you sure , you want to delete.....?',
      element.address).afterClosed().subscribe(response => {
      if (response) {
    this.subs.add(this.nodeService.delete(element.xid).subscribe((data) => {
      this.commonService.notification('Node ' + data.name + ' is deleted');
    }));
    return true;
      } else {
        return false;
      }
    });
  }

  staticColor() {
    this.cardOneCss = {'background': '#7c7a7a', 'color': '#ffffff'};
    this.cardTwoCss = {'background': 'lightslategray', 'color': '#ffffff'};
    this.cardThreeCss = {'background': 'steelblue', 'color': '#ffffff'};
    this.cardFourCss = {'background': 'teal', 'color': '#ffffff'};
    this.cardFiveCss = {'background': 'darkslategrey', 'color': '#ffffff'};
  }

  autoMode(element: any) {
    const model = new AutoModeModel();
    model.enable = this.isAutoMode;
    model.address = element.address;
    element.isAutoMode == true ? this.nodeService.sendAutoMode(element.xid, model).subscribe((data) => this.commonService.notification(data.responseMessage)):
      this.commonService.notification(this.disableMsg);
  }
}


