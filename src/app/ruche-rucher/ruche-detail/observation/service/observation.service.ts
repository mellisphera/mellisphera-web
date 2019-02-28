import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../../config';
import { Observable, BehaviorSubject } from 'rxjs';
import { Observation } from '../../../../_model/observation';

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
  constructor(private http: HttpClient) {
    this.obsHiveSubject = new BehaviorSubject([]);
    this.obsApiarySubject = new BehaviorSubject([]);
  }

  emitHiveSubject() {
    this.obsHiveSubject.next(this.observationsHive.slice());
    console.log(this.obsHiveSubject);
  }
  emitApiarySubject() {
    this.obsApiarySubject.next(this.observationsApiary.slice());
    console.log(this.obsApiarySubject);
  }

  getObservationByIdHive(idHive : string){
    this.observationsObs = this.http.get<Observation[]>(CONFIG.URL + 'report/hive/' + idHive);
    this.observationsObs.subscribe(
      (data) => {
        this.observationsHive = data;
        this.obsHiveSubject.next(data);
        console.log(this.observationsHive);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.obsHiveSubject.complete();
      }
    );
  }

  getObservationByIdApiary(idApiary: string) {
    this.http.get<Observation[]>(CONFIG.URL + 'report/apiary/' + idApiary).subscribe(
      (data) => {
        this.observationsApiary = data;
        this.obsApiarySubject.next(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.obsApiarySubject.complete();
      }
    );
  }
  createObservation(observation: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/insert', observation);

   /* this.observationObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        if (this.observation.idApiary) {
          this.getObservationByIdApiary(this.observation.idApiary);
        } else {
          this.getObservationByIdHive(this.observation.idHive);
        }
      }
    );*/
  }

  updateObservation(obs: Observation): Observable<Observation> {
    return this.http.put<Observation>(CONFIG.URL + 'report/update/' + obs.id, obs);
    /*
    this.observationObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        if (this.observation.idApiary) {
          this.observationsApiary[this.observationsApiary.indexOf(this.observation)] = this.observation;
          this.emitApiarySubject();
        } else {
          this.observationsHive[this.observationsHive.indexOf(this.observation)] = this.observation;
          this.emitHiveSubject();
        }
      }
    );*/
  }

  deleteObservation(idObs: string): Observable<Observation> {
    return this.http.delete<Observation>(CONFIG.URL + 'report/' + idObs);
   /* this.observationObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        if (this.observation.idApiary) {
          const index = this.observationsApiary.indexOf(this.observation);
          this.observationsApiary.splice(index,1);
          this.emitApiarySubject();
        } else {
          const index = this.observationsHive.indexOf(this.observation);
          this.observationsHive.splice(index,1);
          this.emitHiveSubject();
        }
        //this.getObservationByIdHive(this.observation.idHive);
        //this.getObservationByIdApiary(this.observation.idApiary);
      }
    );*/
  }
}
