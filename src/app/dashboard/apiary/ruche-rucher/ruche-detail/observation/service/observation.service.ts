import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../../../../config';
import { Observable, BehaviorSubject } from 'rxjs';
import { Observation } from '../../../../../../_model/observation';
import { MyDate } from '../../../../../../class/MyDate';
import { DataRange } from '../../service/Record/data-range';

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
  obsApiarySubject: BehaviorSubject<Observation[]>;
  mergeStackObsApiary: any;
  mergeStackObsHIve: any;
  private imgApiaryObs: string;
  private imgApiaryAct: string;
  private rangeObs: Date[];
  constructor(private http: HttpClient) {
    this.obsHiveSubject = new BehaviorSubject([]);
    this.obsApiarySubject = new BehaviorSubject([]);
    this.imgApiaryObs = './assets/icons/apiaryAct.png';
    this.imgApiaryAct = './assets/icons/apiaryObs.png';
    this.rangeObs = [new Date('2010-01-01'), new Date()];
  }

  emitHiveSubject() {
    this.obsHiveSubject.next(this.observationsHive.slice());
    console.log(this.obsHiveSubject);
  }
  emitApiarySubject() {
    this.obsApiarySubject.next(this.observationsApiary.slice());
    console.log(this.obsApiarySubject);
  }

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
  getObservationByIdHive(idHive: string) {
    return this.http.post<Observation[]>(CONFIG.URL + 'report/hive/' + idHive, this.rangeObs).map(res => {
      this.observationsHive = res;
      return {
        name: idHive,
        type: 'custom',
        xAxisIndex: 1,
        yAxisIndex: 1,
        tooltip: {
          trigger: 'item',
          formatter: (param) => {
            return param.value[0] + ': '
              + param.value[1] + ' - ' + param.value[2];
          }
        },
        data: res.map(elt => [elt.date, elt.type, elt.sentence]),
        renderItem: (param, api) => {
          const point = api.coord([
            api.value(0),
            0
          ]);
          const img = this.imgApiaryAct;
          return {
            type: 'group',
            children: [{
              type: 'image',
              style: {
                image: img,
                x: -img / 2,
                y: -img / 2,
                width: 25,
                height: 25
              },
              position: [point[0], 50]
            }]
          };
        },
        z: 11
      }
    });
  }

  getObservationByIdApiary(idApiary: string) {
    this.http.post<Observation[]>(CONFIG.URL + 'report/apiary/' + idApiary, this.rangeObs).map(res => {
      this.mergeStackObsApiary = {
        name: idApiary,
        type: 'custom',
        tooltip: {
          trigger: 'item',
          formatter: (param) => {
            return param.value[0] + ': '
              + param.value[1] + ' - ' + param.value[2];
          }
        },
        data: res.map(elt => [elt.date, elt.type, elt.sentence]),
        renderItem: (param, api) => {
          const point = api.coord([
            api.value(0),
            0
          ]);
          const img = (api.value(1) === 'imgApiaryObs') ? this.imgApiaryObs : this.imgApiaryAct;
          return {
            type: 'group',
            children: [{
              type: 'image',
              style: {
                image: img,
                x: -img / 2,
                y: -img / 2,
                width: 25,
                height: 25
              },
              position: [point[0], 50]
            }]
          };
        },
        z: 11
      };
      return res;
    })
      .subscribe(
        (data) => {
          this.observationsApiary = data;
          this.obsApiarySubject.next(data);
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.obsApiarySubject.complete();
          console.log(this.mergeStackObsApiary);
        }
      );
  }
  createObservation(observation: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/insert', observation);
  }

  updateObservation(obs: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/update/' + obs.id, obs);
  }

  deleteObservation(idObs: string): Observable<Observation> {
    return this.http.delete<Observation>(CONFIG.URL + 'report/' + idObs);
  }
}
