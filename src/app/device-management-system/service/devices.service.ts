import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvService } from '../../core/services/env.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private postUrl = '';
  private getUrl = '';
  // Use :id as a placeholder for dynamic ID in update URL
  private updateUrl = '';

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  /** POST: Add new data */
  addData(data: any): Observable<any> {
    return this.http.post<any>(this.postUrl, data)
      .pipe(catchError(this.handleError));
  }

  /** PUT: Update data by ID */
  updateData(data: any): Observable<any> {
    // Append the ID to the updateUrl as per REST convention
    const url = `${this.updateUrl}/${data._id}`;
    return this.http.put<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  /** GET: Retrieve all data */
  getData(): Observable<any> {
    return this.http.get<any>(this.getUrl)
      .pipe(catchError(this.handleError));
  }

  /** Error handler */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error('API request failed. ' + errorMessage));
  }
}
