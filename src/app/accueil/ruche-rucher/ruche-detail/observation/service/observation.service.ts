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

  observationObs : Observable<Observation[]>;
  observations : Observation[];

  constructor(private http : HttpClient) { }


  getObservationByIdHive(idHive : string){
    this.observationObs = this.http.get<Observation[]>(CONFIG.URL+'report/hive/'+idHive);
    this.observationObs.subscribe(
      (data)=>{
        this.observations = data;
        console.log(this.observations);
      },
      (err)=>{
        console.log(err);
      }
    );
  }
}
