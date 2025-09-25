import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {NodeService, ProfileService} from '../../shared/service';
import {JsonDataModel} from '../../../common/model/jsonDataModel';
import {
  AutoModeModel,
  ControllerNodeModel,
  NodesFilterModel, NodesModel,
  NodeStatsModel,
  UserControlModel
} from '../../shared/model';
import {CommonService} from '../../../services/common.service';
import {FormControl} from '@angular/forms';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {FilterNodesComponent} from '../filter-nodes/filter-nodes.component';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, FilterNodesComponent],
  providers: [NodeService, ProfileService, DictionaryService],
  selector: 'app-tab-discovered-nodes',
  templateUrl: './discovered-nodes.component.html',
  styleUrls: []
})

export class DiscoveredNodesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('profileCreatorSidebar') public profileCreatorSidebar!: MatSidenav;
  @ViewChild('filterSidebar') public filterSidebar!: MatSidenav;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;

  isNodeOn = new FormControl();
  private componentRef: any;
  commissioned = false;
  nodes!: ControllerNodeModel[];
  profiles!: JsonDataModel[];
  userControlModel = {} as UserControlModel;
  nodesFilter = new NodesFilterModel();
  nodesModels = {} as NodesModel;
  searchDiscovered: any;
  profileXid!: string;
  applySuccessMessage = 'Profile Applied Successfully';
  totalNodes!: number;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [12, 16, 20];
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
  public UIDICTIONARY:any;
  private disableMsg="Automode Disable";

  constructor(private resolver: ComponentFactoryResolver,
              private nodeService: NodeService,
              private commonService: CommonService,
              public dictionaryService: DictionaryService,
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

  displayedColumns: string[] = ['S.No.', 'Node Type', 'Address', 'Status', 'Profiles', 'Off/On', 'Dimming', 'Auto', 'Actions'];
  checked!: boolean;

  createComponent(componentType: any) {
    this.entry.clear();
    if (componentType === 'FILTER_NODES') {
      const factory = this.resolver.resolveComponentFactory(FilterNodesComponent);
      this.componentRef = this.entry.createComponent(factory);
    }
  }



  ngOnInit() {
      this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
    this.getNodes(this.limit, this.offset);
    this.getProfiles();
    this.subs.add(this.nodeService.offsite(false, false).subscribe((data) => {
      this.offsite = data.offsite;
    }));
    this.getNodeStats();
    this.staticColor();
  }


  getNodes(limit: any, offSet: any) {
    this.subs.add(this.nodeService.getNodes(limit, offSet, this.commissioned, this.sortingType, this.sortingProperty).subscribe((data: any) => {
      this.totalNodes = data.total;
      this.nodes = data.items;

    }));
  }

  getProfiles() {
    this.subs.add(this.nodeService.getProfiles().subscribe(data => {
      this.profiles = data.items;
    }));
  }

  getNodeStats() {
    this.subs.add(this.nodeService.nodeStats().subscribe((data) => {
      this.nodeStats = new NodeStatsModel(data.stats);
    }));
  }

// Todo need to fix this, as every time isNodeOn is false
  nodeOnOff(node: any) {
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
      this.commonService.notification('Dim value set to ' + this.userControlModel.dimValue);
    }));
  }

  profileChange(event: any) {
    this.profileXid = event;
  }

  applyProfileToNode(node: any) {
    this.subs.add(this.nodeService.applyProfileToNode(node.xid, this.profileXid).subscribe(data => {
      this.commonService.notification(data.responseMessage);
      this.getNodes(this.limit, this.offset);
      this.getNodeStats();
    }));
  }


  getNext(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getNodes(limit, this.offset);
  }

  filterDiscoveredNodes() {
    this.status = !this.status;
    this.filterSidebar.open();
    this.createComponent('FILTER_NODES');
  }

  closeAllSidebar() {
    this.filterSidebar.close();
  }

  refreshDiscoveredNodes() {
    this.getNodes(this.limit, this.offset);
  }

  clearFilter() {
    this.getNodes(this.limit, this.offset);
  }

  sortingDiscoveredNodes(event: any) {
    if (event.direction !== '') {
      this.sortingType = event.direction;
      this.sortingProperty = event.active.trim().toLowerCase();
      if (event.active.trim().toLowerCase() === 'node type') {
        this.sortingProperty = 'definition';
      }
      this.getNodes(this.limit, this.offset);
    }
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

  offsiteChange() {
    this.subs.add(this.nodeService.offsite(this.offsite, true).subscribe((data) => {
      this.offsite = data.offsite;
      const message = this.offsite ? 'enabled' : 'disabled';
      this.commonService.notification('Offsite mode is: ' + message);
    }));
  }

  deleteNode(element: any) {
    this.commonService.openConfirmDialog('Are you sure , you want to delete.....?',
      element.address).afterClosed().subscribe((response: any) => {
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

    goBack(){
  this.commonService.goBackHistory();
}
}
