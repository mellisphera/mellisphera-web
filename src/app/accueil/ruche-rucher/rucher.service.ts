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
import { ObservationService } from './ruche-detail/observation/service/observation.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucherService {
 
    rucher : RucherModel;
    ruchers : RucherModel[];
    detailsRucher : RucherModel;

    rucherSelectUpdate : RucherModel;

    rucherObs : Observable<RucherModel>;
    ruchersObs : Observable<RucherModel[]>;

    constructor(private http:HttpClient, private user : UserloggedService, 
        public rucheService : RucheService, 
        private dailyRec : DailyRecordService,
        public observationService : ObservationService) {
        this.getUserRuchersLast(this.user.currentUser().username);
        this.initRuche();
    }
    initRuche(){
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
         };
         this.rucher = {
            id : null,
            latitude: '',
            longitude: '',
            name: '',
            description : '',
            createdAt : null,
            urlPhoto : '',
            username : '',
            codePostal : '',
            ville : ''
         };
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
                console.log(this.rucher);
                this.getUserRuchersLast(this.user.currentUser().username);
            }
        );
    }
    // pour afficher tout les ruchers de l'utilsateur connecté
    getUserRuchersLast(username){
        this.ruchersObs = this.http.get<RucherModel[]>(CONFIG.URL+'apiaries/'+ username);
        this.ruchersObs.subscribe(
            (data)=>{
                console.log(data);
                this.rucher = data[data.length-1];
                this.rucherSelectUpdate = data[data.length-1];
                this.ruchers = data;
                console.log(this.rucherSelectUpdate);
            },
            (err)=>{
                console.log(err);   
            },
            ()=>{
                this.observationService.getObservationByIdApiary(this.rucher.id);
                this.rucheService.getRucheByApiary(this.user.currentUser().username,this.rucher.id);
                this.getRucherDetails();
                this.dailyRec.getDailyRecThByApiary(this.rucher.id);
            }
        );
    }

    getRucherDetails(){
        this.rucherObs = this.http.get<RucherModel>(CONFIG.URL+'apiaries/details/'+this.rucher.id);
        this.rucherObs.subscribe(
            (data)=>{
                this.detailsRucher = data;
            },
            (err)=>{
                console.log(err);
            }
        );

    }  

    updateRucher() {
        this.rucherObs = this.http.put<RucherModel>(CONFIG.URL+'apiaries/update/' + this.detailsRucher.id, this.detailsRucher, httpOptions);
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
    deleteRucher() {
        this.rucherObs = this.http.delete<RucherModel>(CONFIG.URL+'apiaries/' + this.rucher.id);
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

    getObservation(idApiary) {
        //return this.http.get<ProcessReport[]>(CONFIG.URL+'report/apiary/'+idApiary);
    }
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    
}