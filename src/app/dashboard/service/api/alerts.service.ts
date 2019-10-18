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

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertInterface } from '../../../_model/alert';
import { CONFIG } from '../../../../constants/config';
import { Observable, BehaviorSubject} from 'rxjs';
import { MyDate } from '../../../class/MyDate';
import { ALERTS_ICONS } from '../../melli-charts/charts/icons/icons_alerts';
import { AlertUser } from '../../../_model/alertUser';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AlertsService {

    // alerts by apiary
    public apiaryAlerts: AlertInterface[];
    public apiaryAlertsFirstHalf: AlertInterface[];
    public apiaryAlertsSecondHalf: AlertInterface[];
    public alertSubject: BehaviorSubject<AlertInterface[]>;
    // alerts by hive
    public hiveAlerts: AlertInterface[];
    // alerts actives by apiary
    public numberApiaryAlertsActives : number;
    // alerts actives for one apiary
    public apiaryAlertsActives : AlertInterface[];
    // Hive alerts by apiay
    public hiveAlertsByApiary : AlertInterface[];

    // Map pictos in SVG Path
    public mapPictoSvg : Map<string,Array<any>>;

    // Map color for alert type
    public mapTypeColor : Map<string,string>;

    // Alerts by id hive for one apiary
    public alertsByHiveByApiary : Map<string,AlertInterface[]>;

    constructor(private http: HttpClient) {
        this.alertSubject = new BehaviorSubject([]);
        this.hiveAlerts = [];
        this.apiaryAlerts = [];

        this.mapPictoSvg = new Map();
        this.mapTypeColor = new Map();
        this.alertsByHiveByApiary = new Map();
        this.mapPictoSvg.set('Hot', ALERTS_ICONS.Hot);
        this.mapPictoSvg.set('Rain', ALERTS_ICONS.Rain);
        this.mapPictoSvg.set('Wind', ALERTS_ICONS.Wind);
        this.mapPictoSvg.set('LowBattery', ALERTS_ICONS.LowBattery);
        this.mapPictoSvg.set('Hmax', ALERTS_ICONS.Hmax);
        this.mapPictoSvg.set('Cold', ALERTS_ICONS.Cold);
        this.mapPictoSvg.set('Snow', ALERTS_ICONS.Snow);
        this.mapPictoSvg.set('Swarm', ALERTS_ICONS.Swarm);
        this.mapPictoSvg.set('Honeydew', ALERTS_ICONS.Honeydew);
        this.mapPictoSvg.set('Hmin', ALERTS_ICONS.Hmin);
        this.mapPictoSvg.set('Tmin', ALERTS_ICONS.Tmin);
        this.mapPictoSvg.set('Tmax', ALERTS_ICONS.Tmax);
        this.mapPictoSvg.set('LowBrood', ALERTS_ICONS.LowBrood);
        this.mapPictoSvg.set('BVar', ALERTS_ICONS.BVar);
        this.mapPictoSvg.set('NewBrood', ALERTS_ICONS.NewBrood);
        this.mapPictoSvg.set('StopBrood', ALERTS_ICONS.StopBrood);
        this.mapPictoSvg.set('Queen', ALERTS_ICONS.Queen);
        this.mapPictoSvg.set('NewLaying', ALERTS_ICONS.NewLaying);
        this.mapPictoSvg.set('Rain3', ALERTS_ICONS.Rain3);
        this.mapPictoSvg.set('RainT3', ALERTS_ICONS.RainT3);
        this.mapPictoSvg.set('Snow3', ALERTS_ICONS.Snow3);
        this.mapPictoSvg.set('StopLaying', ALERTS_ICONS.StopLaying);
        this.mapPictoSvg.set('Storm', ALERTS_ICONS.Storm);
        this.mapPictoSvg.set('Wind3', ALERTS_ICONS.Wind3);
        this.mapPictoSvg.set('ColdPeriod2', ALERTS_ICONS.ColdPeriod2);
        this.mapPictoSvg.set('ColdPeriod1', ALERTS_ICONS.ColdPeriod1);
        this.mapPictoSvg.set('WIneg', ALERTS_ICONS.WIneg);
        this.mapPictoSvg.set('WIpos', ALERTS_ICONS.WIpos);
        this.mapPictoSvg.set('Rswarm', ALERTS_ICONS.Rswarm);
        this.mapPictoSvg.set('DConnect', ALERTS_ICONS.DConnect);
        this.mapPictoSvg.set('Prod', []);
        
        this.mapTypeColor.set('Error','black');
        this.mapTypeColor.set('Hot','black');
        this.mapTypeColor.set('Cold','black');
        this.mapTypeColor.set('Wind','black');
        this.mapTypeColor.set('Rain','black');
        this.mapTypeColor.set('Snow','black');
        this.mapTypeColor.set('Swarm','black');
        this.mapTypeColor.set('Honeydew','black');
        this.mapTypeColor.set('Harvest','black');
        this.mapTypeColor.set('LowBattery','black');
        this.mapTypeColor.set('WIncVar','black');
        this.mapTypeColor.set('Wdelta','black');
        this.mapTypeColor.set('WVar','black');
        this.mapTypeColor.set('Hmax','black');
        this.mapTypeColor.set('Hmin','black');
        this.mapTypeColor.set('TVarHour','black');
        this.mapTypeColor.set('HVarDay','black');
        this.mapTypeColor.set('TVarDay','blue');
        this.mapTypeColor.set('HVarHour','black');
        this.mapTypeColor.set('Tdelta','black');
        this.mapTypeColor.set('Tmin','black');
        this.mapTypeColor.set('Tmax','black');
        this.mapTypeColor.set('LowBrood','black');
        this.mapTypeColor.set('BVar','black');
        this.mapTypeColor.set('NewBrood','black');
        this.mapTypeColor.set('NewLaying','black');
        this.mapTypeColor.set('Queen','black');
        this.mapTypeColor.set('Rain3','black');
        this.mapTypeColor.set('Rain6','black');
        this.mapTypeColor.set('RainT3','black');
        this.mapTypeColor.set('Rswarm','black');
        this.mapTypeColor.set('Snow3','black');
        this.mapTypeColor.set('StopBrood','black');
        this.mapTypeColor.set('StopLaying','black');
        this.mapTypeColor.set('Storm','black');
        this.mapTypeColor.set('Wind3','black');
        this.mapTypeColor.set('ColdPeriod1','black');
        this.mapTypeColor.set('ColdPeriod2','black');
        this.mapTypeColor.set('WIneg','black');
        this.mapTypeColor.set('WIpos','black');
        this.mapTypeColor.set('DConnect','black');
        this.mapTypeColor.set('Prod','black');

        }


    // Fonction to add pictos to alerts
    addPictoAlerts(listAlerts : AlertInterface[]) : AlertInterface[]{
        var i:number;

        // Add the right picto for all alerts.
        for(i = 0; i < listAlerts.length; i++){
            listAlerts[i].picto = "./assets/pictos_alerts/iconesPNG/"+listAlerts[i].type+".png";
        }
        return listAlerts;
    }

    // Fonction to get all alerts for one apiary
    getAlertsByApiary(idApiary : string){
        // the format is AlertInterface[]
        this.http.get<AlertInterface[]>(CONFIG.URL + 'alertSend/apiary/' + idApiary).map(elt => {
            return elt.sort((b, a) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }).filter(_elt => new Date(MyDate.getWekitDate(_elt.date.toString())).getMonth() >= new Date().getMonth() - 2);
        }).subscribe(
            (data) => {
                // add pictos to alerts
                data = this.addPictoAlerts(data);
                // save the number of actives alerts
                this.numberApiaryAlertsActives = data.filter(alert => alert.check === false).length;
              },
              (err) => {
                console.log(err);
              },
              () => {
              }
        );
    }

    // Fonction to get all alerts for one apiary
    getAlertsByApiaryObs(idApiary : string){
        // the format is AlertInterface[]
        return this.http.get<AlertInterface[]>(CONFIG.URL + 'alertSend/apiary/' + idApiary).map(elt => {
            return elt.sort((b, a) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }).filter(_elt => new Date(MyDate.getWekitDate(_elt.date.toString())).getMonth() >= new Date().getMonth() - 2);
        });
    }

    // Fonction to get all alerts for one hive
    getAlertsByHive(idHive : string){
        // the format is AlertInterface[]
       return this.http.get<AlertInterface[]>(CONFIG.URL + 'alertSend/hive/' + idHive).map(elt => {
            return elt.sort((b, a) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }).filter(_elt => new Date(MyDate.getWekitDate(_elt.date.toString())).getMonth() >= new Date().getMonth() - 2);
        });

    }

    /**
     *
     *
     * @param {string} idHive
     * @param {Date[]} range
     * @returns {Observable<AlertInterface[]>}
     * @memberof AlertsService
     */
    getAlertByHiveMelliCharts(idHive: string, range: Date[]): Observable<AlertInterface[]> {
        return this.http.post<AlertInterface[]>(CONFIG.URL + 'alertSend/between/hive/' + idHive, range);
    }

    /**
     *
     *
     * @returns {Observable<{_id: string, type: string}[]>}
     * @memberof AlertsService
     */
    getAllTypeAlerts(): Observable<{_id: string, type: string}[]> {
        return this.http.get<{_id: string, type: string}[]>(CONFIG.URL + 'alerts/all');
    }

    getAlertConfByUser(userId: string): Observable<AlertUser> {
        return this.http.get<AlertUser>(CONFIG.URL + 'alertsConf/' + userId);
    }

    // Fonction to get all hives alerts for one apiary
    getAllHiveAlertsByApiary(idApiary : string){
        // the format is AlertInterface[]
        this.http.get<AlertInterface[]>(CONFIG.URL + 'alertSend/apiary/hiveAllert/' + idApiary).map(elt => {
            return elt.sort((b, a) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }).filter(_elt => new Date(MyDate.getWekitDate(_elt.date.toString())).getMonth() >= new Date().getMonth() - 2);
        }).subscribe(
            (data) => {
                // add pictos to alerts
                data = this.addPictoAlerts(data);
                // save the alerts since one week
                // let oldDate = new Date();
                // oldDate.setDate(oldDate.getDate() - 7);
                // this.hiveAlertsByApiary = data.filter(alert => new Date(alert.date).getTime() > oldDate.getTime());
                // save the alerts
                this.hiveAlertsByApiary = data;
                // save the actives alerts
                this.apiaryAlertsActives = data.filter(alert => alert.check === false);
                // the format is Alerts by id hive for one apiary Map<idHive,AlertInterface[]>;
                data.forEach(_alert => {
                    if (!this.alertsByHiveByApiary.has(_alert.idHive)) {
                        this.alertsByHiveByApiary.set(_alert.idHive, data.filter(_filter => _filter.idHive === _alert.idHive));
                    };
                });
              },
              (err) => {
                console.log(err);
              },
              () => {
              }
        );

    }

    // Fonction to check/uncheck an alert
    updateAlert(idAlert : string , boolean : boolean): Observable<AlertInterface>{
        return this.http.put<AlertInterface>(CONFIG.URL + 'alertSend/update/' + idAlert , boolean, httpOptions);
    }

    // Here there are all the alerts pictos
    getPicto(nomPicto: string, cellPoint: Array<number>): Array<Object> {
        try {
            return this.mapPictoSvg.get(nomPicto).map(_alert => {
                return {
                    type: 'path',
                    scale: _alert.scale,
                    shape: {
                        pathData: _alert.path,
                    },
                    position: [cellPoint[0] + _alert.position[0], cellPoint[1] + _alert.position[1]],
                    style: _alert.style
                };
            });
        }
        catch{
        }
    }

    getColor(typeAlert : string) : string {
        return (this.mapTypeColor.get(typeAlert));
    }

}