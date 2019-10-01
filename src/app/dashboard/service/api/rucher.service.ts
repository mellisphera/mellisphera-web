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
import { Observable } from 'rxjs';
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
    rucherSubject: BehaviorSubject<RucherModel[]>;
    constructor(private http: HttpClient,
        private user: UserloggedService,
        public rucheService: RucheService,
        private loadingService: LoadingService,
        private tokenService: AtokenStorageService) {
        this.rucherSubject = new BehaviorSubject([]);
        this.allApiaryAccount = [];
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

    saveCurrentApiaryId(idApiary: string) {
        window.sessionStorage.removeItem('currentApiary');
        window.sessionStorage.setItem('currentApiary', idApiary);
        this.sharingApiary = this.ruchers.filter(hive => hive.userId !== this.user.getIdUserLoged());
    }

    getSharingApiary(): RucherModel[] {
        return this.sharingApiary;
    }

    /**
     *
     * @returns {string} idApiary
     * @memberof RucherService
     */
    getCurrentApiary(): string {
        return window.sessionStorage.getItem('currentApiary');
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

    /**
     *
     *
     * @memberof RucherService
     */
    saveSharingApiary(): void {
        if (this.sharingApiary.length > 0) {
            window.sessionStorage.setItem('sharingApiary', JSON.stringify(this.sharingApiary.map(elt => elt._id)));
        }
    }

    getApiaryByUser(username: string) {
        this.loadingService.loading = true;
        const ObservableApiaryQuery = [
            this.getSharingApiaryByUser(this.user.getIdUserLoged()), 
            this.http.get<RucherModel[]>(CONFIG.URL + 'apiaries/' + username)];
        Observable.forkJoin(ObservableApiaryQuery).map(elt => {
            return elt.filter(_filter => _filter != null);
        }).subscribe(
            (apiary) => {
                this.ruchers = apiary.flat().filter(apiary => apiary !== null && apiary.userId === this.user.getIdUserLoged());
                this.sharingApiary = apiary.flat().filter(apiary => apiary.userId !== this.user.getIdUserLoged());
                this.allApiaryAccount = apiary.flat().sort((a, b) => {
                    return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
                });
                this.saveSharingApiary();
                this.rucherSubject.next(this.ruchers);
            },
            (err) => {
                console.log(err);
            }, () => {
                this.afterRequestApiary();
                this.currentBackground = this.rucher.photo;
                this.rucherSubject.complete();
                this.loadingService.loading = false;
            }
        )
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
    deleteRucher(apiary: RucherModel): Observable<RucherModel> {
        return this.http.delete<RucherModel>(CONFIG.URL + 'apiaries/' + apiary._id);
    }
    updateBackgroundApiary(idApiary: string) {
        this.http.put(CONFIG.URL + 'apiaries/update/background/' + idApiary, this.rucher.photo).subscribe(
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
     * @param {string} idApiary
     * @param {*} [next]
     * @memberof RucherService
     */
    findRucherById(idApiary: string, next?) {
        next(this.allApiaryAccount.filter(apiary => apiary._id === idApiary));
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

    getRucherNameById(idApiary: string) : RucherModel{
        return (this.ruchers.filter(apiary => apiary._id === idApiary)[0]);
    }


}
