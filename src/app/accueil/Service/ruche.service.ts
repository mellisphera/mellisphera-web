import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RucheInterface } from '../../_model/ruche';
import { UserloggedService } from '../../userlogged.service';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { Observable, Subscription } from 'rxjs';
import { ObservationService } from '../../ruche-rucher/ruche-detail/observation/service/observation.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { share } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RucheService {

  ruche: RucheInterface;
  ruches: RucheInterface[];
  rucheUpdate: RucheInterface;
  ruchesAllApiary : RucheInterface[];

  hiveSubject : BehaviorSubject<RucheInterface[]>;
  rucheObs : Observable<RucheInterface>;  
  ruchesObs : Observable<RucheInterface[]>;


  constructor(private user : UserloggedService, private http : HttpClient, private observationService : ObservationService, public meteoService : MeteoService) {
    this.ruches = [];
    this.initRuche();
    this.hiveSubject = new BehaviorSubject<RucheInterface[]>([]);
    if (this.user.getUser()) {
      this.getRucheByUsername(this.user.getUser());
    }
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
    this.ruches = [];
   }
   emitHiveSubject() {
    this.hiveSubject.next(this.ruches.slice());
    console.log(this.hiveSubject);
  }

   getRucheByApiary(idApiary: string){
      this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL+ 'hives/username/' + idApiary);
      this.ruchesObs.subscribe(
        (data)=>{
          this.ruche = data[data.length - 1];
          this.ruches = data;
          this.hiveSubject.next(data);
          //this.saveCurrentHive();
        },
        (err)=>{
          console.log(err);
        },
        ()=>{
          console.log(this.hiveSubject);
          this.hiveSubject.complete();
          //this.observationService.getObservationByIdApiary(idApiary);
        }
      );
   }

   saveCurrentHive(idHive?: string) {
     if (idHive) {
      window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', idHive);
     }
     else {
      window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', this.ruche.id);
     }
   }
   getCurrentHive() {
     return window.sessionStorage.getItem('currentHive');
   }


   getRucheByUsername(username : string){
     this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL+'hives/'+username)
     this.ruchesObs.subscribe(
       (data)=>{
         this.ruchesAllApiary = data;
       },
       (err) => {
         console.log(err);
       },
       () => {
       }
     );
   }
   updateCoordonneesRuche(ruche){
    this.rucheObs = this.http.put<RucheInterface>(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,ruche,httpOptions)
    this.rucheObs.subscribe(
      ()=>{
        this.getRucheByApiary(ruche.idApiary);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  updateRuche(lastIdApiary : string,index: number) {
   this.rucheObs = this.http.put<RucheInterface>(CONFIG.URL+'hives/update/' + this.ruche.id, this.ruche, httpOptions);
   this.rucheObs.subscribe(
     ()=>{},
     (err)=>{
       console.log(err);
     },
     ()=>{
       this.ruches[index] = this.ruche;
       this.emitHiveSubject();
     }
   );
  }
  cleanRuches(){
     this.ruches=[];
  }

  createRuche() {
    this.http.post<RucheInterface>(CONFIG.URL+'hives', this.ruche , httpOptions).subscribe(
      () => {},
      (err) => {
        console.log(err);
      },
      () => {
        this.getRucheByApiary(this.ruche.idApiary);
      }
    );
  }

  deleteRuche(index) {
    this.rucheObs = this.http.delete<RucheInterface>(CONFIG.URL+'hives/' + this.ruche.id);
    this.rucheObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.ruches.splice(index,1);
        this.emitHiveSubject();
      }
    );
  }

  findRucheById(idHive: string, next?) {
    this.ruches.forEach(element => {
      if (element.id == idHive) {
        next(element);
      }
    });
  }

}
