import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { Capteur } from './capteur';
import { Rucher } from '../ruche-rucher/rucher';

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


    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }

    /*
    // pour créer une ruche dans un rucher
    createRuche(capteur : Capteur) {
        let body = JSON.stringify(capteur);
        return this.http.post(CONFIG.URL+'hives', body , httpOptions);
    }
    // pour afficher tout les ruchers
    getRuchers() : Observable<Capteur[]>{
        return this.http.get<Capteur[]>(CONFIG.URL+'apiaries/all');
    }   
    // pour afficher tout les ruchers de l'utilsateur connecté
    getUserRuchers(username) : Observable<Capteur[]>{
        return this.http.get<Capteur[]>(CONFIG.URL+'apiaries/'+ username);
    }  
    // Service permettant de récuperer les ruches du rucher selectionné d'un utilisateur X
    getUserRuches(username,idRucher) : Observable<Capteur[]>{
        return this.http.get<Capteur[]>(CONFIG.URL+'hives/'+ username +'/'+ idRucher);
    }   
   // pour afficher tout les ruchers
    getRucherDetails(idApiary) : Observable<Capteur[]>{
    return this.http.get<Capteur[]>(CONFIG.URL+'apiaries/details/'+idApiary);
    }  
    */
}