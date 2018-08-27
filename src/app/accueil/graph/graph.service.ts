import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
//import { Weather} from './weather';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class GraphService {
 
    
    constructor(private http:HttpClient) {}

    // pour afficher tout les ruchers
    getWeather() : Observable<any[]>{
        return this.http.get<any[]>(CONFIG.URL+'dailyweather/all');
    }   
    getMinTems() : Observable<any[]>{
        return this.http.get<any[]>(CONFIG.URL+'dailyweather/getMinTemps');
    }   
   
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }


 
}