import { Injectable } from '@angular/core';
import { RucheInterface } from '../../_model/ruche';
import { UserloggedService } from '../../userlogged.service';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { RucherService } from '../ruche-rucher/rucher.service';
import { Observable } from 'rxjs';
import { ObservationService } from '../ruche-rucher/ruche-detail/observation/service/observation.service';
import { MeteoService } from '../../meteo/Service/MeteoService';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RucheService {

  ruche : RucheInterface;
  ruches : RucheInterface[];

  rucheUpdate : RucheInterface;
  ruchesAllApiary : RucheInterface[];

  rucheObs : Observable<RucheInterface>;
  ruchesObs : Observable<RucheInterface[]>;
  constructor(private user : UserloggedService, private http : HttpClient, private observationService : ObservationService, public meteoService : MeteoService) {
    this.ruches = [];
    this.initRuche();
    this.getRucheByUsername(this.user.currentUser().username);  
   }
   initRuche(){
    this.ruche = { 
      id : null,
      name : '',
      description : '',
      username : '',
      idApiary: '',
      hivePosX : '',
      hivePosY : '',
      sharingUser : []
    }
    this.rucheUpdate = this.ruche;
   }
   getRucheByApiary(username , idApiary){
      this.ruches = [];
      this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL+'hives/'+username+'/'+idApiary)
      this.ruchesObs.subscribe(
        (data)=>{
          this.ruche = data[data.length-1];
          this.ruches = data;
        },
        (err)=>{
          console.log(err);
        },
        ()=>{
          if(this.ruches.length > 0){
            this.observationService.getObservationByIdApiary(idApiary);
          }
          
        }
        
      )
   }

   getRucheByUsername(username : string){
     this.ruchesAllApiary = [];
     this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL+'hives/'+username);
     this.ruchesObs.subscribe(
       (data)=>{
         this.ruchesAllApiary = data;
       },
       (err)=>{
         console.log(err);
       }
     );
   }
   updateCoordonneesRuche(ruche){
    this.rucheObs = this.http.put<RucheInterface>(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,ruche,httpOptions)
    this.rucheObs.subscribe(
      ()=>{
        this.getRucheByApiary(this.user.currentUser().username,ruche.idApiary);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  updateRuche(lastIdApiary : string) {
   this.rucheObs = this.http.put<RucheInterface>(CONFIG.URL+'hives/update/' + this.ruche.id, this.ruche, httpOptions);
   this.rucheObs.subscribe(
     ()=>{},
     (err)=>{
       console.log(err);
     },
     ()=>{
       this.getRucheByApiary(this.user.currentUser().username,lastIdApiary);
     }
   );
  }
  cleanRuches(){
     this.ruches=[];
  }

  createRuche(){
    this.rucheObs = this.http.post<RucheInterface>(CONFIG.URL+'hives', this.ruche , httpOptions);
    this.rucheObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.getRucheByApiary(this.user.currentUser().username,this.ruche.idApiary);
      }
    );
  }

  deleteRuche() {
    this.rucheObs = this.http.delete<RucheInterface>(CONFIG.URL+'hives/' + this.ruche.id);
    this.rucheObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.getRucheByApiary(this.user,this.ruche.idApiary);
      }
    );
  }

  findRucheById(idHive : string, navHive : boolean = false, callback?){
    this.ruches.forEach(element => {
      if(element.id == idHive){
        if(navHive){
          this.ruche = element
        }
        else if(!navHive){
          this.rucheUpdate = element;
        }
      }
    });
  }

}
