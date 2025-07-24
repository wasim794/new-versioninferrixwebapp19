import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AlertEditComponent, Alert, AlertService } from '../../alert';
import {commonHelp} from '../../help/commonHelp';
import {HelpModalComponent} from '../../help/help-modal/help-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {CommonService} from '../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../common';
import {Subscription} from 'rxjs';
import {DictionaryService} from "../../core/services/dictionary.service";

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: []
})
export class AlertListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(AlertEditComponent) alertEditComponent: AlertEditComponent;
  alertListLimit = 9;
  alertLists: Alert[];
  offSet = 0;
  totalPages: number;
  pageNumber: any;
  deleteAlertList: any;
  alertDetail: any;
  alertListHelpTitle = 'Alert List';
  private deleteMsg = "delete successful";
  info = new commonHelp();
  searchAlertList: any;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry: ViewContainerRef;
  componentRef: any;
  subscription: Subscription;
  UIDICTIONARY : any;


  constructor(private alertService: AlertService, public dictionaryService: DictionaryService, private dialog: MatDialog, private commonService: CommonService, private resolver: ComponentFactoryResolver) {
    super();
    // fetching alert data after save, to update the card
    this.subscription = this.alertService.getAfterAlertSave().subscribe(data => {
      this.updateSavedAlertLists(data['data']);
    });
    // fetching alert data after update, to update the card
    this.subscription = this.alertService.getAfterAlertUpdate().subscribe(data => {
      this.updateUpdatedAlertLists(data['data']);
    });
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.getAlertList(this.alertListLimit, this.offSet);

  }

  alertlist_side(alertListSideNav) {
    alertListSideNav.close();

  }

  /**
   * Get alert list as per limit and offSet value for pagination using RQL
   */
  getAlertList(alertListLimit, offSet) {
    this.subs.add(this.alertService.getAlertList(alertListLimit, offSet).subscribe(data => {
      this.totalPages = data['total'];
      this.alertLists = data['items'];

    }, err => console.log(err)));
  }

  addNewAlert(alertListSideNav) {
    alertListSideNav.open();
    this.createComponent(null);
  }

  showAlertDetails(alert, alertListSideNav) {
    alertListSideNav.open();
    this.createComponent(alert);
    this.alertDetail = alert;
  }

  /** Method for creating the component dynamically */
  createComponent(alertList) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(AlertEditComponent);
    this.componentRef = this.entry.createComponent(factory);
    if (!alertList) {
      this.componentRef.instance.resetAlertForm();
    } else {
      this.componentRef.instance.getAlertDetailByXid(alertList.xid, this.alertLists);
    }
  }

  deleteAlert(alert) {
    this.deleteAlertList = alert;
    this.subs.add(this.commonService.openConfirmDialog('Are you want to delete ', alert.name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.alertService.deleteAlert(alert.xid).subscribe(data => {
          this.alertLists = this.alertLists.filter(h => h !== this.deleteAlertList);
        }));
        this.commonService.notification(this.deleteMsg);
      }
    }));
  }

  updateSavedAlertLists(data) {
    this.alertDetail = data;
    this.alertLists.push(data);
  }

  updateUpdatedAlertLists(data) {
    this.alertLists = this.alertLists.filter(h => h !== this.alertDetail);
    this.alertLists.push(data);
    this.alertDetail = data;
  }

  setPaginationAlertList(currentPage: number) {
    this.pageNumber = currentPage;
    const offset = this.alertListLimit * currentPage - this.alertListLimit;
    this.getAlertList(this.alertListLimit, offset);
  }

  alertListHelp() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'alertListHelpTitle', content: this.info.htmlDataHelp},
      disableClose: true
    });
  }

  filterAlertList(event) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchAlertList) {
        this.alertService.filterAlertList(this.searchAlertList).subscribe(data => {
          this.alertLists = data['items'];
        });
      } else {
        this.getAlertList(this.alertListLimit, this.offSet);
      }
    }
  }
}
