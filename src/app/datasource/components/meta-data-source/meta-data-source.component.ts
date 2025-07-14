import { Component,OnInit,ElementRef,ViewChildren,QueryList,} from "@angular/core";
import { DataSourceBase } from "../common/dataSourceBase";
import { CommonService } from "../../../services/common.service";
import { StackJavascriptModel } from "../../../core/models/scripts";
import { DataPointModel } from "../../../core/models/dataPoint";
import { TimePeriodModel } from "../../../core/models/timePeriod";
import { MetaDatasourceModel,MetaPointLocatorModel,MetaDatasourceService,} from "../meta-data-source";
import { DataPointService,ScriptsService, ScriptUtilsService, DictionaryService} from "../../../core/services";
import { updateEvents, ContextUpdateEvent, DATA_TYPES } from "../../../common";
import { LogLevel } from "../../../core/models/scripts";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { MetaDataPointComponent } from "./meta-data-point/meta-data-point.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { MatOptionSelectionChange } from "@angular/material/core";
import { HelpModalComponent } from "../../../help/help-modal/help-modal.component";
import { commonHelp } from "../../../help/commonHelp";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../../common/mat-module";
import { DatapointTableComponent } from "../common";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, ReactiveFormsModule],
  providers: [DataPointService,ScriptsService, ScriptUtilsService, DictionaryService],
  selector: "app-meta-data-source",
  templateUrl: "./meta-data-source.component.html",
  styleUrls: [],
})
export class MetaDataSourceComponent extends DataSourceBase implements OnInit {
  @ViewChildren("inputElement") inputElements!: QueryList<ElementRef>;
  override datapointForm                     : boolean = false;
  public anchorNode!                 : boolean;
  public visibility!                 : boolean;
  public editPermission: any             = [];
  public scriptError                : any = [];
  public scriptPermission: any           = [];
  public ErrorMsg                   : any;
  public allScriptEngine            : any = [];
  public isEdit!                     : boolean;
  public displayForm!                : boolean;
  public messageError!               : boolean;
  public permissions                = [];
  public binary                     = false;
  public updateEvent                = updateEvents;
  public contextUpdateEvents        = ContextUpdateEvent;
  public stackJavascriptModel       : any = {} as StackJavascriptModel;
  public dataTypes                  = DATA_TYPES;
  public LogLevels                  = LogLevel;
  public numeric                    = false;
  public setPermission : any              = [];
  public readPermission: any             = [];
  public metaDatasourceModel        : any = MetaDatasourceModel;
  public dataPointModel             : DataPointModel = new DataPointModel();
  public metaPointLocatorModel      : MetaPointLocatorModel = new MetaPointLocatorModel();
  public datasourceIsEdit!           : boolean;
  public dataPointHide!              : boolean;
  public updateCornHide             : boolean = false;
  buttonViews!                       : boolean;
  info                              = new commonHelp();
  public dsId!                       : any;
  public datapointButtonsView!       : boolean;
  public dataTableHide              : boolean = false;
  saveSuccess                       = "saved successfully";
  updateSuccess                     = "updated successfully";
  items                             : any[] = [];
  totoalDatapoints!                  : number;
  limit                             = 100;
  offset                            = 0;
  pageSizeOptions                   : number[] = [100, 150, 200];
  selectedItems                     : any[] = [];
  selectedItemsControl:any              = new FormControl([]);
  searchControl                     = new FormControl("");
  latestSelectedValue               : any;
  UIDICTIONARY                      : any;
  filteredItemss                    : any;
  datasourceTitleName               : any;
  isActivePd                        : boolean = false;
  isActiveColor                     : boolean = false;
  filteredItemListing               : any[] = [];
  isActivePdSmall!                   : boolean;
  public existingDataPoint          : any[] = [];
  public dataSourceError!            : any[];

