/**
 * @author mickael
 * @description Ensemble des requetes pour la gestion de rucher
 * @export
 * @class RucherService
 */

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../../config';
import { UserloggedService } from '../../userlogged.service';
import { RucheService } from './ruche.service';
import { DailyRecordService } from './dailyRecordService';
import { RucherModel } from '../../_model/rucher-model';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { LoadingService } from './loading.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class RucherService {
 
    rucher: RucherModel;
    ruchers: RucherModel[] = null;
    rucherUpdate: RucherModel;

    currentBackground: string;

    rucherSelectUpdate: RucherModel;
    rucherObs: Observable<RucherModel>;
    ruchersObs: Observable<RucherModel[]>;
    rucherSubject: BehaviorSubject<RucherModel[]>;
    constructor(private http: HttpClient,
        private user: UserloggedService,
        public rucheService: RucheService,
        private loadingService: LoadingService,
        private tokenService: AtokenStorageService) {
            this.rucherSubject = new BehaviorSubject([]);
            this.initRucher();
            if (this.user.getUser() && !this.tokenService.checkAuthorities('ROLE_ADMIN')) {
                this.getApiaryByUser(this.user.getUser());
            }

        }

    emitApiarySubject() {
        this.rucherSubject.next(this.ruchers.slice());
    }
    
    initRucher() {
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
         this.ruchers = [];
         this.rucherUpdate = this.rucher;
         this.rucherSelectUpdate = this.rucher;
    }

    /**
     * @param {RucherModel} rucher
    * @returns {Observable<any>}
    */
    createRucher(newApiary: RucherModel): Observable<RucherModel> {
        return this.http.post<RucherModel>(CONFIG.URL + 'apiaries' , newApiary).map(apiary => apiary.id != null ? apiary : null);
    }
    saveCurrentApiaryId(idApiary: string){
        window.sessionStorage.removeItem('currentApiary');
        window.sessionStorage.setItem('currentApiary', idApiary);
    }

    /**
     *
     * @returns {string} idApiary
     * @memberof RucherService
     */
    getCurrentApiary(): string {
        return window.sessionStorage.getItem('currentApiary');
    }

    getApiaryByUser(username: string) {
        this.loadingService.loading = true;
        this.ruchersObs = this.http.get<RucherModel[]>(CONFIG.URL + 'apiaries/' + username);
        this.ruchersObs.subscribe(
            (data) => {
                this.ruchers = data;
                this.rucherSubject.next(data);
            },
            (err) => {
                console.log(err);
            },
            () => {
                if (this.ruchers != null ) {
                    if (!this.getCurrentApiary()) {
                        this.rucher = this.ruchers[0];
                        this.saveCurrentApiaryId(this.rucher.id);
                    } else {
                        this.rucher = this.ruchers.filter(apiary => apiary.id === this.getCurrentApiary())[0];
                        if (this.rucher === undefined) {
                            this.rucher = this.ruchers[0];
                            this.saveCurrentApiaryId(this.rucher.id);
                        }
                    }
                    this.currentBackground = this.rucher.photo;
                    this.rucherSubject.complete();
                    this.rucheService.getRucheByApiary(this.getCurrentApiary());
                } else {
                }
                this.loadingService.loading = false;
            }
        );
    }

    /**
     *
     *
     * @param {String} idApiary
     * @param {RucherModel} apiaryUpdate
     * @returns {Observable<RucherModel>}
     * @memberof RucherService
     */
    updateRucher(idApiary: String, apiaryUpdate: RucherModel): Observable<RucherModel> {
        return this.http.put<RucherModel>(CONFIG.URL + 'apiaries/update/' + idApiary, apiaryUpdate, httpOptions);
    }
    /**
     *
     *
     * @returns {Observable<RucherModel>}
     * @memberof RucherService
     */
    deleteRucher(): Observable<RucherModel> {
        return this.http.delete<RucherModel>(CONFIG.URL + 'apiaries/' + this.rucher.id);
    }
    updateBackgroundApiary(idApiary: string) {
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
    /**
     *
     *
     * @param {string} idApiary
     * @param {*} [next]
     * @memberof RucherService
     */
    findRucherById(idApiary: string, next?) {
        next(this.ruchers.filter(apiary => apiary.id === idApiary));
    }

    /**
     *
     *
     * @returns {boolean}
     * @memberof RucherService
     */
    checkIfApiary(): boolean {
        return this.ruchers.length > 0;
    }

}