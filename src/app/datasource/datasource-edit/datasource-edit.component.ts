import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {DatasourceModel} from '../model';
import {AssetTagComponent} from '../components/asset-tag';

@Component({
  selector: 'app-datasource-edit',
  templateUrl: './datasource-edit.component.html',
  styleUrls: []
})
export class DatasourceEditComponent {
  datasource: any = DatasourceModel;
  modal: any = new DatasourceModel();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @ViewChild('dynamicLoadComponent', {
    read: ViewContainerRef
  }) entry: ViewContainerRef | undefined;
  componentRef!: any;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  addNew(datasourceType: any) {
    // this.entry.clear();
    const factory = this.componentLoaded(datasourceType);
    // this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.addNewDatasource(datasourceType);
    this.componentRef.instance.addedSavedDatasource.subscribe(($event: any) => {
      this.addedSavedDatasource.emit($event);
    });
  }

  getDataSource(datasource: DatasourceModel, index: any, edit: boolean) {
    // this.entry.clear();
    const factory = this.componentLoaded(datasource.modelType);
    // this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.getDataSource(datasource, index, edit);
    this.componentRef.instance.addedUpdatedDatasource.subscribe(($event: any) => {
      this.addedUpdatedDatasource.emit($event);
    });
  }


  private componentLoaded(dataSourceType: string){
    const componentMapping: Record<string, any> = {
      'STUDENT_ASSET_TAG.DS': AssetTagComponent
    };

    const component = componentMapping[dataSourceType];
    return component ? this.resolver.resolveComponentFactory(component) : null;
  }




}
