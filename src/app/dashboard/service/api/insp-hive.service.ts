import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { InspHive } from './../../../_model/inspHive';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspHiveService {

  constructor(private http: HttpClient) {}

  /**
  *
  * @param inspId
  *
  */
   getInspHiveByInspId(inspId: string): Observable<InspHive[]> {
    return this.http.get<InspHive[]>(CONFIG.URL + 'inspHive/apiaryId/' + inspId, httpOptions);
  }


  /**
  *
  * @param apiaryId
  *
  */
    getInspHiveByApiaryId(apiaryId: string): Observable<InspHive[]> {
      return this.http.get<InspHive[]>(CONFIG.URL + 'inspHive/apiaryId/' + apiaryId, httpOptions);
    }

  /**
   *
   * @param apiaryId
   * @param date
   */
   getInspHiveByApiaryIdAndDate(apiaryId: string, date: Date): Observable<InspHive[]> {
      return this.http.post<InspHive[]>(CONFIG.URL + 'inspHive/apiaryId/date/' + apiaryId, date, httpOptions);
  }

  /**
   *
   * @param apiaryId
   * @param range
   */
   getInspHiveByApiaryIdAndDateBetween(apiaryId: string, range: Date[]): Observable<InspHive[]> {
      return this.http.post<InspHive[]>(CONFIG.URL + 'inspHive/apiaryId/between/' + apiaryId, range, httpOptions);
  }

  /**
    *
    * @param hiveId
    *
    */
  getInspHiveByHiveId(hiveId: string): Observable<InspHive[]> {
    return this.http.get<InspHive[]>(CONFIG.URL + 'inspHive/hiveId/' + hiveId, httpOptions);
  }

  /**
  *
  * @param hiveId
  * @param date
  */
  getInspHiveByHiveIdAndDate(hiveId: string, date: Date): Observable<InspHive[]> {
    return this.http.post<InspHive[]>(CONFIG.URL + 'inspHive/hiveId/date/' + hiveId, date, httpOptions);
  }

  /**
  *
  * @param hiveId
  * @param range
  */
  getInspHiveByHiveIdAndDateBetween(hiveId: string, range: Date[]): Observable<InspHive[]> {
    return this.http.post<InspHive[]>(CONFIG.URL + 'inspHive/hiveId/between/' + hiveId, range, httpOptions);
  }

  /**
   *
   * @param inspHive
   *
   */
   createNewInspHive(inspHive: InspHive): Observable<InspHive> {
      return this.http.post<InspHive>(CONFIG.URL + 'inspHive', inspHive, httpOptions);
   }

   /**
   *
   * @param inspHive
   *
   */
    createNewInspHiveEvent(inspHive: InspHive): Observable<InspHive> {
      return this.http.post<InspHive>(CONFIG.URL + 'inspHive/event', inspHive, httpOptions);
   }

    /**
   *
   * @param inspHive
   *
   */
    deleteInspHiveEvent(arrayId: String[]): Observable<String[]>{
      return this.http.post<String[]>(CONFIG.URL + 'inspHive/event/delete', arrayId, httpOptions);
   }
}
