import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { InspApiary } from './../../../_model/inspApiary';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspApiaryService {

  constructor(private http: HttpClient) {}

  /**
  *
  * @param apiaryId
  *
  */
  getInspApiaryByApiaryId(apiaryId: string): Observable<InspApiary[]> {
      return this.http.get<InspApiary[]>(CONFIG.URL + 'inspApiary/apiaryId/' + apiaryId, httpOptions);
  }

  /**
   *
   * @param apiaryId
   * @param date
   */
   getInspApiaryByApiaryIdAndDate(apiaryId: string, date: Date): Observable<InspApiary[]> {
      return this.http.post<InspApiary[]>(CONFIG.URL + 'inspApiary/apiaryId/date' + apiaryId, date, httpOptions);
  }

  /**
   *
   * @param apiaryId
   * @param range
   */
   getInspApiaryByApiaryIdAndDateBetween(apiaryId: string, range: Date[]): Observable<InspApiary[]> {
      return this.http.post<InspApiary[]>(CONFIG.URL + 'inspApiary/apiaryId/between' + apiaryId, range, httpOptions);
  }

  /**
   *
   * @param inspApiary
   *
   */
   createNewInspApiary(inspApiary: InspApiary): Observable<InspApiary> {
      return this.http.post<InspApiary>(CONFIG.URL + 'inspApiary', inspApiary, httpOptions);
   }

}
