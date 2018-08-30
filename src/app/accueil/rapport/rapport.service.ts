import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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
        return this.http.post('***REMOVED***:5000/nlu/nluAnalyse',body, httpOptions);
    }

    getNluSave(texte, idApiary){
        let body = JSON.stringify({"texte":texte,"idApiary":idApiary});
        return this.http.post('***REMOVED***:5000/nlu/nluSave',body, httpOptions);
    }

    getRapportTemp(username):Observable<ProcessReport[]>{
        return this.http.get<ProcessReport[]>(CONFIG.URL+'report_temp/'+username);
    }

    // error handling
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    
}