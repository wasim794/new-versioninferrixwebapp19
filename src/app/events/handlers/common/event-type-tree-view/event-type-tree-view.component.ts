import {Component, Input, OnInit} from '@angular/core';
import {EventTypesService} from '../../../../core/services';
import {FlatTreeControl} from '@angular/cdk/tree';
import {DynamicDataSource, DynamicFlatNode} from '../../shared';
import {EventTypeMatcherModel} from "../../../../core/models/events";

@Component({
  selector: 'app-event-type-tree-view',
  templateUrl: './event-type-tree-view.component.html'
})
export class EventTypeTreeViewComponent implements OnInit {

  @Input() events: EventTypeMatcherModel[];

  constructor(
    public typesService: EventTypesService,
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, typesService);
  }

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  getLevel = (node: DynamicFlatNode) => node.level;
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
  isChecked = (node: DynamicFlatNode) => node.isChecked;

  ngOnInit(): void {
    this.typesService.query().subscribe((events) => {
      this.typesService.initialData(events);
      this.dataSource.data = this.typesService.rootLevelNodes;
    });
    this.dataSource.eventHandlerTypes.next(this.events);
  }


  selectedEventType(node: DynamicFlatNode, checked: boolean) {
    node.isChecked = checked;

    if (checked) {
      if (!this.dataSource.selectedEventTypes.isSelected(node.item.type)) {
        this.dataSource.selectedEventTypes.select(node.item.type);
      }
    } else {
      this.dataSource.selectedEventTypes.deselect(node.item.type);
    }
  }
}
