import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from 'config';
import { ProcessReport } from '../ruche-rucher/processedReport';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RapportService {
    rapport: any [] = [];
    
    constructor(private http:HttpClient) {}
    
    //to save in processReportTemp
    getNluResult(texte, idApiary){
        let body = JSON.stringify({"texte":texte,"idApiary":idApiary});
        //LOCAL
        //return this.http.post('http://localhost:5000/nlu/nluAnalyse',body, httpOptions);
        //SERVEUR
        return this.http.post('http://51.68.71.91:5000/nlu/nluAnalyse',body, httpOptions);
    }

    getNluSave(texte, idApiary){
        let body = JSON.stringify({"texte":texte,"idApiary":idApiary});
        //LOCAL
        //return this.http.post('http://localhost:5000/nlu/nluSave',body, httpOptions);
        //SERVEUR
        return this.http.post('http://51.68.71.91:5000/nlu/nluSave',body, httpOptions);
    }

    getRapportTemp(username):Observable<ProcessReport[]>{
        return this.http.get<ProcessReport[]>(CONFIG.URL+'report_temp/'+username);
    }

    deleteObsTemp(idTemp){
        return this.http.delete(CONFIG.URL+'report_temp/delete/'+idTemp);
    }


    getSave(username){
        return this.http.get<ProcessReport[]>(CONFIG.URL+'report_temp/add/'+username);
    }

    // error handling
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    
}