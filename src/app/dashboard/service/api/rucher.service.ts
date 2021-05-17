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
 * @description Ensemble des requetes pour la gestion de rucher
 * @export
 * @class RucherService
 */

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { UserloggedService } from '../../../userlogged.service';
import { RucheService } from './ruche.service';
import { DailyRecordService } from './dailyRecordService';
import { RucherModel } from '../../../_model/rucher-model';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { LoadingService } from '../loading.service';
import { SharingApiary } from '../../../_model/sharing-apiary';
import 'rxjs/add/observable/forkJoin';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class RucherService {

    rucher: RucherModel;
    ruchers: RucherModel[];
    rucherUpdate: RucherModel;
    private sharingApiary: RucherModel[];
    currentBackground: string;
    public allApiaryAccount: RucherModel[];
    rucherSelectUpdate: RucherModel;
    rucherObs: Observable<RucherModel>;
    ruchersObs: Observable<RucherModel[]>;
    apiarySub: Subscription;
    constructor(private http: HttpClient,
        private user: UserloggedService,
        public rucheService: RucheService,
        private loadingService: LoadingService,
        private tokenService: AtokenStorageService) {
        this.allApiaryAccount = [];
        this.initRucher();
        console.log("init rucher");
/*         if (this.user.getUser() && !this.tokenService.checkAuthorities('ROLE_ADMIN')) {
            this.getApiaryByUser(this.user.getJwtReponse().idUser);
        } */

    }

    initRucher() {
        this.rucher = {
            _id: null,
            userId: '',
            name: '',
            description: '',
            createDate: null,
            photo: '',
            username: '',
            zipCode: '',
            city: '',
            countryCode: '',
            privateApiary: false,
            dataLastReceived: null
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
        return this.http.post<RucherModel>(CONFIG.URL + 'apiaries', newApiary).map(apiary => apiary._id != null ? apiary : null);
    }

    saveCurrentApiaryId(apiaryId: string) {
        window.localStorage.removeItem('currentApiary');
        window.localStorage.setItem('currentApiary', apiaryId);
    }

    getSharingApiary(): RucherModel[] {
        return this.sharingApiary;
    }

    /**
     *
     * @returns {string} apiaryId
     * @memberof RucherService
     */
    getCurrentApiary(): string {
        return window.localStorage.getItem('currentApiary');
    }

    getUserApiary(): RucherModel[] {
        return this.ruchers.filter(apiary => apiary.userId === this.user.getIdUserLoged());
    }


    /**
     *
     *
     * @param {string} userId
     * @returns {Observable<SharingApiary>}
     * @memberof RucherService
     */
    getSharingApiaryByUser(userId: string): Observable<RucherModel[]> {
        return this.http.get<RucherModel[]>(CONFIG.URL + 'sharing/user/' + userId);
    }

    getApiariesByUserId(userid: string): Observable<RucherModel[]>{
        console.log('sending request apiaries');
        return this.http.get<RucherModel[]>(CONFIG.URL + 'apiaries/' + userid);
    }

    /**
     *
     *
     * @memberof RucherService
     */
    saveSharingApiary(): void {
        if (this.sharingApiary.length > 0) {
            window.localStorage.setItem('sharingApiary', JSON.stringify(this.sharingApiary.map(elt => elt._id)));
        }
    }

    getApiaryByUser(userId: string) {
        this.loadingService.loading = true;
        this.apiarySub = this.http.get<RucherModel[]>(CONFIG.URL + 'apiaries/' + userId).subscribe(
            (apiary) => {
                console.log(apiary);
                this.ruchers = apiary.filter(apiary => apiary !== null && apiary.userId === this.user.getIdUserLoged());
                console.log(this.ruchers);
                /* DELETE THIS LINE IF YOU WANT TO SHOW SHARED APIARIES */
                apiary = this.ruchers;
                /* */
                this.sharingApiary = apiary.filter(apiary => apiary.userId !== this.user.getIdUserLoged());
                console.log(this.sharingApiary);
                this.allApiaryAccount = apiary.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                this.saveSharingApiary();
            },
            (err) => {
                console.log(err);
            }, () => {
                this.afterRequestApiary();
                this.currentBackground = this.rucher.photo;
                this.loadingService.loading = false;
            }
        )
    }

    /**
     *
     *
     * @param {String} apiaryId
     * @param {RucherModel} apiaryUpdate
     * @returns {Observable<RucherModel>}
     * @memberof RucherService
     */
    updateRucher(apiaryId: String, apiaryUpdate: RucherModel): Observable<RucherModel> {
        return this.http.put<RucherModel>(CONFIG.URL + 'apiaries/update/' + apiaryId, apiaryUpdate, httpOptions);
    }
    /**
     *
     *
     * @returns {Observable<RucherModel>}
     * @memberof RucherService
     */
    deleteRucher(apiary: RucherModel): Observable<RucherModel> {
        return this.http.delete<RucherModel>(CONFIG.URL + 'apiaries/' + apiary._id);
    }
    updateBackgroundApiary(apiaryId: string) {
        this.http.put(CONFIG.URL + 'apiaries/update/background/' + apiaryId, this.rucher.photo).subscribe(
            () => { },
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
     * @param {string} apiaryId
     * @param {*} [next]
     * @memberof RucherService
     */
    findRucherById(apiaryId: string, next?) {
        next(this.allApiaryAccount.filter(apiary => apiary._id === apiaryId));
    }


    getApiaryByApiaryId(apiaryId: string): RucherModel{
        return this.allApiaryAccount.filter(apiary => apiary._id === apiaryId)[0];
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
    /**
     *
     *
     * @returns {boolean}
     * @memberof RucherService
     */
    checkIfSharingApiary(): boolean {
        return this.sharingApiary.length > 0;
    }


    /**
     *
     *
     * @memberof RucherService
     */
    afterRequestApiary(): void {
        if (this.checkIfApiary()) {
            if (!this.getCurrentApiary()) {
                this.rucher = this.ruchers[0];
                this.rucherSelectUpdate = this.rucher;
                this.saveCurrentApiaryId(this.rucher._id);
            } else {
                this.rucher = this.ruchers.filter(apiary => apiary._id === this.getCurrentApiary())[0];
                if (this.rucher === undefined) {
                    this.rucher = this.ruchers[0];
                    this.rucherSelectUpdate = this.rucher;
                    this.saveCurrentApiaryId(this.rucher._id);
                }
            }
        } else {
            if (this.checkIfSharingApiary()) {
                this.rucher = this.sharingApiary[0];
                this.saveCurrentApiaryId(this.rucher._id);

            }
        }
        this.rucheService.loadHiveByApiary(this.getCurrentApiary());
    }

    getRucherNameById(apiaryId: string) : RucherModel{
        return (this.ruchers.filter(apiary => apiary._id === apiaryId)[0]);
    }



}
