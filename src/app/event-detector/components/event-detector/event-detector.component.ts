import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {DataPointModel} from '../../../datasource/model/dataPointModel';
import {DatasourceService} from '../../../datasource/service/datasource.service';
import {Router} from '@angular/router';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {
  EventDetectorsComponent
} from '../../../datasource/components/common/point-edit/event-detector/event-detectors.component';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, EventDetectorsComponent, MatModuleModule],
  providers: [DictionaryService, DatasourceService],
  selector: 'app-event-detector',
  templateUrl: './event-detector.component.html',
  styleUrls: []
})
export class EventDetectorComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  selectedType!: number;
  dataPointsList!: DataPointModel[];
  dataPoint!: DataPointModel;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  componentRef: any;
  UIDICTIONARY : any;

  constructor(private datasourceService: DatasourceService, private router: Router, public dictionaryService: DictionaryService, private resolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('eventDetector').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  eventDetectorDataPoints(id: number) {
    this.subs.add(this.datasourceService.getDataSourcePointsbyLimit(id, 100, 0).subscribe(data => {
      this.dataPointsList = data;

    }));
  }

  selectDataPoint(event: { source: { selected: any; }; }, dataPoint: DataPointModel) {
    if (event.source.selected) {
      this.dataPoint = dataPoint;
      this.loadEventDetector(dataPoint);
    }
  }

loadEventDetector(dataPoint: DataPointModel) {
  this.entry.clear();
  // Directly pass the component class
  this.componentRef = this.entry.createComponent(EventDetectorsComponent);
  this.componentRef.instance.dataPoint = dataPoint;
}


}
