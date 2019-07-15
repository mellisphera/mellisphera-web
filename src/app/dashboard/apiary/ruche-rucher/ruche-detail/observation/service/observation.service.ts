import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../../../../constants/config';
import { Observable, BehaviorSubject } from 'rxjs';
import { Observation } from '../../../../../../_model/observation';
import { MyDate } from '../../../../../../class/MyDate';
import { DataRange } from '../../service/Record/data-range';
import { StackService } from '../../../../stack-apiary/service/stack.service';
import { UserParamsService } from '../../../../../preference-config/service/user-params.service';
import { UnitService } from '../../../../../service/unit.service';

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
  observation: Observation;
  obsHiveSubject: BehaviorSubject<Observation[]>;
  mergeStackObsApiary: any;
  mergeStackObsHIve: any;
  private imgHiveObs: string;
  private imgHiveAct: string;
  private rangeObs: Date[];
  constructor(private http: HttpClient,
      private stackService: StackService,
      private unitService: UnitService) {
      //  this.observationsApiary = [];
    this.obsHiveSubject = new BehaviorSubject([]);
    this.observationsApiary = [];
    this.setRange({scale: 1, type: 'YEAR'});
    
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
      date.setFullYear(new Date().getFullYear() - 1);
    }
    this.rangeObs = MyDate.getRange(date);
  }

  /**
   *
   *
   * @param {string} idHive
   * @param {string} [hiveName]
   * @returns {Observable<any>}
   * @memberof ObservationService
   */
  getObservationByIdHive(idHive: string, hiveName?: string): Observable<any> {
    return this.http.post<Observation[]>(CONFIG.URL + 'report/hive/' + idHive, this.rangeObs).map(res => {
      this.observationsHive = res.sort((a: Observation, b: Observation) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      return {
        name: (hiveName) ? hiveName + ' / note' : idHive,
        type: 'custom',
        xAxisIndex: 1,
        yAxisIndex: 1,
        tooltip: {
          trigger: 'item',
          formatter: (param) => {
            return this.unitService.getHourlyDate(param.name) + ': </br>'
                + param.value[3];
          }
        },
        // data: res.map(elt => [elt.date, 0, elt.sentence, elt.type, elt.idHive]),
        data: res.map(elt => {
          return { name: elt.date, value: [elt.date, 5, elt.type, elt.sentence]};
        }),
        renderItem: (param, api) => {
          const point = api.coord([
            api.value(0),
            0
          ]);
          return {
            type: 'group',
            children: [{
              type: 'path',
              shape: {
                pathData: (api.value(2)) === 'HiveAct' ? this.imgHiveAct : this.imgHiveObs,
                x: -45 / 2,
                y: -45 / 2,
                width: 30,
                height: 30
              },
              position: [point[0], 50],
              style: api.style({
                fill: this.stackService.getColorByHive(idHive)
              })
            }]
          };
        },
        z: 11
      };
    });
  }


  /**
   *
   *
   * @param {string} idApiary
   * @returns {Observable<Observation[]>}
   * @memberof ObservationService
   */
  getObservationByIdApiary(idApiary: string){
    this.http.post<Observation[]>(CONFIG.URL + 'report/apiary/' + idApiary, this.rangeObs).subscribe(
      obs => {
          this.observationsApiary = obs;
      });
  }
  /**
   *
   *
   * @param {Observation} observation
   * @returns {Observable<Observation>}
   * @memberof ObservationService
   */
  createObservation(observation: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/insert', observation);
  }

  /**
   *
   *
   * @param {Observation} obs
   * @returns {Observable<Observation>}
   * @memberof ObservationService
   */
  updateObservation(obs: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/update/' + obs.id, obs);
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
  
}
