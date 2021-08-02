import { RucherService } from './rucher.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { Inspection } from '../../../_model/inspection';
import { EVENTS, INSPECTIONS } from '../../melli-charts/charts/icons/icon_inspect';
import * as moment from 'moment';
import { RucheService } from './ruche.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  inspectionsHive: Inspection[];
  inspectionsApiary: Inspection[];
  inspectionsApiaryUser: Inspection[];
  inspectionsHiveUser: Inspection[];

  public inspApi: Inspection[];
  public inspHive: Inspection[];

  public obsHiveSubject: BehaviorSubject<Inspection[]>;
  constructor(private http: HttpClient, private rucherService: RucherService, private rucheService: RucheService) {
    this.inspectionsApiary = [];
    this.inspectionsHive = [];
    this.inspectionsApiaryUser = [];
    this.inspectionsHiveUser = [];
    this.obsHiveSubject = new BehaviorSubject([]);
  }

  /**
   *
   *
   * @memberof ObservationService
   */
  emitHiveSubject() {
    this.obsHiveSubject.next(this.inspectionsHive.slice());
  }

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
  * @param userId
  *
  */
  getInspectionByUserId(userId: string): void {
    this.http.get<Inspection[]>(CONFIG.URL + 'inspection/user/' + userId, httpOptions).subscribe(
      _insp => {
        this.inspectionsHive = _insp.filter(_insp => _insp.type === 'hive').sort((inspA, inspB) => {
          return new Date(inspA.opsDate).getTime() - new Date(inspB.opsDate).getTime();
        });
        this.inspectionsApiary = _insp.filter(_insp => _insp.type === 'apiary').sort((inspA, inspB) => {
          return new Date(inspA.opsDate).getTime() - new Date(inspB.opsDate).getTime();
        });
      },
      () => {},
      () => {
        this.inspApi = this.getInspectionCurrentApiary(this.rucherService.getCurrentApiary());
        this.inspHive = this.getInspectionCurrentHive(this.rucheService.getCurrentHive()._id);
      }
    );
  }

  getInspectionByUser(userId: string): Observable<Inspection[]>{
    return this.http.get<Inspection[]>(CONFIG.URL + 'inspection/user/' + userId, httpOptions);
  }

  getInspectionCurrentApiary(apiaryId: string): Inspection[]{
    let start = new Date();
    start.setDate(start.getDate() - 180);
    return this.inspectionsApiary.filter(_insp => (_insp.apiaryId === apiaryId && new Date(_insp.opsDate) > start)).sort((inspA, inspB) => {
      return -(moment(inspA.opsDate).unix() - moment(inspB.opsDate).unix());
    });
  }

  getInspectionCurrentHive(hiveId: string): Inspection[]{
    let start = new Date();
    start.setDate(start.getDate() - 180);
    return this.inspectionsHive.filter(_insp => (_insp.hiveId === hiveId && new Date(_insp.opsDate) > start )).sort((inspA, inspB) => {
      return -(moment(inspA.opsDate).unix() - moment(inspB.opsDate).unix());
    });
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
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryinspid/createbetween/' + apiaryInspId, createRange, httpOptions);
  }


  /**
  *
  * @param apiaryInspId
  * @param opsRange
  *
  */
  getInspectionByApiaryInspIdAndOpsDateBetween(apiaryInspId: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryinspid/opsbetween/' + apiaryInspId, opsRange, httpOptions);
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
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/apiaryid/create/' + apiaryId, createDate, httpOptions);
  }


  /**
  *
  * @param apiaryId
  * @param createRange
  *
  */
  getInspectionByApiaryIdAndCreateDateBetween(apiaryId: string, createRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryid/createbetween/' + apiaryId, createRange, httpOptions);
  }


  /**
  *
  * @param apiaryId
  * @param opsRange
  *
  */
  getInspectionByApiaryIdAndOpsDateBetween(apiaryId: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/apiaryid/opsbetween/' + apiaryId, opsRange, httpOptions);
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
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/createdate/between/', createRange, httpOptions);
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
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/opsdate/between/', opsRange, httpOptions);
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
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/hiveid/createbetween/' + hiveId, createRange, httpOptions);
  }


  /**
  *
  * @param hiveId
  * @param opsRange
  *
  */
  getInspectionByHiveIdAndOpsDateBetween(hiveId: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/hiveid/opsbetween/' + hiveId, opsRange, httpOptions);
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
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/type/createbetween/' + type, createRange, httpOptions);
  }


  /**
  *
  * @param type
  * @param opsRange
  *
  */
  getInspectionByTypeAndOpsDateBetween(type: string, opsRange: Date[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/type/opsbetween/' + type, opsRange, httpOptions);
  }


  /**
  *
  * @param type
  * @param opsRange
  *
  */
  getInspectionByFilters(apiaryId: string, hiveIds: string[], opsRange: Date[], types: string[], empty: boolean): Observable<Inspection[]>{
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/filter/' + apiaryId, {'hiveIds': hiveIds, 'opsRange': opsRange, 'types': types, 'empty': empty}, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  insertApiaryInsp(insp: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/insert/insp/apiary/' , insp, httpOptions);
  }

  /**
  *
  * @param insp
  *
  */
   insertApiaryEvent(insp: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/insert/event/apiary/' , insp, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  insertHiveInsp(insps: Inspection[]): Observable<Inspection[]> {
    return this.http.post<Inspection[]>(CONFIG.URL + 'inspection/insert/insp/hive/' , insps, httpOptions);
  }


  /**
  *
  * @param insp
  *
  */
  insertHiveEvent(insp: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(CONFIG.URL + 'inspection/insert/event/hive/' , insp, httpOptions);
  }

  /**
  *
  * @param insp
  *
  */
  updateInspection(insp: Inspection): Observable<Inspection> {
    return this.http.put<Inspection>(CONFIG.URL + 'inspection/update/insp/' + insp._id, insp, httpOptions);
  }

   /**
  *
  * @param insp
  *
  */
  updateEvent(insp: Inspection): Observable<Inspection> {
    return this.http.put<Inspection>(CONFIG.URL + 'inspection/update/event/' + insp._id, insp, httpOptions);
  }

  /**
  *
  * @param insp
  *
  */
  deleteHiveInsp(ids: String[]): Observable<String[]> {
    return this.http.post<String[]>(CONFIG.URL + 'inspection/delete/hive/' , ids, httpOptions);
  }


  getPictoInspect(cellPoint: Array<number>) {
    return INSPECTIONS.HiveAct.map(_path => {
      return  {
          type: 'path',
          scale: _path.scale,
          shape: {
              pathData: _path.path,
          },
          position: [cellPoint[0] + _path.position[0], cellPoint[1] + _path.position[1]],
          style: _path.style
      };
    });
  }

  getPictoEvent(cellPoint: Array<number>){
    return EVENTS.HiveAct.map(_path => {
      return  {
          type: 'path',
          scale: _path.scale,
          shape: {
              pathData: _path.path,
          },
          position: [cellPoint[0] + _path.position[0], cellPoint[1] + _path.position[1]],
          style: _path.style
      };
    });
  }

}
