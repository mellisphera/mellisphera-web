import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { Capteur } from './capteur';
import { Rucher } from '../ruche-rucher/rucher';
import { CapteurInterface } from '../../_model/capteur';
import { UserloggedService } from '../../../app/userlogged.service';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CapteurService {
 
    capteur : CapteurInterface;
    capteurs : CapteurInterface[];
    capteursByUser : CapteurInterface[];
    capteurObs : Observable<CapteurInterface>;
    capteursObs : Observable<CapteurInterface[]>;
    
    constructor(private http:HttpClient, private user : UserloggedService) {
        this.getCapteurs();
        this.getUserCapteurs();
    }
 
    // pour créer un capteur
    createCapteur(capteur : Capteur) {
        let body = JSON.stringify(capteur);

        this.capteurObs = this.http.post<CapteurInterface>(CONFIG.URL+'sensors', body,httpOptions)
        this.capteurObs.subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getUserCapteurs();
            }
        );
    }

    //get all sensors 
    getCapteurs(){
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL+'sensors/all')
        this.capteursObs.subscribe(
            (data)=>{
                this.capteurs = data;
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    getUserCapteurs(){
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL+'sensors/'+this.user.currentUser().username);
        this.capteursObs.subscribe(
            (data)=>{
                this.capteursByUser = data;
            },
            (err)=>{
                console.log(err);
            },
        );
    }
    
    deleteCapteur(capteur) {
        return this.http.delete(CONFIG.URL+'sensors/' + capteur.id);
    }

    updateCapteur(capteur : Capteur) {
        let body = JSON.stringify(capteur);
        return this.http.put(CONFIG.URL+'sensors/update/' + capteur.id, body, httpOptions);
    }

    checkCapteurType(capteurRef){
        this.capteurObs = this.http.get<CapteurInterface>(CONFIG.URL+'sold_devices/check/'+capteurRef);
        this.capteurObs.subscribe(
            (data)=>{
                this.capteur = data;
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }

    
}