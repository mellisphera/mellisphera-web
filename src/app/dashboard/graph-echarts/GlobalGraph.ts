import { Injectable } from '@angular/core';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { stringify } from 'querystring';

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

    constructor(private userConfig: UserParamsService) {
        this.weight = {
            name: '',
            min: null,
            max: 0,
            interval : 0,
            unitW: 'Kg'
        };
        this.temp = {
            name: '',
            min: null,
            max: 0,
            unitT: '° C',
        };
        if (this.userConfig.getUserPref().unitSystem === 'IMPERIAL') { // FR
            this.weight.name = 'Weight lbs';
            this.weight.min = 40;
            this.weight.max = null;
            this.weight.unitW = 'lbs';
            this.weight.interval = 5;
            this.temp.name = 'Temperature (°F)';
            this.temp.min = 0;
            this.temp.unitT = '° F';
            this.temp.max = null;

        } else { // US
            this.weight.name = 'Weight Kg';
            this.weight.min = 0;
            this.weight.unitW = 'Kg';
            this.weight.interval = 10;
            this.weight.max = null;
            this.temp.name = 'Temperature (°C)';
            this.temp.unitT = '° C';
            this.temp.min = 0;
            this.temp.max = null;
        }

    }

    getWeight(): Object {
        return this.weight;
    }

    getTemp(): Object {
        return this.temp;
    }

    getUnitBySerieName(serie: string): string {
        if (/Temp/g.test(serie)) {
            return this.temp.unitT;
        } else if (/Weight/g.test(serie)) {
            return this.weight.unitW;
        }
    }



}