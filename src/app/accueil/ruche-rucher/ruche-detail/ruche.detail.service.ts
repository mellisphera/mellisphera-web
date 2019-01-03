import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../../config';
import { Rucher } from '../rucher';
import { Ruche } from '../ruche';
import { ProcessReport } from '../processedReport';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucheDetailService {
    
    
    constructor(private http:HttpClient) {

    }
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --

    // pour afficher tout les ruchers de l'utilsateur connecté
    getObservationsHive(idHive) : Observable<ProcessReport[]>{
        return this.http.get<ProcessReport[]>(CONFIG.URL+'report/hive/'+idHive);
    }  
    // pour afficher tout les ruchers de l'utilsateur connecté
    deleteReport(report) {
        return this.http.delete(CONFIG.URL+'report/' + report.sentence);
    }
    
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    

}