import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { CONFIG } from '../../../../constants/config';

import { InspCat } from './../../../_model/inspCat';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InspCatService {

  constructor(private http: HttpClient) {}

  /**
   *
   *  @memberof InspCatService
   *  @returns InspCat[]
   */
  getInspCat(): Observable<InspCat[]>{
    return this.http.get<InspCat[]>(CONFIG.URL + 'inspCat/all', httpOptions);
  }


  /**
   *
   *  @memberof InspCatService
   *  @param type : string
   *  @returns InspCat[]
   */
  getInspCatByType(type: string): Observable<InspCat[]>{
    return this.http.get<InspCat[]>(CONFIG.URL + 'inspCat/type/' + type, httpOptions);
  }


  /**
   *
   *  @memberof InspCatService
   *  @param applies : string[]
   *  @returns InspCat[]
   */
  getInspCatByApplies(applies: string[]): Observable<InspCat[]>{
    return this.http.post<InspCat[]>(CONFIG.URL + 'inspCat/applies', applies, httpOptions);
  }


  /**
   *
   *  @memberof InspCatService
   *  @param seasons : string[]
   *  @returns InspCat[]
   */
  getInspCatBySeasons(seasons: string[]): Observable<InspCat[]>{
    return this.http.post<InspCat[]>(CONFIG.URL + 'inspCat/seasons', seasons, httpOptions);
  }


}
