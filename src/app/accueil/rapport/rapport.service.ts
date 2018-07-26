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

    getNluResult(texte, idApiary){
        let body = JSON.stringify(texte);
        return this.http.post('http://51.38.49.225:5000/star', { texte : texte, idApiary : idApiary} , httpOptions);
    }
    // pour afficher tout les observations de nature
    getObservationsNature(idApiary) : Observable<any[]>{
        return this.http.get<any[]>(CONFIG.URL+'report/nature/'+idApiary);
    }  
    // pour afficher tout les ruchers de l'utilsateur connecté
    getObservationsRuche(idApiary) : Observable<any[]>{
        return this.http.get<any[]>(CONFIG.URL+'report/ruche/'+idApiary);
    }  
    // pour afficher tout les ruchers de l'utilsateur connecté
    getActionsApicoles(idApiary) : Observable<any[]>{
        return this.http.get<any[]>(CONFIG.URL+'report/apicole/'+idApiary);
    }  

    // error handling
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }


    
    
}