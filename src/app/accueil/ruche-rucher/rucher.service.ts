import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
//import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { ProcessReport } from './processedReport';
import { Rucher } from '../../_model/rucher';
import { UserloggedService } from '../../userlogged.service';
import { RucheService } from '../disposition-ruche/Service/ruche.service';
import { DailyRecordService } from '../disposition-ruche/Service/dailyRecordService';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucherService {
 
    rucher : Rucher;
    ruchers : Rucher[]=null;

    rucherObs : Observable<Rucher[]>;

    constructor(private http:HttpClient, private user : UserloggedService, private ruche : RucheService, private dailyRec : DailyRecordService) {
        this.getUserRuchers(this.user.currentUser().username);
    }
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
    getUserRuchers(username){
        this.rucherObs = this.http.get<Rucher[]>(CONFIG.URL+'apiaries/'+ username);
        this.rucherObs.subscribe(
            (data)=>{
                this.ruchers = data;
                this.rucher = data[0];
                this.ruche.getRucheByApiary(this.user.currentUser().username,this.rucher.id);
                this.dailyRec.getDailyRecThByApiary(this.rucher.id);
                console.log(this.rucher);
            },
            (err)=>{
                console.log(err);   
            }
        );
    }  
    // pour afficher tout les ruchers
    getRucherDetails(idApiary){
        this.http.get<Rucher>(CONFIG.URL+'apiaries/details/'+idApiary).subscribe(
            (data)=>{
                this.rucher = data;
            },
            (err)=>{
                console.log(err);
            }
        )
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
        //let body = JSON.stringify(ruche);
        return this.http.put(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,ruche,httpOptions);
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