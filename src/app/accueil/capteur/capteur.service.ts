import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { Capteur } from './capteur';
import { Rucher } from '../ruche-rucher/rucher';
import { CapteurInterface } from '../../_model/capteur';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CapteurService {
 
    
    constructor(private http:HttpClient) {}
 
    // pour créer un capteur
    createCapteur(capteur : Capteur) {
        let body = JSON.stringify(capteur);
        return this.http.post(CONFIG.URL+'sensors', body,httpOptions).
        catch(this.errorHandler);
    }

    //get all sensors 
    getCapteurs() : Observable<Capteur[]>{
        return this.http.get<Capteur[]>(CONFIG.URL+'sensors/all');
    }

    getUserCapteurs(username) : Observable<Capteur[]>{
        return this.http.get<Capteur[]>(CONFIG.URL+'sensors/'+username);
    }
    
    deleteCapteur(capteur) {
        return this.http.delete(CONFIG.URL+'sensors/' + capteur.id);
    }

    updateCapteur(capteur : Capteur) {
        let body = JSON.stringify(capteur);
        return this.http.put(CONFIG.URL+'sensors/update/' + capteur.id, body, httpOptions);
    }

    checkCapteurType(capteurRef) : Observable<CapteurInterface>{
        return this.http.get<CapteurInterface>(CONFIG.URL+'sold_devices/check/'+capteurRef);
    }

    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }

    
}