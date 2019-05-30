import { Injectable } from '@angular/core';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class GraphGlobal {
    public weight: any;

    public temp: any;

    constructor(private userConfig: UserParamsService) {
        this.weight = {
            name: '',
            min: null,
            max: 0,
            interval : 0
        };
        this.temp = {
            name: '',
            min: null,
            max: 0
        };
        if (this.userConfig.getUserPref().unitSystem === 'IMPERIAL') { // FR
            this.weight.name = 'Weight lbs';
            this.weight.min = 40;
            this.weight.max = null;
            this.weight.interval = 5;
            this.temp.name = 'Temperature (°F)';
            this.temp.min = 0;
            this.temp.max = null;

        } else { // US
            this.weight.name = 'Weight Kg';
            this.weight.min = 0;
            this.weight.interval = 10;
            this.weight.max = null;
            this.temp.name = 'Temperature (°C)';
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

}