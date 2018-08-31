import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { resolve } from 'dns';
import { reject } from 'q';
import { DailyWeather } from '../DailyWeather';

/*
    class dont les fonctions éxécute les requetes
*/
@Injectable()
export class Requete{
    urlRequete : string;
    private data : string[] = null;
    
    constructor(private httpClient :  HttpClient){}

    getWeather(city: string){
        return this.httpClient.get<string[]>('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&appid=110ff02ed24ccd819801248373c3b208');
    }

    getDailyWeatherByIdApiary(idApiary){
        return this.httpClient.get<DailyWeather[]>('http://localhost:8091/apiary/'+idApiary);
    }
    getDataRequete(reponse : HttpResponse<Object>){
        return this.data;
    }
}