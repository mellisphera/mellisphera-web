import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../../config';
import { Rucher } from '../rucher';
import { Ruche } from '../ruche';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucheDetailService {
 
    
    constructor(private http:HttpClient) {}
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --

    // pour afficher tout les ruchers de l'utilsateur connecté
    getObservationsHive(idHive) : Observable<any[]>{
        return this.http.get<any[]>(CONFIG.URL+'report/hive/'+idHive);
    }  
    // pour afficher tout les ruchers de l'utilsateur connecté
    getActionsApicoles(hiveName) : Observable<any[]>{
        //alert(hiveName);
        return this.http.get<any[]>(CONFIG.URL+'report/apicole-ruche/'+hiveName);
    }  
    // pour afficher tout les ruchers de l'utilsateur connecté
    deleteReport(report) {
        return this.http.delete(CONFIG.URL+'report/' + report.sentence);
    }
    
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    

}