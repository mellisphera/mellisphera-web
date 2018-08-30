import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { resolve } from 'dns';
import { reject } from 'q';

/*
    class dont les fonctions éxécute les requetes
*/
@Injectable()
export class Requete{
    urlRequete : string;
    city : string = 'Pau';
    private data : string[] = null;
    
    constructor(private httpClient :  HttpClient){}

    /*
        Exécute la requete     
    */
    getWeather(city: string){
        return this.httpClient.get<string[]>('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&appid=***REMOVED***');

    }
    getDataRequete(reponse : HttpResponse<Object>){
        return this.data;
    }
}