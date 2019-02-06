import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../config';
import { Capteur } from './capteur';
import { Rucher } from '../accueil/ruche-rucher/rucher';
import { CapteurInterface } from '../_model/capteur';
import { UserloggedService } from '../userlogged.service';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CapteurService {
 
    capteur : CapteurInterface;
    capteurs : CapteurInterface[];
    capteursByUser : CapteurInterface[];
    capteurAcheter : CapteurInterface[];

    capteurObs : Observable<CapteurInterface>;
    capteursObs : Observable<CapteurInterface[]>;
    
    constructor(private http:HttpClient, private user : UserloggedService) {
        this.getCapteurs();
        this.getUserCapteurs();
        this.getSoldDevicesByUser();
        this.initCapteur();
    }

    initCapteur(){
        this.capteur = { 
            id : null,
            reference : '',
            name : '',
            type : '' ,
            description : '',
            username: '',
            idHive: '',
            idApiary: '',
            hiveName: '',
            apiaryName:''
        }
    }
 
    // pour créer un capteur
    createCapteur() {
        this.capteurObs = this.http.post<CapteurInterface>(CONFIG.URL+'sensors', this.capteur,httpOptions)
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
                this.capteur = data[0];
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    getSoldDevicesByUser(){
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL+'sold_devices/username/'+this.user.currentUser().username);
        this.capteursObs.subscribe(
            (data)=>{
                console.log(data);
                this.capteurAcheter = data;
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
    
    deleteCapteur() {
        this.capteurObs = this.http.delete<CapteurInterface>(CONFIG.URL+'sensors/' + this.capteur.id);
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

    updateCapteur() {
        this.capteurObs =  this.http.put<CapteurInterface>(CONFIG.URL+'sensors/update/' + this.capteur.id, this.capteur, httpOptions);
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

    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }

    
}