import {CollectionViewer, DataSource, SelectionChange, SelectionModel} from '@angular/cdk/collections';
import {DynamicFlatNode} from './dynamic-flat-node';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {map} from 'rxjs/operators';
import {EventTypesService} from '../../../core/services';
import {AbstractEventTypesModel, EventTypeMatcherModel} from '../../../core/models/events';

export class DynamicDataSource extends DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);
  eventHandlerTypes = new BehaviorSubject<EventTypeMatcherModel[]>([]);
  selectedEventTypes = new SelectionModel<AbstractEventTypesModel<any>>(true);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _service: EventTypesService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[] | ReadonlyArray<DynamicFlatNode>> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added || (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => {
        this.toggleNode(node, true);
      });
    }

    if (change.removed) {
      change.removed.slice().reverse().forEach(node => {
        this.toggleNode(node, false);
      });
    }
  }

  toggleNode(node: any, expand: boolean) {
    node.item.type.subType = node.item.supportsSubtype ? node.item.type.subType || undefined : null;
    this._service.query(node.item.type).subscribe((events: any) => {
      const children = events;
      const index = this.data.indexOf(node);
      if (!children || index < 0) {
        // If no children, or cannot find the node, no op
        return;
      }

      if (expand) {
        const nodes: DynamicFlatNode[] = [];
        children.map((event: any) => {
            if (this.eventHandlerTypes.value && this.eventHandlerTypes.value.length) {
              const eventType = this.eventHandlerTypes.value.filter((evenType) =>
                this._service.typeId(evenType) === this._service.typeId(event.type));
              if (eventType && eventType.length) {
                this.selectedEventTypes.select(event.type);
                nodes.push(new DynamicFlatNode(event, node.level + 1, this._service.isExpandable(event),
                  !this._service.isExpandable(event), true));
              } else {
                nodes.push(new DynamicFlatNode(event, node.level + 1, this._service.isExpandable(event),
                  !this._service.isExpandable(event)));
              }
            } else {
              nodes.push(new DynamicFlatNode(event, node.level + 1, this._service.isExpandable(event),
                !this._service.isExpandable(event)));
            }
          },
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) {
        }
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
    });
  }
}
