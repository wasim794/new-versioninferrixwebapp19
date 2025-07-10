import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatasourceService} from '../../service/datasource.service';
import {CommonService} from '../../../services/common.service';
import {DataPointModel} from '../../model/dataPointModel';
import {DatapointPropertiesComponent} from '../common/datapoint-properties';
import {commonHelp} from "../../../help/commonHelp";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {HelpModalComponent} from '../../../help/help-modal/help-modal.component';
import {DatapointTableComponent} from '../common/datapoint-table';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {VirtualDataSourceModel, VirtualPointLocatorModel} from '../virtual-datasource';
import {
  allAlphanumeric,
  allBinary,
  allMultistate,
  allNumeric, allPollingPeriodType, allStartValue,
  DATA_TYPES
} from "../../../common";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

class Item {
  key!: string;
  val!: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointPropertiesComponent, DatapointTableComponent, ReactiveFormsModule],
  providers: [DatasourceService, DictionaryService],
  selector: 'app-virtual-datasource',
  templateUrl: './virtual-datasource.component.html',
  styleUrls: []
})
export class VirtualDatasourceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(DatapointPropertiesComponent, {static: true})
  private pointProperties!: DatapointPropertiesComponent;
  @ViewChild(DatapointTableComponent, {static: true})
  private datapointTableComponent!: DatapointTableComponent;
  datasource= new VirtualDataSourceModel();
  permissions!: string;
  isEdit!: boolean;
  declare datapointButtonsView: boolean;
  info = new commonHelp();
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  incrementVal: any;
  dataPoint: any = new DataPointModel();
  pointLocator = new VirtualPointLocatorModel();
  dataTypes = DATA_TYPES;
  allDataTypes: any = [];
  binary=allBinary;
  multistate= allMultistate;
  numeric=allNumeric;
  alphanumeric=allAlphanumeric;
  pollingPeriodType =allPollingPeriodType;
  startValue =allStartValue;
  selectedValue: any = 'BINARY';
  noChanges!:boolean;
  changeValueType: any = 'ALTERNATE_BOOLEAN';
  currentChangeType = 'ALTERNATE_BOOLEAN';
  dataPointsByTypes: any= [];
  error: any = [];
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  dataPointModel: DataPointModel = new DataPointModel();
  dsId!: number;
  read = new FormControl();
  timePeriodType = new FormControl();
  editPermission: any = [];
  title_ds = 'Virtual Data Source';
  title_dp = 'Virtual Point Properties';
  tabIndex = 0;
  displayForm!: boolean;
  currentDatapointIndex!: number;
  show!: boolean;
  public messageError!: boolean;
  public datapointForm!: boolean;
  UIDICTIONARY : any;
  datasourceTitleName:any;
  isActivePd: boolean = false;
  isActivePdSmall!:boolean;

  constructor(private route: ActivatedRoute, public dictionaryService: DictionaryService, private datasourceService: DatasourceService, private router: Router,
              private commonService: CommonService, private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('virtual').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.dropDownSelect();
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  virtualDSModal(title: any) {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'virtual Ds Info', content: this.info.HtmlVirtualIDS},
      disableClose: true
    });
  }

  addNewDatasource(dsType: any) {

    this.addPermission();
    this.currentChangeType = 'div_ALTERNATE_BOOLEAN';
    this.pointLocator.dataType = this.selectedValue;
    this.datasource.modelType = dsType;
    this.datasource.timePeriod.timePeriodType = 'MINUTES';
  }

  dropDownSelect(){
    if(this.selectedValue==='BINARY'){
      this.allDataTypes = this.binary;
      }else if(this.selectedValue==='MULTISTATE') {
      this.allDataTypes = this.multistate;
      }else if(this.selectedValue==='NUMERIC') {
      this.allDataTypes = this.numeric;
      }else if(this.selectedValue==='ALPHANUMERIC') {
      this.allDataTypes = this.alphanumeric;
    }
  }

  addPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }


  changeStatus(e: any, dpXid: any) {
    const statusValue = e.target.checked;
    this.datasourceService.setDatapointStatus(dpXid, statusValue).subscribe();
  }

  getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm=true;
    this.subs.add(this.datasourceService.getDataSource(datasource.xid).subscribe(data => {
        this.datasource = data;
        this.addPermission();
        this.dsId = this.datasource.id;
        this.editPermission = this.datasource.editPermission.split(',');
      }, err => console.log(err))
    );
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePd = !this.isActivePd;
    this.isActivePdSmall = true;

  }


   addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.datapointButtonsView = false;
    this.dataPoint.dataSourceXid = xid;
    this.selectedValue = 'BINARY';
    this.changeType('ALTERNATE_BOOLEAN', true);
    return true;
  }



  getDataPoints(datasource?:any) {
    this.datapointTableComponent.setDatapoints(datasource);

  }

  validateTimePeriod() {
    this.error = [];
    if (isNaN(this.datasource.timePeriod.timePeriod)) {
      const prop = {
        'message': 'Value must be a number',
        'property': 'Time Periods'
      };
      this.error.push(prop);
      this.commonService.messageDisplay('errorMsg');
      return;
    }
  }

  saveDatasource() {
    delete this.datasource.connectionDescription;
    this.error = [];
    this.validateTimePeriod();
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(this.datasourceService.saveDatasource(this.datasource).subscribe(data => {
      // @ts-ignore
      this.datasource = data;
      this.dataPoint.dataSourceXid = this.datasource.xid;
      this.getDataPoints(this.datasource);
      this.isEdit = true;
      this.addedSavedDatasource.emit(data);
      this.commonService.notification('Datasource ' + this.datasource.name + ' ' + this.saveSuccess);
    }, error => {
      this.error = error.result.message;
      this.timeOutFunction();
    }));
  }

  updateDatasource() {
    this.error = [];
    this.validateTimePeriod();
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(this.datasourceService.updatedataSource(this.datasource).subscribe(data => {
      this.addedUpdatedDatasource.emit(data);
      this.commonService.notification('Datasource ' + this.datasource.name + ' ' + this.updateSuccess);
    }, error => {
      this.error = error.result.message;
      this.timeOutFunction();
    }));
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.datapointButtonsView = true;
    this.subs.add(this.datasourceService.getDataPointDetails(dataPointXid).subscribe(data => {
        this.displayForm = true;
        this.dataPoint = data;
        this.pointLocator = this.dataPoint.pointLocator;
        this.binaryConditions(this.dataPoint.pointLocator.dataType);
        this.dataType(this.pointLocator.dataType);
        this.changeType(this.pointLocator.changeType, false);
      })
    );
  }

  dataType(event: any) {
    this.selectedValue = event;
    this.pointLocator.dataType = this.selectedValue;
    this.dropDownSelect();
    this.binaryConditions(this.selectedValue);
    const element = document.getElementById(this.currentChangeType);
if (element) {
    element.style.display = 'none';
}
  }

  private binaryConditions(selectedValue: any){
    if(selectedValue==='BINARY'){
      this.noChanges = true;
    }else{
      this.noChanges = false;
    }
  }

  changeType(divId: any, updateField: any) {
    if (updateField) {
      this.pointLocator = new VirtualPointLocatorModel();
      this.pointLocator.dataType = this.selectedValue;
      this.pointLocator.changeType = divId;
    }
    this.changeValueType = divId;
    if (divId === 'ANALOG_ATTRACTOR') {
      const numericTypeId = 3;
      this.datasourceService.getDatapointsByTypeId(numericTypeId).subscribe(data => {
        this.dataPointsByTypes = data;
      });
    }
  }

  updateDataPoint() {
    this.error = [];
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(this.datasourceService.updateDataPoint(this.dataPoint).subscribe(data => {
      this.dataPoint = data;
      this.datapointTableComponent.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
      this.datapointTableComponent.dataPoints.filter = '';
      this.datapointTableComponent.updatedData(this.dataPoint.xid);
      this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
      this.datapointButtonsView = true;
      this.getDataPoints(this.datasource);
    }, error => {
      this.error = error.result.message;
      this.timeOutFunction();
    }));
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  saveDataPoint() {
    this.error = [];
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(this.datasourceService.saveDatapoint(this.dataPoint).subscribe(data => {
      this.datapointButtonsView = true;
      this.dataPoint = data;
      this.datapointTableComponent.addDatapointToTable(this.dataPoint);
      this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
    }, error => {
      this.error = error.result.message;
      this.timeOutFunction();
    }));
  }

  addListValue(val: string) {
    const theNumber = parseInt(val);
    if (isNaN(theNumber)) {
      alert('Enter a number');
      return false;
    }
    for (let i = 0; i <= this.pointLocator.values.length; i++) {
      if (this.pointLocator.values[i] === theNumber) {
        alert('List already contain the value');
        return false;
      }
    }
    this.pointLocator.values[this.pointLocator.values.length] = theNumber;
    this.incrementVal = theNumber + 1;
    return true;
  }

  removeListValue(val: any) {
    this.pointLocator.values.forEach((item: any, index: any) => {
      if (item === val) {
        this.pointLocator.values.splice(index, 1);
      }
    });
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

}

