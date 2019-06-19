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
import { CONFIG } from '../../../constants/config';
import { Capteur } from './capteur';
import { Rucher } from '../apiary/ruche-rucher/rucher';
import { CapteurInterface } from '../../_model/capteur';
import { UserloggedService } from '../../userlogged.service';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class CapteurService {

    capteur: CapteurInterface;
    capteurs: CapteurInterface[];
    capteursByUser: CapteurInterface[];
    capteurAcheter: CapteurInterface[];
    capteursType: Object;
    capteurObs: Observable<CapteurInterface>;
    capteursObs: Observable<CapteurInterface[]>;
    public sensorSubject: BehaviorSubject<CapteurInterface[]>;
    /**
     *Creates an instance of CapteurService.
     * @param {HttpClient} http
     * @param {UserloggedService} user
     * @memberof CapteurService
     */
    constructor(private http: HttpClient, private user: UserloggedService) {
        this.sensorSubject = new BehaviorSubject([]);
        this.capteursType =
            [
                {'sensorRef' : '41', 'type' : 'T2'},
                {'sensorRef' : '42', 'type' : 'T_HR'},
                {'sensorRef' : '43', 'type' : 'WEIGHT'}

            ];
        this.initCapteur();
    }

    initCapteur() {
        this.capteur = {
            id : null,
            sensorRef: '',
            name : '',
            type : '' ,
            description : '',
            username: '',
            idHive: '',
            idApiary: '',
            hiveName: '',
            apiaryName: '',
            sensorBat: 0
        };
    }
    emitSensorSubject() {
        this.sensorSubject.next(this.capteursByUser.slice());
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
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL + 'sold_devices/username/' + this.user.getUser());
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
        this.capteursObs = this.http.get<CapteurInterface[]>(CONFIG.URL + 'sensors/' + this.user.getUser());
        this.capteursObs.subscribe(
            (data) => {
                this.capteursByUser = data;
                this.sensorSubject.next(data);
            },
            (err) => {
                console.log(err);
            },
            () => { this.sensorSubject.complete(); }
        );
    }

        /**
     *
     * Create capteurs
     * @returns {Observable<CapteurInterface>}
     * @param {CapteurInterface} capteur
     * @memberof CapteurService
     */
    deleteCapteur(capteur: CapteurInterface): Observable<CapteurInterface> {
        return this.http.delete<CapteurInterface>(CONFIG.URL + 'sensors/' + capteur.id);
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
}