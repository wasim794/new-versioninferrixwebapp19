import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
// import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';
// import {DataPoint} from '../datapoint/model/dataPoint';
import { CommonModule, Location  } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../common/confirm-dialog/confirm-dialog.component';
import {MenuModel} from '../frame/model/menuModel';
import {EnvService} from '../core/services';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  [x: string]: any;
  private menu_url = '/v2/menu';
  private url_permission = '/v2/users/groups';
  private durationInSeconds = 5;
  dataSourceAdded = new Subject<any>();
  dataPointsAdded = new Subject<any>();
  private userLoggedIn = new Subject<boolean>();
  toTime = new Date();
  fromTime = new Date();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private location: Location,
    private env: EnvService) {
    this.userLoggedIn.next(false);
  }

  // private sidenav: MatSidenav = new MatSidenav;

  close() {
    // this.sidenav.close().then(r => console.log(r));
  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }


  /* Data point list
 * @return an `Observable` of the body as an `Object` of DataPoint
 */

  /* get all group list
   * @return an `Observable` of the body as an `Object` of any type
   */
  getPermission(): Observable<any> {
    return this.http.get<string>(this.env.apiUrl + this.url_permission)
      .pipe(catchError(CommonService.handleError));
  }

  /* get all group list
   * @return an `Observable` of the body as an `Object` of any type
   */


  private static handleError<T>(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError('Some internal issue with making API Call ' + errorMessage);
  }

  messageDisplay(_id: string) {

  }

  openConfirmDialog(msg: string, name: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: {top: '10px'},
      data: {
        message: msg,
        name: name
      }
    });
  }

  notification(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      duration: this.durationInSeconds * 1000,
      verticalPosition: "top"
    });

  }


  goBackHistory(): void {
  this.location.back();
}




  hideloader() {
    var x, i;
    x = document.querySelectorAll(".loadermain");
   for (i = 0; i < x.length; i++) {
 ((x[i]) as HTMLElement).style.display = "none";
    }
  }


  // hideInputTrue() {
  //   var x, i;
  //   x = document.querySelectorAll(".inputHide");
  //   for (i = 0; i < x.length; i++) {
  //     x[i].style.display = "none";
  //   }


  // }

  // hideInputFalse() {
  //   document.getElementById('inputHide')
  //     .style.display = 'block';

  // }


  animationHide() {
    var divs = document.querySelectorAll('.table_data');
    for (var i = 0; i < divs.length; i++) {
      divs[i].classList.remove('newDataAnimations');
    }
  }


// Set dataSource to HttpModule data
  setDataSourceAdded(data: any) {
    this.dataSourceAdded.next({data: data});
  }

  setDataPointsAdded(selectedDataPoints: any[]) {
    this.dataPointsAdded.next({data: selectedDataPoints});
  }


  /**
   *
   * @param pointIdXid
   * @param dataPoinsts
   * @returns {datapoint details acc to xid}
   */
  getSelectedDataPoint(pointIdXid: string, dataPoinsts: any) {
    const points: [any] = dataPoinsts;
    for (let i = 0; i < points.length; i++) {
      if (points[i].xid === pointIdXid) {
        return points[i];
      }
    }
  }

  getMenu(): Observable<MenuModel[]> {
    return this.http.get<MenuModel[]>(this.env.apiUrl + this.menu_url);
  }

  get(param: string) {

  }
}
