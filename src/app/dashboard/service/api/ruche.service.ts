/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
import { Observable } from 'rxjs';
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
    private http: HttpClient, ) {
    this.ruches = [];
    this.initRuche();
    this.hiveSubject = new BehaviorSubject<RucheInterface[]>([]);
    if (this.user.getUser()) {
      //this.callHiveRequest();
      // this.getHiveByUserId(this.user.getUser());

    }
  }
  callHiveRequest() {
    this.getHiveByUserId(this.user.getIdUserLoged()).subscribe(
      _hives => {
        this.ruchesAllApiary = _hives;
        this.hiveSubject.next(this.ruchesAllApiary);
      },
      () => { },
      () => {
        if (!this.getCurrentHive()) {
          this.ruche = this.ruchesAllApiary[0];
        } else {
          this.ruche = this.ruchesAllApiary.filter(hive => hive._id === this.getCurrentHive()._id)[0];
          if (this.ruche === undefined) {
            this.ruche = this.ruchesAllApiary[0];
          }
        }
        this.hiveSubject.complete();
      }
    )
  }
  initRuche() {
    this.ruche = {
      _id: '',
      name: '',
      description: '',
      userId: '',
      username: '',
      apiaryId: '',
      dataLastReceived: null,
      hidden: false,
      createDate: null,
      apiaryName: '',
      hivePosX: '',
      hivePosY: '',
      color: null,
      sharingUser: []
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
   * @param {string} apiaryId
   * @memberof RucheService
   * @description Ne renvoie pas d'observable attribut les données au objets
   */
  loadHiveByApiary(apiaryId: string): void {
    this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/username/' + apiaryId);
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
          this.ruche = this.ruches.filter(hive => hive._id === this.getCurrentHive()._id)[0];
          if (this.ruche === undefined) {
            this.ruche = this.ruches[0];
          }
        }
        this.hiveSubject.complete();
      }
    );
  }

  getHivesByApiaryId(apiaryId: string): RucheInterface[] {
    try {
      return this.ruchesAllApiary.filter(_hives => _hives.apiaryId === apiaryId)
        .sort((hiveA: RucheInterface, hiveB: RucheInterface) => {
          return hiveA.name.localeCompare(hiveB.name);
        });
    } catch { }

  }


  getHivesIdsByApiaryId(apiaryId: string): Array<string>{
    return this.ruchesAllApiary.filter(_hives => _hives.apiaryId === apiaryId).map(_hives => _hives._id);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @returns {Observable<RucheInterface[]>}
   * @memberof RucheService
   */
  getHivesByApiary(apiaryId: string): Observable<RucheInterface[]> {
    return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/username/' + apiaryId);
  }

  /**
   *
   *
   * @param {string} [hiveId]
   * @memberof RucheService
   */
  saveCurrentHive(hive?: RucheInterface | Object) {
    if (hive) {
      // window.localStorage.removeItem('currentHive');
      window.localStorage.setItem('currentHive', JSON.stringify(hive));
    } else {
      window.localStorage.removeItem('currentHive');
      window.localStorage.setItem('currentHive', JSON.stringify(this.ruche));
    }
  }

  /**
   *
   *
   * @returns {RucheInterface}
   * @memberof RucheService
   */
  getCurrentHive(): RucheInterface {
    try{
      return JSON.parse(window.localStorage.getItem('currentHive'));
    } catch {}
  }


  /**
   *
   *
   * @returns {RucheInterface[]}
   * @memberof RucheService
   * @description without hives shared
   */
  getUserHive(): RucheInterface[] {
    return this.ruches.filter(hive => hive.userId === this.user.getIdUserLoged());
  }


  /**
   *
   *
   * @param {string} username
   * @returns {Observable<RucheInterface[]>}
   * @memberof RucheService
   */
  getHiveByUserId(userId: string): Observable<RucheInterface[]> {
    return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/' + userId);
  }


  getRucheByID(id: string) {
    return this.http.get<RucheInterface[]>(CONFIG.URL + 'hives/' + id);
  }


  getHiveByHiveId(hiveId: string): Observable<RucheInterface>{
    return this.http.get<RucheInterface>(CONFIG.URL + 'hives/hiveId/' + hiveId);
  }


  updateCoordonneesRuche(ruche: RucheInterface) {
    return this.http.put<RucheInterface>(CONFIG.URL + 'hives/update/coordonnees/' + ruche._id, ruche, httpOptions);
  }

  /**
   * @param {number} index
   * @param {RucheInterface} hive
   * @returns {Observable<RucheInterface>}
   * @memberof RucheService
   */
  updateRuche(hive: RucheInterface): Observable<RucheInterface> {
    return this.http.put<RucheInterface>(CONFIG.URL + 'hives/update/' + hive._id, hive, httpOptions);
  }

  /**
   *
   *
   * @param {RucheInterface} ruche
   * @returns {Observable<RucheInterface>}
   * @memberof RucheService
   */
  createRuche(ruche: RucheInterface): Observable<RucheInterface> {
    return this.http.post<RucheInterface>(CONFIG.URL + 'hives', ruche, httpOptions);
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
    return this.http.delete<RucheInterface>(CONFIG.URL + 'hives/' + hive._id);
  }



  /**
   *
   *
   * @param {string} hiveId
   * @param {Function} next
   * @param {Function} error
   * @memberof RucheService
   */
  findRucheById(hiveId: string, next: Function, error: Function) {
    if (this.ruches.filter(hive => hive._id === hiveId).length > 0) {
      next(this.ruches.filter(hive => hive._id === hiveId));

    } else {
      error('Not hive');
    }
  }

  getHiveById(hiveId: string): RucheInterface{
    return this.ruchesAllApiary.filter(hive => hive._id === hiveId)[0];
  }

  getRucheNameById(hiveId: string): RucheInterface{
    return this.ruchesAllApiary.filter(hive => hive._id === hiveId)[0];
  }

}
