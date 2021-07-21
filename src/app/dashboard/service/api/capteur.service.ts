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
 * @author Mickael
 * @description Ensemble des requetes à l'API pour la gestion des capteurs
 *
 * @export
 * @class CapteurService
 */

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../../../../constants/config';
import { CapteurInterface } from '../../../_model/capteur';
import { UserloggedService } from '../../../userlogged.service';
import { RucheService } from './ruche.service';
import { stringify } from 'querystring';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class CapteurService {

    capteur: CapteurInterface;
    capteurs: CapteurInterface[];
    public capteursByUser: CapteurInterface[];
    capteursByHive : CapteurInterface[];
    capteurAcheter: CapteurInterface[];
    capteursType: Object;
    capteurObs: Observable<CapteurInterface>;
    capteursObs: Observable<CapteurInterface[]>;
    /**
     *Creates an instance of CapteurService.
     * @param {HttpClient} http
     * @param {UserloggedService} user
     * @memberof CapteurService
     */
    constructor(private http: HttpClient, private user: UserloggedService,
        public rucheService: RucheService) {
        this.capteursType =
            [
                {'sensorRef' : '41', 'type' : 'T2'},
                {'sensorRef' : '42', 'type' : 'T_HR'},
                {'sensorRef' : '43', 'type' : 'WEIGHT'},
                {'sensorRef' : '47', 'type' : 'T2'},
                {'sensorRef' : '49', 'type' : 'WEIGHT'},
                {'sensorRef' : '56', 'type' : 'T_HR'},
                {'sensorRef' : '57', 'type' : 'WEIGHT'},
                {'sensorRef' : '58', 'type' : 'WEIGHT'},
            ];
        this.initCapteur();
        this.capteursByUser = [];
    }

    initCapteur() {
        this.capteur = {
            _id: null,
            sensorRef: '',
            name: '',
            model: '',
            type: '' ,
            hiveId: '',
            apiaryId: '',
            userId: '',
            dataLastReceived: null,
            deviceLocation: null,
            start: null,
            createDate: null,
            sensorTime: null,
            sensorBat: 0
        };
    }
    /**
     *
     * Create capteurs
     * @returns {Observable<CapteurInterface>}
     * @memberof CapteurService
     * @param {CapteurInterface} capteur
     */
    createCapteur(): Observable<CapteurInterface> {
        return this.http.post<CapteurInterface>(CONFIG.URL + 'sensors', this.capteur, httpOptions);
    }

    getCapteurs() {
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL + 'sensors/all');
        this.capteursObs.subscribe(
            (data)=>{
                this.capteurs = data;
                this.capteur = data[0];
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    getSoldDevicesByUser() {
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL + 'sold_devices/username/' + this.user.getJwtReponse().idUser);
        this.capteursObs.subscribe(
            (data) => {
                this.capteurAcheter = data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getUserCapteurs() {
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL + 'sensors/' + this.user.getJwtReponse().idUser);
        this.capteursObs.subscribe(
            (data) => {
                this.capteursByUser = data;
                this.capteursByHive = this.capteursByUser.filter(sensor => sensor.hiveId === this.rucheService.getCurrentHive()._id);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getCapteursByHive(hiveId : string) :  CapteurInterface[]{
        let capteursHive : CapteurInterface[];
        return this.capteursByUser.filter(sensor => sensor.hiveId === hiveId);
/*         let returnString : string[];
        returnString = [];
        capteursHive.forEach(element => {
            returnString.push(element.sensorRef);
        });
        return returnString; */
        // return capteursHive.map(elt => {
        //     return elt.sensorRef
        // }).join('\n');
    }

    getCapteurByRef(ref: string): CapteurInterface{
        return this.capteursByUser.filter(sensor => sensor.sensorRef === ref)[0];
    }

        /**
     *
     * Create capteurs
     * @returns {Observable<CapteurInterface>}
     * @param {CapteurInterface} capteur
     * @memberof CapteurService
     */
    deleteCapteur(capteur: CapteurInterface): Observable<CapteurInterface> {
        return this.http.delete<CapteurInterface>(CONFIG.URL + 'sensors/' + capteur._id);
    }
    /**
     *
     * @param {string} reference
     * @returns {Observable<Boolean>} Observable<Boolean>
     * @memberof CapteurService
     */
    checkSensorExist(reference: string): Observable<Boolean> {
        return this.http.get<CapteurInterface>(CONFIG.URL + 'sensors/check/' + reference)
        .map(res => res.sensorRef !== reference);
    }

    /**
     *
     * @returns {Observable<Boolean>} Observable<Boolean>
     * @memberof CapteurService
     */
    updateCapteur(): Observable<CapteurInterface> {
        return this.http.put<CapteurInterface>(CONFIG.URL + 'sensors/', this.capteur, httpOptions);
    }

    getCapteursByApiaryId(apiaryId): Observable<CapteurInterface[]>{
        return this.http.get<CapteurInterface[]>(CONFIG.URL + 'sensors/apiary/'+ apiaryId, httpOptions);
    }
}
