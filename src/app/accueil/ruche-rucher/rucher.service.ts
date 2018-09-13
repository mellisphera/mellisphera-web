import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from 'config';
import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { ProcessReport } from './processedReport';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucherService {
 
    
    constructor(private http:HttpClient) {}
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --
    // pour créer un rucher
    createRucher(rucher) {
        //let body = JSON.stringify(rucher);
        return this.http.post(CONFIG.URL+'apiaries', rucher ,httpOptions).
        catch(this.errorHandler);
    }
    // pour afficher tout les ruchers
    getRuchers() : Observable<Rucher[]>{
        return this.http.get<Rucher[]>(CONFIG.URL+'apiaries/all');
    }   
    // pour afficher tout les ruchers de l'utilsateur connecté
    getUserRuchers(username) : Observable<Rucher[]>{
        return this.http.get<Rucher[]>(CONFIG.URL+'apiaries/'+ username);
    }  
    // pour afficher tout les ruchers
    getRucherDetails(idApiary) : Observable<Rucher[]>{
            return this.http.get<Rucher[]>(CONFIG.URL+'apiaries/details/'+idApiary);
    }  
    updateRucher(rucher) {
        let body = JSON.stringify(rucher);
        return this.http.put(CONFIG.URL+'apiaries/update/' + rucher.id, body, httpOptions);
    }
    deleteRucher(rucher) {
        return this.http.delete(CONFIG.URL+'apiaries/' + rucher.id);
    }
    //get rucher name
    getRucherName(idApiary) : Observable<Rucher> {
        return this.http.get<Rucher>(CONFIG.URL+'apiaries/name/'+idApiary);
    } 

    // -- RUCHE -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- -- RUCHE -- 
    // pour créer une ruche dans un rucher
    createRuche(ruche) {
        let body = JSON.stringify(ruche);
        return this.http.post(CONFIG.URL+'hives', body , httpOptions);
    }
    updateRuche(ruche) {
        let body = JSON.stringify(ruche);
        return this.http.put(CONFIG.URL+'hives/update/' + ruche.id, body, httpOptions);
    }
    // Service permettant de récuperer les ruches du rucher selectionné d'un utilisateur X
    getUserRuches(username,idRucher) : Observable<Ruche[]>{
        return this.http.get<Ruche[]>(CONFIG.URL+'hives/'+ username +'/'+ idRucher);
    }   
    // pour supprimer une ruche
    deleteRuche(ruche) {
        return this.http.delete(CONFIG.URL+'hives/' + ruche.id);
    }

    updateCoordonneesRuche(ruche){
        let body = JSON.stringify(ruche);
        return this.http.put(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,body,httpOptions);
    }

    getRucheDetail(idHive) : Observable<Ruche> {
        return this.http.get<Ruche>(CONFIG.URL+'hives/details/'+idHive);
    } 

    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }

    createObservation(observation) {
        return this.http.put(CONFIG.URL+'report/insert',observation);
    }

    getObservation(idApiary): Observable<ProcessReport[]> {
        return this.http.get<ProcessReport[]>(CONFIG.URL+'report/apiary/'+idApiary);
    }

    updateObs(observation) {
        return this.http.put(CONFIG.URL+'report/update/' + observation.id, observation);
    }

    deleteObservation(idObs) {
        return this.http.delete(CONFIG.URL+'report/'+idObs);
    }
}