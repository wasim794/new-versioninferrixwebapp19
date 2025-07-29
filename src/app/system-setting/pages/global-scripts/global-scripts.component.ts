import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {UnsubscribeOnDestroyAdapter} from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {commonHelp} from "../../../help/commonHelp";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {HelpModalComponent} from "../../../help/help-modal/help-modal.component";
import {GlobalScriptModel, GlobalScriptService} from "../../shared"
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from "rxjs";
import {Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DataPointModel} from "../../../core/models/dataPoint";
import {SelectionModel} from "@angular/cdk/collections";
import { DictionaryService } from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';



@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [CommonService, GlobalScriptService, DictionaryService],
  selector: 'app-global-scripts',
  templateUrl: './global-scripts.component.html',
  styleUrls: []
})
export class GlobalScriptsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  info = new commonHelp();
  public messageError!: boolean;
  @Output() systemsettingsidebar = new EventEmitter<any>();
  globalScriptModel: any = new GlobalScriptModel(<any>[]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource: any;
  selectedFilesColumns: string[] = ['S.No.', 'File Name', 'Action'];
  globalScriptError: any = [];
  public permissions = [];
  public editPermission: any = [];
  public readPermission = [];
  public setPermission = [];
  globalButtonsView!: boolean;
  currentDatapointIndex!: number;
  selection = new SelectionModel<string>(true, []);
  public ListError: any;
  filteredOptions!: Observable<any[]>;
  dataSources: any = new MatTableDataSource<GlobalScriptModel>();
  tabIndex = 0;
  dsId!: number;
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [8, 15, 20];
  isEdit: boolean=false;
  eventDetectors = [];
  displayForm!: boolean;
  dataPoint: any = new DataPointModel();
  GlobalScript = "Save Successfully"
  updateSuccess = "update Successfully"
  sortingType = 'default';
  deleteMsg = "Delete Successfully"
  validate = "Validate Successfully"
  UIDICTIONARY : any;

  constructor( public _GlobalScriptService: GlobalScriptService,
               private commonService: CommonService,
               public snackBar: MatSnackBar,
               private dialog: MatDialog,
               public dictionaryService: DictionaryService,)
  {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
   this.getPermission();
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getGlobalScript(param);
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }
  getNextPage(event: { pageSize: number; pageIndex: number; }) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getGlobalScript(param);
  }


  saveGlobalScript(){
    this.subs.add(this._GlobalScriptService.create(this.globalScriptModel).subscribe(data => {
      this.commonService.notification(this.GlobalScript);
        this.getPermission()
        this.systemsettingsidebar.emit();
    },
      (error) => {
        this.ListError = error.result.message;
        this.timeOutFunction();
      }));

  }
  editGlobalScript(event: { xid: String; }) {
    this.isEdit = false;
    this.editPermission = 'superadmin'.split(',');
    this.subs.add(this._GlobalScriptService.getByXid(event.xid).subscribe((data) => {
      this.globalScriptModel = data;
      this.globalButtonsView = true;

      })
    );
  }
  updateGlobalScript() {
    this.subs.add(this._GlobalScriptService.update(this.globalScriptModel).subscribe(data => {
        this.isEdit = true;
        this.getPermission()
        this.commonService.notification(this.updateSuccess);
        this.systemsettingsidebar.emit();
      },
      (error) => {
        this.globalScriptError = error.result.message;
        this.timeOutFunction();
      }));
  }
  validateGlobalScript() {
    this.subs.add(this._GlobalScriptService.validateScript(this.globalScriptModel).subscribe(data => {
        this.commonService.notification(this.validate);
      },
      (error) => {
        this.globalScriptError = error.result.message;
        this.timeOutFunction();
      }));
  }

  loadGlobalScriptHelpModel() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'Global Script Help Title', content: this.info.globalScriptHelpContent},
      disableClose: true
    });
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  deleteGlobalScript(element: { name: string; xid: string; }){
    this.commonService.openConfirmDialog('Would you like to delete', element.name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this._GlobalScriptService.delete(element.xid).subscribe(data => {
          this.commonService.notification(this.deleteMsg);
          const param = 'limit(' + this.limit + ',' + this.offset + ')';
          this.getGlobalScript(param);
        }));
        return true;
      } else {
        return false;
      }
    });
      }

  getGlobalScript(param: string) {
    this._GlobalScriptService.get(param).subscribe(data => {
      this.dataSource = data;

    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortingData(sort: Sort) {
    const data = this.dataSources.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSources = data;
      return;
    }
    this.dataSources = data.sort((a: { name: string | number; enable: string | number; }, b: { name: string | number; enable: string | number; }) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'enable':
          return this.compare(a.enable, b.enable, isAsc);
        default:
          return 0;

      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSources.length;
    return numSelected === numRows;
  }


  isChecked(node: any): boolean {
    return this.selection.isSelected(node.xid);
  }

  addDataPointXid(event: { checked: any; }, dataPoint: { xid: string; }) {
    if (event.checked) {
      this.selection.select(dataPoint.xid);
    } else {
      this.selection.deselect(dataPoint.xid);
    }
  }


  private setDataPointPermissions() {
    if (this.readPermission) {
      this.globalScriptModel.readPermission = this.readPermission.toString();
    }
    if (this.setPermission) {
      this.globalScriptModel.setPermission = this.readPermission.toString();
    }
  }
  getPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.readPermission = data;
    }, err => console.log(err)));
  }


}
