/**
 * @author mickael
 * @description Ensemble des requetes pour la gestion des ruches
 *
 */

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RucheInterface } from '../../_model/ruche';
import { UserloggedService } from '../../userlogged.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../constants/config';
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
      // this.getRucheByUsername(this.user.getUser());

    }
   }
   initRuche() {
    this.ruche = {
      id : null,
      name : '',
      description : '',
      username : '',
      idApiary: '',
      idUsername: '',
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

   getRucheByApiary(idApiary: string) {
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
            this.ruche = this.ruches.filter(hive => hive.id === this.getCurrentHive())[0];
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
    * @param {string} [idHive]
    * @memberof RucheService
    */
   saveCurrentHive(idHive?: string) {
     if (idHive) {
      window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', idHive);
     } else {
      window.sessionStorage.removeItem('currentHive');
      window.sessionStorage.setItem('currentHive', this.ruche.id);
     }
   }

   /**
    *
    *
    * @returns {string}
    * @memberof RucheService
    */
   getCurrentHive(): string {
     return window.sessionStorage.getItem('currentHive');
   }


   /**
    *
    *
    * @param {string} username
    * @returns {Observable<RucheInterface[]>}
    * @memberof RucheService
    */
   getRucheByUsername(username: string): Observable<RucheInterface[]> {
     return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/' + username);
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
  updateRuche(index: number, hive: RucheInterface): Observable<RucheInterface> {
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
  deleteRuche(index: number, hive: RucheInterface): Observable<RucheInterface> {
    return this.http.delete<RucheInterface>(CONFIG.URL + 'hives/' + hive.id);
  }


  /**
   *
   *
   * @param {string} idHive
   * @param {Function} next
   * @memberof RucheService
   */
  findRucheById(idHive: string, next: Function) {
    next(this.ruches.filter(hive => hive.id === idHive));
  }
}
