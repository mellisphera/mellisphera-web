import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { Inspection } from '../../../_model/inspection';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(private http: HttpClient) { }

  /**
  *
  * @param _id
  *
  */
  getInspectionById(_id: string): Observable<Inspection> {
    return this.http.get<Inspection>(CONFIG.URL + 'inspection/_id/' + _id, httpOptions);
  }


  /**
  *
  * @param apiaryInspId
  *
  */
  getInspectionByApiaryInspId(apiaryInspId: string): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/apiaryinspid/' + apiaryInspId, httpOptions);
  }


  /**
  *
  * @param apiaryInspId
  * @param createRange
  *
  */
  getInspectionByApiaryInspIdAndCreateDateBetween(apiaryInspId: string, createRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryinspid/' + apiaryInspId, createRange, httpOptions);
  }


  /**
  *
  * @param apiaryInspId
  * @param opsRange
  *
  */
  getInspectionByApiaryInspIdAndOpsDateBetween(apiaryInspId: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryinspid/' + apiaryInspId, opsRange, httpOptions);
  }


  /**
  *
  * @param apiaryId
  *
  */
  getInspectionByApiaryId(apiaryId: string): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/apiaryid/' + apiaryId, httpOptions);
  }


  /**
  *
  * @param apiaryId
  * @param createDate
  *
  */
  getInspectionByApiaryIdAndCreateDate(apiaryId: string, createDate: Date): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/apiaryid/' + apiaryId, createDate, httpOptions);
  }


  /**
  *
  * @param apiaryId
  * @param createRange
  *
  */
  getInspectionByApiaryIdAndCreateDateBetween(apiaryId: string, createRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryid/' + apiaryId, createRange, httpOptions);
  }


  /**
  *
  * @param apiaryId
  * @param opsRange
  *
  */
  getInspectionByApiaryIdAndOpsDateBetween(apiaryId: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryid/' + apiaryId, opsRange, httpOptions);
  }


  /**
  *
  * @param createDate
  *
  */
  getInspectionByCreateDate(createDate: Date): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/createdate/' + createDate, httpOptions);
  }


  /**
  *
  * @param createRange
  *
  */
  getInspectionByCreateDateBetween(createRange: Date): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/createdate/', createRange, httpOptions);
  }


  /**
  *
  * @param opsDate
  *
  */
  getInspectionByOpsDate(opsDate: Date): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/opsdate/'+ opsDate, httpOptions);
  }


  /**
  *
  * @param opsRange
  *
  */
  getInspectionByOpsDateBetween(opsRange: Date): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/opsdate/', opsRange, httpOptions);
  }


  /**
  *
  * @param hiveId
  *
  */
  getInspectionByHiveId(hiveId: string): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/hiveid/' + hiveId, httpOptions);
  }


  /**
  *
  * @param hiveId
  * @param createRange
  *
  */
  getInspectionByHiveIdAndCreateDateBetween(hiveId: string, createRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/hiveid/' + hiveId, createRange, httpOptions);
  }


  /**
  *
  * @param hiveId
  * @param opsRange
  *
  */
  getInspectionByHiveIdAndOpsDateBetween(hiveId: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/hiveid/' + hiveId, opsRange, httpOptions);
  }


  /**
  *
  * @param type
  *
  */
  getInspectionByType(type: string): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/type/' + type, httpOptions);
  }


  /**
  *
  * @param type
  * @param createRange
  *
  */
  getInspectionByTypeAndCreateDateBetween(type: string, createRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/type/' + type, createRange, httpOptions);
  }


  /**
  *
  * @param type
  * @param opsRange
  *
  */
  getInspectionByTypeAndOpsDateBetween(type: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/type/' + type, opsRange, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  insertApiary(insp: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/insert/apiary/' , insp, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  insertHiveInsp(insp: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/insp/hive/' , insp, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  insertHiveEvent(insp: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/event/hive/' , insp, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  deleteHiveInsp(ids: String[]): Observable<String[]> {
    return this.http.post<String[]>(CONFIG.URL + 'inspection/delete/hive/' , ids, httpOptions);
  }


}
