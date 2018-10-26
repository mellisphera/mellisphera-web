import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { ProcessReport } from './processedReport';
import { UserloggedService } from '../../userlogged.service';
import { RucheService } from '../disposition-ruche/Service/ruche.service';
import { DailyRecordService } from '../disposition-ruche/Service/dailyRecordService';
import { RucherModel } from '../../_model/rucher-model';
import { Observation } from '../../_model/observation';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucherService {
 
    rucher : RucherModel;
    ruchers : RucherModel[];

    rucherSelectUpdate : RucherModel;

    observations : Observation;
    observationObs : Observable<Observation[]>;
    rucherObs : Observable<RucherModel>;
    ruchersObs : Observable<RucherModel[]>;

    constructor(private http:HttpClient, private user : UserloggedService, public rucheService : RucheService, private dailyRec : DailyRecordService) {
        this.getUserRuchersLast(this.user.currentUser().username);
        this.rucheService.ruche = { 
            id : '',
            name : '',
            description : '',
            username : '',
            idApiary: '',
            hivePosX : '',
            hivePosY : ''
         }
         this.rucherSelectUpdate = {
            id : '',
            latitude: '',
            longitude: '',
            name: '',
            description : '',
            createdAt : null,
            urlPhoto : '',
            username : '',
            codePostal : '',
            ville : ''
         }
    }
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --
    // pour créer un rucher
    createRucher() {
        this.rucherObs = this.http.post<RucherModel>(CONFIG.URL+'apiaries',this.rucher);
        this.rucherObs.subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getUserRuchersLast(this.user.currentUser().username);
            }
        );
    }
    // pour afficher tout les ruchers de l'utilsateur connecté
    getUserRuchersLast(username){
        this.ruchersObs = this.http.get<RucherModel[]>(CONFIG.URL+'apiaries/'+ username);
        this.ruchersObs.subscribe(
            (data)=>{
                this.rucher = data[data.length-1];
                this.rucherSelectUpdate = data[data.length-1];
                this.ruchers = data;
                console.log(this.rucherSelectUpdate);
            },
            (err)=>{
                console.log(err);   
            },
            ()=>{
                this.rucheService.getRucheByApiary(this.user.currentUser().username,this.rucher.id);
                this.dailyRec.getDailyRecThByApiary(this.rucher.id);
            }
        );
    }

    getObservation(idApiary) {
        //return this.http.get<ProcessReport[]>(CONFIG.URL+'report/apiary/'+idApiary);
    }
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    
}