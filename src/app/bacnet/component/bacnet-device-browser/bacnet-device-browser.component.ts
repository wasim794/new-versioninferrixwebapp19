import { Component, OnInit } from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface BacnetNode {
  name: string;
  children?: BacnetNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-bacnet-device-browser',
  templateUrl: './bacnet-device-browser.component.html'
})
export class BacnetDeviceBrowserComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  private _transformer = (node: BacnetNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  public nodeTreeHide!:boolean;

  constructor() {
    super();
    // Sample data structure - modify according to your BACnet device structure
    const TREE_DATA: BacnetNode[] = [
      {
        name: 'Network 1',
        children: [
          {
            name: 'Device 1',
            children: [
              { name: 'Point 1' },
              { name: 'Point 2' }
            ]
          },
          { name: 'Device 2' }
        ]
      },
      {
        name: 'Network 2',
        children: [
          { name: 'Device 3' }
        ]
      }
    ];
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {}

  hasChild = (_: number, node: FlatNode) => node.expandable;
  

  dataHideShow(){
  this.nodeTreeHide=true;
  }
}


