import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RapportService {
    rapport: any [] = [];
    
    constructor(private http:HttpClient) {}
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --

    getNluResult(texte){
        let body = JSON.stringify(texte);
        return this.http.post('http://51.38.49.225:5000/star', { texte : texte } , httpOptions);
    }


    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }


    
    
}