import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../config';
import { ProcessReport } from '../apiary/ruche-rucher/processedReport';
import { Rapport } from '../../_model/rapport';
import { UserloggedService } from '../../userlogged.service';
import { ObservationService } from '../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class RapportService {
    //rapport: any [] = [];
    rapport : Rapport;
    rapports : Rapport[];
    constructor(private http:HttpClient, public username : UserloggedService, private observationService : ObservationService) {
        this.rapport = {
            id:'',
            Lruche: [],
            date: '',
            idApiary: '',
            idLHive: [],
            nluScore: 0,
            sentence: '',
            type: '',
            username: ''
        };
    }
    
    //to save in processReportTemp
    getNluResult(texte, idApiary){
        let body = JSON.stringify({"texte":texte.texte,"idApiary":idApiary});
        //LOCAL
        //return this.http.post('***REMOVED***:5000/nlu/nluAnalyse',body, httpOptions);
        //SERVEUR
        this.http.post<Rapport>(CONFIG.API_PY+'/nlu/nluAnalyse',body, httpOptions).subscribe(
            (data)=>{
                console.log(data);
                this.rapport = data;
                console.log(this.rapport);
            },
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getRapportTemp(this.username.currentUser().username);
            }
        );
    }

    nluSave(rucher){
        this.http.get<ProcessReport[]>(CONFIG.URL+'report_temp/add/'+this.username.getUser()).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.observationService.getObservationByIdApiary(rucher.id);
            }
        )
    }

    getRapportTemp(username){
        this.http.get<Rapport[]>(CONFIG.URL+'report_temp/'+username).subscribe(
            (data)=>{
                this.rapports = data;
                console.log(this.rapports);
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    deleteObsTemp(rapport){
        console.log(rapport);
        this.http.delete(CONFIG.URL+'report_temp/delete/'+rapport.id).subscribe(
            ()=>{},
            (err)=>{
                console.log(err);
            },
            ()=>{
                this.getRapportTemp(this.username.getUser());
            }
        );
    }

    // error handling
    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message || "server error")
    }
    
}