  constructor(
    public dictionaryService   : DictionaryService,
    private commonService      : CommonService,
    private metaDatasource     : MetaDatasourceService,
    private dataPointService   : DataPointService,
    private fb                 : FormBuilder,
    private scriptsService     : ScriptsService,
    private scriptUtilsService : ScriptUtilsService,
    public dialog              : MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary("core").subscribe((data) => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermission();
    this.getConditions();
    this.getScriptEngine();
  }
  isSelected(itemId: any): boolean {
    return this.selectedItems.includes(itemId);
  }

  onKeyup(event: KeyboardEvent) {
    const searchText = (event.target as HTMLInputElement).value;
    if (searchText) {
      const param = "limit(" + this.limit + "," + this.offset + ")";
      let params = param + "&like(name,%2A" + searchText + "%2A)";
      this.subs.add(
        this.dataPointService.get(params).subscribe((data) => {
          this.totoalDatapoints = this.dataPointService.total;
          this.items = data;
          this.filteredItemss = this.items;
        })
      );
    } else {
      this.getDataPointsAll(this.limit, this.offset);
    }
    this.filteredItemss = this.items.filter((item) =>
      item.extendedName.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Handle selection change from mat-option
  onOptionSelectionChange(event: MatOptionSelectionChange, item: any) {
    if (event.isUserInput) {
      this.latestSelectedValue = item.xid;
    }
  }

  onSelectionChange(event: MatSelectChange) {
    let lastValue = this.latestSelectedValue;
    const filteredDataArray:any = [];
    if (!this.selectedItemsControl.value[0]) {
      return false;
    } else {
      const dialogRef = this.dialog.open(MetaDataPointComponent, {
        data: {
          action: "add",
          datapointValue: lastValue,
          allDataPoints: filteredDataArray,
          datapointAdded: this.metaPointLocatorModel.context,
        },
        width: "1000px",
        disableClose: true,
      });
      
      dialogRef.afterClosed().subscribe((result) => {
        if (result == "close") {
          if (this.metaPointLocatorModel.context === undefined) {
             console.warn("metaPointLocatorModel.context is undefined.");
          }
          let ds:any = [];
          this.metaPointLocatorModel.context.forEach((data) => {
            ds = [...ds, data.xid];
          });
          // Now d contains all the appended strings
          this.selectedItems = ds;
          console.warn("metaPointLocatorModel.context is undefined.");
        }
        if (this.metaPointLocatorModel.context === undefined) {
          this.metaPointLocatorModel.context = result;
        } else {
          result.forEach((data:any) => {
            this.metaPointLocatorModel.context.push(data);
          });
        }
        let d: any = [];
        if (result) {
          // Assuming your data is in an array of objects
          let dataArray = this.metaPointLocatorModel.context;
          let keysToExtract: any = [];
          let extractedIds = [];
          dataArray.forEach((item) => {
            this.getDataByXID(item.xid);
            this.selectedItems = dataArray;

            this.isSelected(this.selectedItems);
            // Check if the item's xid exists in keysToExtract array
            if (keysToExtract.includes(item.xid)) {
              // Push the xid into extractedIds array
              extractedIds.push(item.xid);
            }
          });

          this.metaPointLocatorModel.context.forEach((data) => {
            d = [...d, data.xid];
          });
          this.selectedItems = d;
          this.selectedItemsControl.value.pop();
          this.buttonViews = true;
        } else {
          this.metaPointLocatorModel.context = this.selectedItems;
          this.buttonViews = true;
        }
      });
      return true;
    }
  }

  viewSelectedItems() {
    const filteredDataArray: any = [];
    this.metaPointLocatorModel.context.forEach((data) => {
      const matched = this.filteredItemListing.filter((h) => h.xid == data.xid);
      filteredDataArray.push(...matched);
    });


    const dialogRef = this.dialog.open(MetaDataPointComponent, {
      data: {
        action: "view",
        allDataPoints: filteredDataArray,
        datapointAdded: this.metaPointLocatorModel.context,
      },
      width: "900px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.metaPointLocatorModel.context = result;
      this.buttonViews = true;
    });
  }

  onSelectionChangeT(event: any) {
    event.value === "CRON"
      ? (this.updateCornHide = true)
      : (this.updateCornHide = false);
  }
  override selectTab(index: number): void {
    this.tabIndex = index;
  }


  getScriptEngine() {
    this.subs.add(
      this.scriptsService.getEngines().subscribe((data) => {
        this.allScriptEngine = data;
        this.allScriptEngine.forEach((items: any) => {
          this.allScriptEngine = items.names;
          items.names.forEach((subItem: any) => {
            if (subItem === "javascript") {
              this.allScriptEngine = [subItem];
            }
          });
        });
      })
    );
  }

  private getDataPointsAll(limit: any, offset: any) {
    const param = "limit(" + limit + "," + offset + ")";
    this.subs.add(
      this.dataPointService.get(param).subscribe((data) => {
        this.totoalDatapoints = this.dataPointService.total;
        this.items = data;
        this.filteredItemss = this.items;
        this.filteredItemListing = this.items;
      })
    );
  }

  private getDataByXID(XID: any) {
    this.dataPointService.getByXid(XID).subscribe((data) => {
      this.filteredItemListing.push(data);
    });
  }

  dataPointLists(event:KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (!inputValue || inputValue.trim() === "") {
      this.getDataPointsAll(this.limit, this.offset);
    }
    if (inputValue) {
      this.getDefaultDataList(inputValue);
    } else {
      this.filteredItemListing = this.existingDataPoint;
    }
  }

  private getDefaultDataList(inputValue?:any){
    const param = "limit(" + this.limit + "," + this.offset + ")";
    let params = param + "&like(name,%2A" + inputValue + "%2A)";
    this.subs.add(
      this.dataPointService.get(params).subscribe((data) => {
        this.filteredItemListing = data;
      })
    );
  }

  getNext(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
  }
  getConditions() {
    if (this.selectedItems.length === 0) {
      this.dataTableHide = false;
    } else {
      this.dataTableHide = true;
    }
  }

  saveDatasource() {
    this.ErrorMsg = [];
    if (this.editPermission) {
      this.metaDatasourceModel.editPermission = this.editPermission.toString();
    }
    delete this.metaDatasourceModel.purgePeriod;
    this.subs.add(
      this.metaDatasource.create(this.metaDatasourceModel).subscribe(
        (data) => {
          this.isEdit = true;
          this.commonService.notification(
            "Datasource " +
            this.metaDatasourceModel.name +
            " " +
            this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        },
        (error) => {
          this.dataSourceError = error.result.message;
          this.timeOutFunction();
        }
      )
    );
  }

  override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.dataPointHide = true;
    this.isEdit = true;
    this.datasourceIsEdit = true;
    this.subs.add(
      this.metaDatasource.getByXid(datasource.xid).subscribe(
        (data) => {
          this.metaDatasourceModel = new MetaDatasourceModel(data);
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(",");
        },
        (err) => console.log(err)
      )
    );
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePd = !this.isActivePd;
    this.isActivePdSmall = true;
  }

  updateDatasource() {
    this.setDataPointPermissions();
    this.subs.add(
      this.metaDatasource.update(this.metaDatasourceModel).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            "Datasource " +
            this.metaDatasourceModel.name +
            " " +
            this.updateSuccess
          );
        },
        (error) => {
          this.ErrorMsg = error.result.message;
          this.timeOutFunction();
        }
      )
    );
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  editDataPoint(dataPoint: any) {
    this.setDataPointPermissions();
    this.filteredItemListing = [];
    const dataPointXid = dataPoint["dpXid"];
    this.currentDatapointIndex = dataPoint["index"];
    this.subs.add(
      this.dataPointService.getByXid(dataPointXid).subscribe((data) => {
        this.displayForm = true;
        this.dataPointModel = new DataPointModel(data);
        this.metaPointLocatorModel = new MetaPointLocatorModel(
          this.dataPointModel.pointLocator
        );
        const xidValues = this.metaPointLocatorModel.context.map((item) => {
          item.xid;
          this.getDataByXID(item.xid);
        });
        const xidValuess = this.metaPointLocatorModel.context.map(
          (item) => item.xid
        );
        this.selectedItems = xidValuess;

        this.isSelected(this.selectedItems);
        this.buttonViews = true;
        this.datapointButtonsView = true;
        this.datasourceIsEdit = true;
        this.isEdit = false;
        this.dataPointHide = true;
        this.datapointForm = true;
        this.readPermission = data.readPermission.split(",");
        this.setPermission = data.setPermission.split(",");
        this.scriptPermission =
          this.metaPointLocatorModel.scriptPermissions.split(",");
        this.dataTypeChange(data.pointLocator.dataType);
      })
    );
  }

  override addNewDatasource(dsType: any) {
    this.metaDatasourceModel = new this.metaDatasourceModel();
    this.metaDatasourceModel.timePeriod = new TimePeriodModel();
  }

  Validates(script: any) {
    this.stackJavascriptModel.permissions = this.setPermission[0];
    this.stackJavascriptModel.script = script;
    this.stackJavascriptModel.wrapInFunction = true;
    this.stackJavascriptModel.context = this.metaPointLocatorModel.context;
    this.stackJavascriptModel.logLevel = this.metaPointLocatorModel.logLevel;
    this.stackJavascriptModel.resultDataType =
      this.metaPointLocatorModel.dataType;
    this.subs.add(
      this.scriptUtilsService.validate(this.stackJavascriptModel).subscribe(
        (data) => {
          if (data.result) {
            this.isActiveColor = !this.isActiveColor;
            this.scriptError = data.result;
            this.messageError = true;
            this.timeOutFunction();
          } else {
            this.isActiveColor = this.isActiveColor;
            this.scriptError = data.errors;
            this.messageError = true;
            this.timeOutFunction();
          }
        },
        (error) => {
          console.log(error.errors[0]);
        }
      )
    );
  }

  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.metaPointLocatorModel;
    this.subs.add(
      this.dataPointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.dataPoints.data[
            this.currentDatapointIndex
            ] = this.dataPoint;
          this.datapointTableComponent.dataPoints.filter = "";
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.commonService.notification(
            "Datapoint " + this.dataPoint.name + " " + this.updateSuccess
          );
          this.dataPointHide = true;
          this.datapointForm = false;
        },
        (error) => {
          this.ErrorMsg = error.result.message;
          this.timeOutFunction();
        }
      )
    );
  }

  dataTypeChange(dataType: string) {
    if (dataType === "BINARY") {
      this.binary = true;
      this.numeric = false;
    } else if (dataType === "NUMERIC") {
      this.binary = false;
      this.numeric = true;
    } else {
      this.binary = false;
      this.numeric = false;
    }
  }

  saveDataPoint() {
    this.metaPointLocatorModel.modelType = "META.PL";
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.metaPointLocatorModel;
    this.subs.add(
      this.dataPointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification(
            "Datapoint " + this.dataPoint.name + " " + this.saveSuccess
          );
          this.dataPointHide = false;
          this.datapointForm = false;
        },
        (error) => {
          this.ErrorMsg = error.result.message;
          this.timeOutFunction();
        }
      )
    );
  }

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPointModel.readPermission = this.readPermission.toString();
    }
    if (this.setPermission) {
      this.dataPointModel.setPermission = this.setPermission.toString();
    }
    if (this.scriptPermission) {
      this.metaPointLocatorModel.scriptPermissions =
        this.scriptPermission.toString();
    }
  }

  override addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert("Add datasource first");
      return false;
    }
    this.displayForm = true;
    this.dataPointHide = true;
    this.datapointForm = true;
    this.isEdit = true;
    this.selectTab(index);
    this.dataPointModel = new DataPointModel();
    this.datapointButtonsView = false;
    this.dataPointModel.dataSourceXid = xid;
    this.metaPointLocatorModel = new MetaPointLocatorModel();
    this.readPermission = [];
    this.setPermission = [];
    this.selectedItems = [];
    this.buttonViews = false;
    this.getPermission();
    this.getDataPointsAll(this.limit, this.offset);
    return true;
  }

  getPermission() {
    this.subs.add(
      this.commonService.getPermission().subscribe(
        (data) => {
          this.readPermission = data;
        },
        (err) => console.log(err)
      )
    );
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

  metaScriptHelp() {
    this.dialog.open(HelpModalComponent, {
      data: {
        title: "Meta-datasource",
        content: this.info.htmlMetaDataSourceHelp,
      },
      disableClose: true,
    });
  }
}
