import {Component, Input, OnInit} from '@angular/core';
import {NodeService} from '../../shared/service';
import {NodesFilterModel, NodesModel} from '../../shared/model';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {JsonDataModel} from '../../../common/model/jsonDataModel';
import {CommonService} from 'src/app/services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-filter-nodes',
  templateUrl: './filter-nodes.component.html',
  styleUrls: []
})
export class FilterNodesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  nodesFilter = new NodesFilterModel();
  nodesModel = {} as NodesModel;
  nodeTypes = [];
  disableClose: boolean;
  profiles: JsonDataModel[];
  @Input() commissioned: boolean;
  public UIDICTIONARY:any;

  constructor(private nodeService: NodeService, public dictionaryService: DictionaryService, private commonService: CommonService) {
    super();
  }

  ngOnInit() {
    this.getNodeTypes();
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getProfiles();
  }

  getNodeTypes() {
    this.subs.add(this.nodeService.getNodeType().subscribe(data => {
      this.nodeTypes = data.items;
    }));
  }

  getProfiles() {
    this.subs.add(this.nodeService.getProfiles().subscribe(data => {
      this.profiles = data.items;
    }));
  }

  setNodeTypeToModel(event, nodeType) {
    if (event.source.selected) {
      this.nodesModel.definition = nodeType;
    }
  }

  filterNodes() {
    this.nodesFilter.filters = this.nodesModel;
    this.nodeService.query(this.nodesFilter, this.commissioned).subscribe(data => {
      this.nodeService.setFilterSearch(data['items']);
      this.getNodeTypes();
      this.nodesModel = {};
      if (JSON.stringify(data['items']) === '[]') {
        this.commonService.notification('Data does not exist please try again  ');
      } else {
        this.commonService.notification('Data successfully matched ');
      }
    });
  }
}
