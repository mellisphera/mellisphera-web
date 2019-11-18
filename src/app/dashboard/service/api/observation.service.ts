/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../constants/config';
import { Observable, BehaviorSubject } from 'rxjs';
import { Observation } from '../../../_model/observation';
import { MyDate } from '../../../class/MyDate';
import { DataRange } from '../../../_model/data-range';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { UnitService } from '../unit.service';
import { RucheService } from './ruche.service';
import { INSPECTIONS } from '../../melli-charts/charts/icons/icon_inspect';
import { filter } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  observationsObs: Observable<Observation[]>;
  observationObs: Observable<Observation>;
  observationsHive: Observation[];
  observationsApiary: Observation[];
  observationsApiaryUser: Observation[];
  observationsHiveUser: Observation[];
  observation: Observation;
  public obsHiveSubject: BehaviorSubject<Observation[]>;
  mergeStackObsApiary: any;
  mergeStackObsHIve: any;
  private imgHiveObs: string;
  private imgHiveAct: string;
  private rangeCalendar: Date[];
  private rangeObs: Date[];
  constructor(private http: HttpClient,
      private rucheService: RucheService,
      private unitService: UnitService) {
      //  this.observationsApiary = [];
    this.obsHiveSubject = new BehaviorSubject([]);
    this.observationsApiary = [];
    this.observationsHive = [];
    this.observationsApiaryUser = [];
    this.observationsHiveUser = [];
    this.setRange({scale: 100, type: 'YEAR'});
    
    this.imgHiveObs = 'M256,96C144.341,96,47.559,161.021,0,256c47.559,94.979,144.341,160,256,160c111.656,0,208.439-65.021,256-160' +
		'C464.441,161.021,367.656,96,256,96z M382.225,180.852c30.082,19.187,55.572,44.887,74.719,75.148' +
		'c-19.146,30.261-44.639,55.961-74.719,75.148C344.428,355.257,300.779,368,256,368c-44.78,0-88.428-12.743-126.225-36.852' +
		'c-30.08-19.188-55.57-44.888-74.717-75.148c19.146-30.262,44.637-55.962,74.717-75.148c1.959-1.25,3.938-2.461,5.929-3.65' +
		'C130.725,190.866,128,205.613,128,221c0,70.691,57.308,128,128,128c70.691,0,128-57.309,128-128' +
		'c0-15.387-2.725-30.134-7.703-43.799C378.285,178.39,380.266,179.602,382.225,180.852z M256,205c0,26.51-21.49,48-48,48' +
    's-48-21.49-48-48s21.49-48,48-48S256,178.49,256,205z';
    

    this.imgHiveAct = 'M162.9,198.9v-22.95c-22.95-15.3-38.25-42.075-38.25-70.763c0-47.812,38.25-86.062,86.062-86.062' +
    'c47.812,0,86.062,38.25,86.062,86.062c0,17.212-5.737,34.425-15.3,47.812c1.913,0,3.825,0,5.737,0c5.738,0,11.476,0,15.301,1.913' +
    'c7.649-15.3,13.387-32.513,13.387-49.725C315.9,47.812,268.087,0,210.713,0c-57.375,0-105.188,47.812-105.188,105.188' +
    'C105.525,145.35,128.475,181.688,162.9,198.9z' +
    'M277.65,105.188c0-36.337-30.6-66.938-66.937-66.938s-66.938,30.6-66.938,66.938c0,19.125,7.65,34.425,19.125,45.9v-45.9' +
    'c0-26.775,21.038-47.812,47.812-47.812s47.812,21.038,47.812,47.812v45.9C270,139.612,277.65,124.312,277.65,105.188z' +
    'M440.212,210.375c-15.3,0-28.688,13.388-28.688,28.688v42.075v5.737H392.4v-43.987v-22.95' +
    'c0-15.3-13.387-28.688-28.688-28.688c-15.3,0-28.688,13.388-28.688,28.688v19.125v28.688H315.9v-28.688v-38.25' +
    'c0-15.3-13.387-28.688-28.688-28.688c-15.3,0-28.688,13.388-28.688,28.688v36.337v49.725H239.4v-47.812V105.188' +
    'c0-15.3-13.388-28.688-28.688-28.688c-15.3,0-28.688,13.388-28.688,28.688v196.987c-40.163-42.075-91.8-87.975-112.837-66.938' +
    'C48.15,256.275,103.613,313.65,178.2,439.875c34.425,57.375,76.5,95.625,149.175,95.625c78.412,0,143.438-65.025,143.438-143.438' +
    'V328.95v-89.888C468.9,223.763,455.513,210.375,440.212,210.375z';

  }

  /**
   *
   *
   * @memberof ObservationService
   */
  emitHiveSubject() {
    this.obsHiveSubject.next(this.observationsHive.slice());
  }
  /**
   *
   *
   * @param {DataRange} scale
   * @memberof ObservationService
   */
  setRange(scale: DataRange): void {
    let date;
    if (scale.type === 'DAY') {
      date = new Date();
      date.setDate((new Date().getDate() - scale.scale));
    } else if (scale.type === 'MONTH') {
      date = new Date();
      date.setMonth((new Date().getMonth() - scale.scale));
    } else {
      date = new Date();
      date.setFullYear(new Date().getFullYear() - scale.scale);
    }
    this.rangeObs = MyDate.getRange(date);
  }

  setRangeForMelliCharts(range: Date[]) {
    this.rangeObs = range;
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {string} [hiveName]
   * @returns {Observable<any>}
   * @memberof ObservationService
   */
/*   getObservationByhiveId(hiveId: string, hiveName?: string) {
    this.rangeObs[1] = new Date();
    return this.http.post<Observation[]>(CONFIG.URL + 'report/hive/' + hiveId, this.rangeObs).subscribe(
      _obs => {
        this.observationsHive = _obs.sort((a: Observation, b: Observation) => {
          return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
        });
        console.log(this.observationsHive);
        this.emitHiveSubject();
      }
    );
  } */

  getNoteByUserId(userId: string): void{
    this.http.get<Observation[]>(CONFIG.URL + 'report/user/' + userId).subscribe(
      _note => {
        this.observationsHive = _note.filter(_note => _note.type === 'hive');
        this.observationsApiary = _note.filter(_note => _note.type === 'apiary');
      }
    );
  }

  /**
   *
   *
   * @param {string} hiveId
   * @param {Date[]} range
   * @returns {Observable<Observation[]>}
   * @memberof ObservationService
   */
  getObservationByHiveForMelliCharts(hiveId: string, range: Date[]): Observable<Observation[]> {
    return this.http.post<Observation[]>(CONFIG.URL + 'report/hive/' + hiveId, range);
  }

  /**
   *
   *
   * @param {*} apiaryId
   * @returns {Observable<Observation[]>}
   * @memberof ObservationService
   */
  getObservationByapiaryIdForMelliUx(apiaryId): Observable<Observation[]> {
    return this.http.post<Observation[]>(CONFIG.URL + 'report/apiary/' + apiaryId, MyDate.getRangeForCalendarAlerts());
  }


/*   getObservationByapiaryId(apiaryId: string){
    this.http.post<Observation[]>(CONFIG.URL + 'report/apiary/' + apiaryId, this.rangeObs).subscribe(
      obs => {
          this.observationsApiary = obs;
      });
  } */
  /**
   *
   *
   * @param {Observation} observation
   * @returns {Observable<Observation>}
   * @memberof ObservationService
   */
  createObservation(observation: Observation): Observable<Observation> {
    return this.http.post<Observation>(CONFIG.URL + 'report/insert', observation);
  }

  /**
   *
   *
   * @param {Observation} obs
   * @returns {Observable<Observation>}
   * @memberof ObservationService
   */
  updateObservation(obs: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/update/' + obs._id, obs);
  }

  /**
   *
   *
   * @param {string} idObs
   * @returns {Observable<Observation>}
   * @memberof ObservationService
   */
  deleteObservation(idObs: string): Observable<Observation> {
    return this.http.delete<Observation>(CONFIG.URL + 'report/' + idObs);
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
}
