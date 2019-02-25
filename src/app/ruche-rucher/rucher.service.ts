import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../config';
import { Rucher } from './rucher';
import { Ruche } from './ruche';
import { ProcessReport } from './processedReport';
import { UserloggedService } from '../userlogged.service';
import { RucheService } from '../accueil/Service/ruche.service';
import { DailyRecordService } from '../accueil/Service/dailyRecordService';
import { RucherModel } from '../_model/rucher-model';
import { Observation } from '../_model/observation';
import { ObservationService } from './ruche-detail/observation/service/observation.service';
import { MeteoService } from '../meteo/Service/MeteoService';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RucherService {
 
    rucher: RucherModel;
    ruchers: RucherModel[] = null;
    detailsRucher: RucherModel;
    rucherUpdate: RucherModel;
    rucherDemo: RucherModel;

    currentBackground: string;

    rucherSelectUpdate : RucherModel;
    rucherObs: Observable<RucherModel>;
    ruchersObs: Observable<RucherModel[]>;
    rucherSubject: BehaviorSubject<RucherModel[]>;
    constructor(private http:HttpClient, private user: UserloggedService, 
        public rucheService : RucheService, 
        private dailyRec: DailyRecordService,
        /*public observationService: ObservationService,*/
        public meteoService: MeteoService) {
        this.rucherSubject = new BehaviorSubject([]);
        if (this.user.getUser()) {
            this.getApiaryByUser(this.user.getUser());
        }
        this.initRuche();

    }
    initRuche(){
         this.rucher = {
            id : null,
            latitude: '',
            longitude: '',
            name: '',
            description : '',
            createdAt : null,
            photo : 'void',
            username : '',
            codePostal : '',
            ville : ''
         };
         this.rucherUpdate = this.rucher;
         this.detailsRucher = this.rucher;
         this.rucherSelectUpdate = this.rucher;
    }
    // -- RUCHER -- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER ---- RUCHER --
    // pour créer un rucher
    createRucher() {
        this.rucherObs = this.http.post<RucherModel>(CONFIG.URL + 'apiaries' , this.rucher);
        this.rucherObs.subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getApiaryByUser(this.user.getUser());
            }
        );
    }
    // pour afficher tout les ruchers de l'utilsateur connecté
    getCurrentRucher(){
        return window.sessionStorage.getItem('currentApiary');
    }
    saveCurrentApiaryId(idApiary : string){
        window.sessionStorage.removeItem('currentApiary');
        window.sessionStorage.setItem("currentApiary",idApiary);
    }

    getCurrentApiary(){
        return window.sessionStorage.getItem('currentApiary');
    }

    getApiaryByUser(username: string){
        this.ruchersObs = this.http.get<RucherModel[]>(CONFIG.URL+'apiaries/'+ username);
        this.ruchersObs.subscribe(
            (data) => {
                this.rucher = data[data.length - 1];
                this.ruchers = data;
                this.rucherSubject.next(data);

            },
            (err) => {
                console.log(err);
            },
            () => {
                this.currentBackground = this.rucher.photo;
                this.saveCurrentApiaryId(this.rucher.id);
                this.rucherSubject.complete();
                this.rucheService.getRucheByApiary(this.getCurrentApiary());
            }
        );
    }
    getOneApiaryById(idApiary){
        this.rucherObs = this.http.get<RucherModel>(CONFIG.URL+'apiaries/id/'+idApiary);
        this.rucherObs.subscribe(
            (data)=>{
              this.rucherDemo = data;
            },
            (err)=>{
              console.log(err);
            }
        )
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
                this.getApiaryByUser(this.user.getUser());
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
                this.getApiaryByUser(this.user.getUser());
            }
        );
    }
    updateBackgroundApiary(idApiary: string){
      this.http.put(CONFIG.URL + 'apiaries/update/background/' + idApiary, this.rucher.photo).subscribe(
          () => {},
          (err) => {
              console.log(err);
          },
          () => {
            this.currentBackground = this.rucher.photo;
          }
      );
    }
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    findRucherById(idApiary: string, next?){
        this.ruchers.forEach(element => {
            if (element.id === idApiary) {
                next(element);
            }
        });
    }

}