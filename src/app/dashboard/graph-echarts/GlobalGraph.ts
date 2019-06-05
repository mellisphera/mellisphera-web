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

    public titresFR : Array<any>;
    public titresEN : Array<any>;

    constructor(private userConfig: UserParamsService, private userService: UserloggedService) {
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
        if (this.userConfig.getUserPref().unitSystem === 'IMPERIAL') { // US
            // If he is French
            if(this.userService.getJwtReponse().country === "FR"){
                this.weight.name = 'Poids lbs';
            // EN
            }else{
                this.weight.name = 'Weight lbs';
            }
            this.weight.min = 40;
            this.weight.max = null;
            this.weight.unitW = 'lbs';
            this.weight.interval = 5;
            // If he is French
            if(this.userService.getJwtReponse().country === "FR"){
                this.temp.name = 'Température (°F)';
            // EN
            }else{
                this.temp.name = 'Temperature (°F)';
            }
            this.temp.min = 0;
            this.temp.unitT = '° F';
            this.temp.max = null;

        } else { // FR
            // If he is French
            if(this.userService.getJwtReponse().country === "FR"){
                this.weight.name = 'Poids kg';
            // EN
            }else{
                this.weight.name = 'Weight kg';
            }
            this.weight.min = 0;
            this.weight.unitW = 'Kg';
            this.weight.interval = 10;
            this.weight.max = null;
            // If he is French
            if(this.userService.getJwtReponse().country === "FR"){
                this.temp.name = 'Température (°C)';
            // EN
            }else{
                this.temp.name = 'Temperature (°C)';
            }
            this.temp.unitT = '° C';
            this.temp.min = 0;
            this.temp.max = null;
        }

        //Table of titles : 
        //FR
        this.titresFR = [
            {'graph' : 'reserveMiel', 'titre' : 'Stock de miel'},
            {'graph' : 'DailyWeightIncomes', 'titre' : 'Poids journaliés'},
            {'graph' : 'BroodDynamics', 'titre' : 'Dynamique du couvain'},
            {'graph' : 'InternalRelativeHumidity', 'titre' : 'Humidité interne relative (max)'},
            {'graph' : 'InternalTemperature', 'titre' : 'Température interne'},
            {'graph' : 'ExternalTemperature', 'titre' : 'Température externe'},
            {'graph' : 'WeightTemperature', 'titre' : 'Poids & Température'},
            {'graph' : 'Humidity', 'titre' : 'Humidité (%)'},
            {'graph' : 'loss', 'titre' : 'perte'},
            {'graph' : 'Weight', 'titre' : 'Poids'}
        ]

        // EN
        this.titresEN = [
            {'graph' : 'reserveMiel', 'titre' : 'Honey Stock'},
            {'graph' : 'DailyWeightIncomes', 'titre' : 'Daily weight incomes'},
            {'graph' : 'BroodDynamics', 'titre' : 'Brood Dynamics'},
            {'graph' : 'InternalRelativeHumidity', 'titre' : 'Internal Relative Humidity (max)'},
            {'graph' : 'InternalTemperature', 'titre' : 'Internal Temperature'},
            {'graph' : 'ExternalTemperature', 'titre' : 'External Temperature'},
            {'graph' : 'WeightTemperature', 'titre' : 'Weight & Temperature'},
            {'graph' : 'Humidity', 'titre' : 'Humidity (%)'},
            {'graph' : 'loss', 'titre' : 'loss'},
            {'graph' : 'Weight', 'titre' : 'Weight'}
        ]

    }

    getWeight(): Object {
        return this.weight;
    }

    getTemp(): Object {
        return this.temp;
    }

    // Here there are all the graph titles
    getTitle( nomGraphe : String) : any {
        var titre : any;

        //Found the title with the name of the graph with the right language

        // If he is French
        if(this.userService.getJwtReponse().country === "FR"){
            titre = this.titresFR[this.titresFR.map(elt => elt.graph).indexOf(nomGraphe)];
        // EN
        }else{
            titre = this.titresEN[this.titresEN.map(elt => elt.graph).indexOf(nomGraphe)];
        }

        return titre.titre;
    }

    getDays() : String[] {
        // If he is French
        if(this.userService.getJwtReponse().country === "FR"){
            return(['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa']);
        // EN
        }else{
            return(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
        }
    }

    getMonth() : String[] {
        // If he is French
        if(this.userService.getJwtReponse().country === "FR"){
            return(['Jan','Fev','Mar','Avr','Mai','Juin','Jui','Aou','Sep','Oct','Nov','Dec']);
        // EN
        }else{
            return(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);
        }
    }
    getUnitBySerieName(serie: string): string {
        if (/Temp/g.test(serie)) {
            return this.temp.unitT;
        } else if (/Weight/g.test(serie)) {
            return this.weight.unitW;
        }
    }
}