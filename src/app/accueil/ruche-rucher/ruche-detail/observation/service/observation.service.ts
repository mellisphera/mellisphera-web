import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../../../config';
import { Observable } from 'rxjs';
import { Observation } from '../../../../../_model/observation';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  observationsObs : Observable<Observation[]>;
  observationObs : Observable<Observation>;
  observationsHive : Observation[];
  observationsApiary : Observation[];
  observation : Observation;
  constructor(private http : HttpClient) { }


  getObservationByIdHive(idHive : string){
    this.observationsObs = this.http.get<Observation[]>(CONFIG.URL+'report/hive/'+idHive);
    this.observationsObs.subscribe(
      (data)=>{
        console.log(data);
        this.observationsHive = data;
        console.log(this.observationsHive);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  getObservationByIdApiary(idApiary : string){
    this.http.get<Observation[]>(CONFIG.URL+'report/apiary/'+idApiary).subscribe(
      (data)=>{
        console.log(data);
        this.observationsApiary = data;
        console.log(this.observationsApiary);
      },
      (err)=>{
        console.log(err);
      }
    );
  }
  createObservation(){
    this.observationObs = this.http.put<Observation>(CONFIG.URL+'report/insert',this.observation);
    this.observationObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.getObservationByIdHive(this.observation.idHive);
        this.getObservationByIdApiary(this.observation.idApiary);
      }
    );
  }

  updateObservation(){
    this.observationObs = this.http.put<Observation>(CONFIG.URL+'report/update/'+this.observation.id,this.observation);
    this.observationObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.getObservationByIdHive(this.observation.idHive);
      }
    );
  }

  deleteObservation(){
    this.observationObs = this.http.delete<Observation>(CONFIG.URL+'report/'+this.observation.id);
    this.observationObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.getObservationByIdHive(this.observation.idHive);
        this.getObservationByIdApiary(this.observation.idApiary);
      }
    );
  }
}
