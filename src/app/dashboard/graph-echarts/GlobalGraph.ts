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
            max: 0
        };
        this.temp = {
            name: '',
            min: null,
            max: 0
        };
        if (this.userConfig.getUserPref().unitSystem === 'IMPERIAL') { // FR
            this.weight.name = 'Weight LD';
            this.weight.min = 50;
            this.weight.max = null;
            this.temp.name = 'Temperature (°F)';
            this.temp.min = 0;
            this.temp.max = null;
        } else { // US
            this.weight.name = 'Weight Kg';
            this.weight.min = 50;
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