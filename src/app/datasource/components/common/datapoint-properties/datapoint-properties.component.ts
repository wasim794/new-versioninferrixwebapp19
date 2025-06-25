import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DataPointModel} from '../../../model';
import {DataSourceService, DataPointService, DictionaryService} from '../../../../core/services';
import {ValuePurgeComponent, LoggingPropertiesComponent, TextRendererComponent} from '../../common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CommonService} from '../../../../services/common.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

export interface DialogData {
  content: DataPointModel;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, ValuePurgeComponent, LoggingPropertiesComponent, TextRendererComponent],
  selector: 'app-datapoint-properties',
  templateUrl: './datapoint-properties.component.html',
  styleUrls: []
})
export class DatapointPropertiesComponent implements OnInit {
  @ViewChild(TextRendererComponent)
  private textRendererComponent!: TextRendererComponent;
  @ViewChild(LoggingPropertiesComponent)
  private loggingPropertiesComponent!: LoggingPropertiesComponent;
  @ViewChild(ValuePurgeComponent)
  private valuePurgeComponent!: ValuePurgeComponent;
  public dataPoint                  = new DataPointModel();
  public saveMsg                    = 'Saved successfully';
  public tabIndex                   = 0;
  public hideShows!                  : boolean;
  public dataPointReloadSuccess     = 'Setting Successfully';
  public UIDICTIONARY               : any;

  constructor(private datasourceService           : DataSourceService,
              public dictionaryService            : DictionaryService,
              public dialogRef                    : MatDialogRef<DatapointPropertiesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private commonService               : CommonService,
              private dataPointService            : DataPointService) {
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('datasource').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  selectTab(index: number): void {
    this.tabIndex = index;
    this.hideShows = index === 3;
  }
  saveProperties() {
    this.dataPoint = new DataPointModel();
    // this.dataPoint.textRenderer = this.textRendererComponent.addTextRenderProperties();
    this.dataPoint.loggingPropertiesModel = this.loggingPropertiesComponent.dataPoint.loggingPropertiesModel;
    this.dataPoint.purgePeriod = this.valuePurgeComponent.dataPoint.purgePeriod;
    this.dataPointService.dataPointProperties(this.data.content.xid, this.dataPoint).subscribe(data => {
      this.datasourceService.get();
      this.commonService.notification(this.dataPointReloadSuccess);
    }, err => console.log(err));
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
