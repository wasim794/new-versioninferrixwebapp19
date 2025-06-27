import {Component, OnInit} from '@angular/core';
import {DatapointService} from '../service/datapoint.service';
import {DataPoint} from '../model/dataPoint';
import {DictionaryService} from "../../core/services/dictionary.service";

@Component({
  selector: 'app-datapoint-list',
  templateUrl: './datapoint-list.component.html',
  styleUrls: []
})
export class DatapointListComponent implements OnInit {
  dataPointList: DataPoint[];
  dataPoint: any = DataPoint;
  dataPointName: string;
  dataPointXid: string;
  dataPointEnable: string;
  dataPointDeviceName: string;
  UIDICTIONARY : any;

  constructor(private datapointService: DatapointService, public dictionaryService: DictionaryService) {
  }

  ngOnInit() {
    this.datapointService.getDataPointList().subscribe(data => {
      this.dataPointList = data;
    }, err => console.log(err));
   this.dictionaryService.getUIDictionary('dataPoint').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });

  }

  getDataPoint(dataPoint) {
    this.datapointService.getDataPointDetail(dataPoint.xid).subscribe(data => {
      this.dataPoint = data;
      this.setDataPoint();
    }, err => console.log(err));
  }

  setDataPoint() {
    this.dataPointName = this.dataPoint.name;
    this.dataPointXid = this.dataPoint.xid;
    this.dataPointEnable = this.dataPoint.enabled;
    this.dataPointDeviceName = this.dataPoint.deviceName;
  }
}
