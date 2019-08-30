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

import { Injectable } from '@angular/core';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { stringify } from 'querystring';
import { UserloggedService } from '../../userlogged.service';

@Injectable({
    providedIn: 'root'
})
export class GraphGlobal {
    public weight: {
        name: string,
        min: number,
        max: number,
        interval: number,
        unitW: string
    };

    public temp: {
        name: string,
        min: number,
        max: number,
        unitT: string,
    };
    public humidity: {
        name: string,
        min: number,
        max: number,
        unitT: string,
    };
    public rain: {
        name: string,
        min: number,
        max: number,
        unitT: string,
    };
    public brood: {
        name: string,
        min: number,
        max: number,
        unitT: string,
    }

    public titresFR: Array<any>;
    public titresEN: Array<any>;

    constructor(private userConfig: UserParamsService, public userService: UserloggedService) {
        this.weight = {
            name: '',
            min: null,
            max: 0,
            interval: 0,
            unitW: 'Kg'
        };
        this.temp = {
            name: '',
            min: null,
            max: 0,
            unitT: '° C',
        };
        this.humidity = {
            name: '',
            min: null,
            max: 0,
            unitT: '%',
        };
        this.brood = {
            name: '',
            min: null,
            max: 0,
            unitT: '%',
        };
        this.rain = {
            name: '',
            min: null,
            max: 0,
            unitT: '%',
        }
        if (this.userConfig.getUserPref().unitSystem === 'IMPERIAL') { // US
            this.setImperial();
        } else { // FR
            this.setMetric();
        }

        //Table of titles : 
        //FR
        this.titresFR = [
            { 'graph': 'reserveMiel', 'titre': 'Stock de miel' },
            { 'graph': 'DailyWeightIncomes', 'titre': 'Poids journaliers' },
            { 'graph': 'BroodDynamics', 'titre': 'Dynamique du couvain' },
            { 'graph': 'InternalRelativeHumidity', 'titre': 'Humidité interne relative (max)' },
            { 'graph': 'InternalTemperature', 'titre': 'Température interne' },
            { 'graph': 'ExternalTemperature', 'titre': 'Température externe' },
            { 'graph': 'WeightTemperature', 'titre': 'Poids & Température' },
            { 'graph': 'Humidity', 'titre': 'Humidité (%)' },
            { 'graph': 'loss', 'titre': 'perte' },
            { 'graph': 'Weight', 'titre': 'Poids' },
            { 'graph': 'AlertsHive', 'titre': 'Inspections et notifications' },
            { 'graph': 'AlertsApiary', 'titre': 'Inspections et notifications du rucher' },
            { 'graph': 'Blooming', 'titre': 'Calendrier de floraison du rucher' }
        ];

        // EN
        this.titresEN = [
            { 'graph': 'reserveMiel', 'titre': 'Honey Stock' },
            { 'graph': 'DailyWeightIncomes', 'titre': 'Daily weight change' },
            { 'graph': 'BroodDynamics', 'titre': 'Brood Dynamics' },
            { 'graph': 'InternalRelativeHumidity', 'titre': 'Internal Relative Humidity (max)' },
            { 'graph': 'InternalTemperature', 'titre': 'Internal Temperature' },
            { 'graph': 'ExternalTemperature', 'titre': 'External Temperature' },
            { 'graph': 'WeightTemperature', 'titre': 'Weight & Temperature' },
            { 'graph': 'Humidity', 'titre': 'Humidity (%)' },
            { 'graph': 'loss', 'titre': 'loss' },
            { 'graph': 'Weight', 'titre': 'Weight' },
            { 'graph': 'AlertsHive', 'titre': 'Inspections and notifications' },
            { 'graph': 'AlertsApiary', 'titre': 'Inspections and notifications for the apiary' },
            { 'graph': 'Blooming', 'titre': 'Apiary Blooming calendar' }
        ];
    }


