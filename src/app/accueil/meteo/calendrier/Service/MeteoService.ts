import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DailyWeather } from '../DailyWeather';
import { Meteo } from '../../../../_model/meteo';
import { RucherService } from '../../../ruche-rucher/rucher.service';
import { element } from 'protractor';
import { UserloggedService } from '../../../../userlogged.service';
import { Observable } from 'rxjs';

/*
    class dont les fonctions éxécute les requetes
*/
@Injectable()
export class MeteoService{

    private data : string[] = null;
    meteo : Meteo[] = null;
    firstMeteo  : Meteo[];
    meteoObs : Observable<Meteo[]>;
    arrayMeteo : any = [];
    constructor(private httpClient :  HttpClient, private login : UserloggedService){
        this.meteo = [];
    }

    getWeather(id : string ,city: string){
        this.arrayMeteo = [];
        this.meteoObs = this.httpClient.get<Meteo[]>('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&appid=110ff02ed24ccd819801248373c3b208');
        this.meteoObs.subscribe(
            (data)=>{
                var date = null;
                let premierElement = data['list'][0];
                this.meteo = [];
                this.meteo.push({date : this.convertDate(premierElement.dt_txt), icons : premierElement.weather[0].icon, tempMin : Math.round(premierElement.main.temp_min), tempMax : Math.round(premierElement.main.temp_max)});
                data['list'].forEach(element => {
                    let heure = new Date(element.dt_txt).getHours();
                    date = new Date(element.dt_txt);
                    if(heure  == 12 && date.getDate() != new Date().getDate()){
                        this.meteo.push({ date : this.convertDate(element.dt_txt), icons : element.weather[0].icon, tempMin : Math.round(element.main.temp_min), tempMax : Math.round(element.main.temp_max) });
                    }

                });
                console.log(this.meteo);
                this.getArray();
                //console.log(this.arrayMeteo);
            },
            (err)=>{
                console.log(err);
            },
            ()=>{
            }
        );
        console.log(this.meteo.length);
    }

    getDailyWeatherByIdApiary(idApiary){
        return this.httpClient.get<DailyWeather[]>('http://localhost:8091/apiary/'+idApiary);
    }

    convertDate(date : string){
        var dateIso = new Date(date);
        var jour = ''+dateIso.getDate();
        var mois = ''+(dateIso.getMonth()+1);
        var anee = dateIso.getFullYear();
        if(parseInt(jour) < 10 ){ jour = '0'+jour; }
        if(parseInt(mois) < 10 ){ mois = '0'+mois; }

        return anee + '-' +mois+'-'+ jour;
    }

    getArray(){
        this.meteo.forEach(element =>{
            this.arrayMeteo.push([element.date, element.icons, element.tempMax, element.tempMin]);
        });
    }
    //[element.date, element.icons, element.tempMax, element.tempMin])
}   
