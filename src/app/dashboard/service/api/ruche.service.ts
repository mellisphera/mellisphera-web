/**
 * @author mickael
 * @description Ensemble des requetes pour la gestion des ruches
 *
 */

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { UserloggedService } from '../../../userlogged.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/observable/forkJoin';
import { CONFIG } from '../../../../constants/config';
import { Observable} from 'rxjs';
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
    private http: HttpClient,) {
    this.ruches = [];
    this.initRuche();
    this.hiveSubject = new BehaviorSubject<RucheInterface[]>([]);
    if (this.user.getUser()) {
      // this.getHiveByUsername(this.user.getUser());

    }
   }
   initRuche() {
    this.ruche = {
      id : null,
      name : '',
      description : '',
      idUsername : '',
      username : '',
      idApiary: '',
      apiaryName: '',
      hivePosX : '',
      hivePosY : '',
      sharingUser : []
    };
    this.rucheUpdate = this.ruche;
    this.ruches = [];
   }

   emitHiveSubject() {
    this.hiveSubject.next(this.ruches.slice());
  }

  
  /**
   *
   *
   * @param {string} idApiary
   * @memberof RucheService
   * @description Ne renvoie pas d'observable attribut les données au objets
   */
  loadHiveByApiary(idApiary: string): void {
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
          /*
          *  Permet lors du refresh de sauvegerder la ruche sélectionné
          */
          if (!this.getCurrentHive()) {
            this.ruche = this.ruches[0];
          } else {
            this.ruche = this.ruches.filter(hive => hive.id === this.getCurrentHive().id)[0];
            if (this.ruche === undefined) {
              this.ruche = this.ruches[0];
            }
          }
          this.hiveSubject.complete();
        }
      );
   }

   /**
    *
    *
    * @param {string} idApiary
    * @returns {Observable<RucheInterface[]>}
    * @memberof RucheService
    */
   getHivesByApiary(idApiary: string): Observable<RucheInterface[]> {
     return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/username/' + idApiary);;
   }

   /**
    *
    *
    * @param {string} [idHive]
    * @memberof RucheService
    */
   saveCurrentHive(hive?: RucheInterface) {
     if (hive) {
      // window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', JSON.stringify(hive));
     } else {
      window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', JSON.stringify(this.ruche));
     }
   }

   /**
    *
    *
    * @returns {RucheInterface}
    * @memberof RucheService
    */
   getCurrentHive(): RucheInterface {
     return JSON.parse(window.sessionStorage.getItem('currentHive'));


   }

   
   /**
    *
    *
    * @returns {RucheInterface[]}
    * @memberof RucheService
    * @description without hives shared 
    */
   getUserHive(): RucheInterface[] {
    return this.ruches.filter(hive => hive.idUsername === this.user.getIdUserLoged());
   }


   /**
    *
    *
    * @param {string} username
    * @returns {Observable<RucheInterface[]>}
    * @memberof RucheService
    */
   getHiveByUsername(username: string): Observable<RucheInterface[]> {
     return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/' + username);
   }


   getAllHiveByAccount(username: string): Observable<RucheInterface[][]> {
     const obsAllHive: Observable<RucheInterface[]>[] = [this.getHiveByUsername(this.user.getUser())].concat(this.user.getSharingApiaryId().map(apiaryId => {
      return this.getHivesByApiary(apiaryId);
     }));
     return Observable.forkJoin(obsAllHive);
   }

   getRucheByID(id: string) {
    return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/' + id);
  }
   updateCoordonneesRuche(ruche){
    return this.http.put<RucheInterface>(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,ruche,httpOptions); 
  }

  /**
   * @param {number} index
   * @param {RucheInterface} hive
   * @returns {Observable<RucheInterface>}
   * @memberof RucheService
   */
  updateRuche(hive: RucheInterface): Observable<RucheInterface> {
    return this.http.put<RucheInterface>(CONFIG.URL + 'hives/update/' + hive.id, hive, httpOptions);
  }

  /**   
   *
   *
   * @param {RucheInterface} ruche
   * @returns {Observable<RucheInterface>}
   * @memberof RucheService
   */
  createRuche(ruche: RucheInterface): Observable<RucheInterface> {
    return this.http.post<RucheInterface>(CONFIG.URL + 'hives', ruche , httpOptions);
  }

  /**
   *
   *
   * @param {number} index
   * @param {RucheInterface} hive
   * @returns {Observable<RucheInterface>}
   * @memberof RucheService
   */
  deleteRuche(hive: RucheInterface): Observable<RucheInterface> {
    return this.http.delete<RucheInterface>(CONFIG.URL + 'hives/' + hive.id);
  }



  /**
   *
   *
   * @param {string} idHive
   * @param {Function} next
   * @param {Function} error
   * @memberof RucheService
   */
  findRucheById(idHive: string, next: Function, error: Function) {
    if (this.ruches.filter(hive => hive.id === idHive).length > 0) {
      next(this.ruches.filter(hive => hive.id === idHive));

    } else {
      error('Not hive');
    }
  }

}
