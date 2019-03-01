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
  ruchesAllApiary: RucheInterface[];

  hiveSubject: BehaviorSubject<RucheInterface[]>;
  rucheObs: Observable<RucheInterface>;
  ruchesObs: Observable<RucheInterface[]>;


  constructor(private user: UserloggedService,
    private http: HttpClient,
    private observationService: ObservationService,
    public meteoService: MeteoService) {
    this.ruches = [];
    this.initRuche();
    this.hiveSubject = new BehaviorSubject<RucheInterface[]>([]);
    if (this.user.getUser()) {
      this.getRucheByUsername(this.user.getUser());

    }
   }
   initRuche() {
    this.ruche = {
      id : null,
      name : '',
      description : '',
      username : '',
      idApiary: '',
      hivePosX : '',
      hivePosY : '',
      sharingUser : []
    };
    this.rucheUpdate = this.ruche;
    this.ruches = [];
   }
   emitHiveSubject() {
    this.hiveSubject.next(this.ruches.slice());
    console.log(this.hiveSubject);
  }

   getRucheByApiary(idApiary: string){
      this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/username/' + idApiary);
      this.ruchesObs.subscribe(
        (data) => {
          this.ruches = data;
          this.hiveSubject.next(data);
        },
        (err) => {
          console.log(err);
        },
        () => {
          if (!this.getCurrentHive()) {
            this.ruche = this.ruches[0];
          } else {
            this.ruche = this.ruches.filter(hive => hive.id === this.getCurrentHive())[0];
            if (this.ruche === undefined) {
              this.ruche = this.ruches[0];
            }
            console.log(this.ruche);
          }
          this.hiveSubject.complete();
        }
      );
   }

   saveCurrentHive(idHive?: string) {
     if (idHive) {
      window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', idHive);
     } else {
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
      () => {
        this.getRucheByApiary(ruche.idApiary);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateRuche(index: number, hive: RucheInterface): Observable<RucheInterface> {
    return this.http.put<RucheInterface>(CONFIG.URL + 'hives/update/' + hive.id, hive, httpOptions);
  }
  cleanRuches(){
     this.ruches=[];
  }

  createRuche(ruche: RucheInterface): Observable<RucheInterface> {
    return this.http.post<RucheInterface>(CONFIG.URL + 'hives', ruche , httpOptions);
  }

  deleteRuche(index: number, hive: RucheInterface): Observable<RucheInterface> {
    return this.http.delete<RucheInterface>(CONFIG.URL + 'hives/' + hive.id);
  }

  findRucheById(idHive: string, next?) {
    next(this.ruches.filter(hive => hive.id === idHive));
  }
}