    setImperial() {
        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            this.weight.name = 'Poids (lbs)';
            this.humidity.name = 'HUmidité (%)';
            this.rain.name = 'Pluie';
            this.brood.name = 'Couvain (%)';
            // EN
        } else {
            this.weight.name = 'Weight (lbs)';
            this.humidity.name = 'Humidity (%)';
            this.rain.name = 'Rain';
            this.brood.name = 'Brood (%)';
        }
        this.humidity.min = 0;
        this.rain.unitT = '″';
        this.humidity.max = 100;
        this.weight.min = 40;
        this.weight.max = null;
        this.humidity.unitT = '%';
        this.weight.unitW = 'lbs';
        this.weight.interval = 5;
        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            this.temp.name = 'Température (°F)';
            // EN
        } else {
            this.temp.name = 'Temperature (°F)';
        }
        this.temp.min = 0;
        this.temp.unitT = '° F';
        this.temp.max = null;
        console.log(this.weight);
    }

    setMetric() {
        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            this.weight.name = 'Poids (Kg)';
            this.humidity.name = 'HUmidité %';
            this.rain.name = 'Pluie';
            this.brood.name = 'Couvain (%)';

            // EN
        } else {
            this.weight.name = 'Weight (Kg)';
            this.humidity.name = 'Humidity %'
            this.rain.name = 'Rain'
            this.brood.name = 'Brood (%)';
        }
        this.humidity.name = 'Humidity %'
        this.rain.unitT = 'mm';
        this.humidity.min = 0;
        this.humidity.max = 100;
        this.weight.min = 0;
        this.humidity.unitT = '%';
        this.weight.unitW = 'Kg';
        this.weight.interval = 10;
        this.weight.max = null;
        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            this.temp.name = 'Température (°C)';
            // EN
        } else {
            this.temp.name = 'Temperature (°C)';
        }
        this.temp.unitT = '° C';
        this.temp.min = 0;
        this.temp.max = null;
    }
    /**
     *
     *
     * @returns {Object}
     * @memberof GraphGlobal
     */
    getWeight(): Object {
        return this.weight;
    }

    /**
     *
     *
     * @returns {Object}
     * @memberof GraphGlobal
     */
    getTemp(): Object {
        return this.temp;
    }

    // Here there are all the graph titles
    /**
     *
     *
     * @param {String} nomGraphe
     * @returns {string}
     * @memberof GraphGlobal
     */
    getTitle(nomGraphe: String): string {
        var titre: any;

        //Found the title with the name of the graph with the right language

        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            titre = this.titresFR[this.titresFR.map(elt => elt.graph).indexOf(nomGraphe)];
            // EN
        } else {
            titre = this.titresEN[this.titresEN.map(elt => elt.graph).indexOf(nomGraphe)];
        }

        return titre.titre;
    }

    /**
     *
     *
     * @returns {String[]}
     * @memberof GraphGlobal
     */
    getDays(): String[] {
        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            return ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
            // EN
        } else {
            return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        }
    }

    /**
     *
     *
     * @returns {String[]}
     * @memberof GraphGlobal
     */
    getMonth(): String[] {
        // If he is French
        if (this.userService.getJwtReponse().country === "FR") {
            return (['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec']);
            // EN
        } else {
            return (['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        }
    }

    /**
     *
     *
     * @param {number} value
     * @returns {(string | number)}
     * @memberof GraphGlobal
     */
    getNumberFormat(value: number): string | number {
        if (this.userService.getCountry() === 'FR') {
            return value.toString().replace(/\./g, ',');
        } else {
            return value;
        }
    }

    /**
     *
     *
     * @param {string} value
     * @returns {string}
     * @memberof GraphGlobal
     */
    getStringWeightFormat(value: string): string {
        if (this.userService.getCountry() === 'FR') {
            return value.replace(/\./g, ',');
        } else {
            return value;
        }
    }
    /**
     *
     *
     * @param {string} serie
     * @returns {string}
     * @memberof GraphGlobal
     */
    getUnitBySerieName(serie: string): string {
        if (/Temp/g.test(serie) || /Weather/g.test(serie)) {
            return this.temp.unitT;
        } else if (/Weight/g.test(serie) || /Poids/g.test(serie) || /gain/g.test(serie) || /loss/g.test(serie)) {
            return this.weight.unitW;
        } else if (/Hum/g.test(serie) || /Hint/g.test(serie) || /Brood/g.test(serie)) {
            return this.humidity.unitT;
        }
    }

    /**
     * 
     * @param typeGraph 
     */
    getNameZoneByGraph(typeGraph: string): string {
        if (typeGraph === 'BROOD') {
            if (this.userService.getCountry() === 'EN') {
                return 'Optimal area of ​​production';
            } else {
                return 'Zone optimale de production';
            }
        } else if (typeGraph === 'TEMP') {
            if (this.userService.getCountry() === 'FR') {
                return 'Zone optimale du couvain';
            } else {
                return 'Brood Zone';
            }
        } else if (typeGraph === 'HUM') {
            if (this.userService.getCountry() === 'EN') {
                return 'Optimal area of humidity';
            } else {
                return 'Zone optimale d\'humidié';
            }
        }
    }

    /**
     *
     *
     * @param {string} unitType
     * @returns
     * @memberof GraphGlobal
     * @description For MelliCharts
     */
    getUnitByType(unitType: string) {
        switch (unitType) {
            case 'T':
                return this.temp.unitT;
            case 'W':
                return this.weight.unitW;
            case 'P':
                return this.humidity.unitT;                
            case 'MM':
                return this.rain.unitT;
            default:
                break;
        }
    }
}