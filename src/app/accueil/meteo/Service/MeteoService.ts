import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meteo } from '../../../_model/meteo';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { element } from 'protractor';
import { UserloggedService } from '../../../userlogged.service';
import { Observable } from 'rxjs';
import { CalendrierService } from './calendrier.service';

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
    mergeOption : any = null;
    ville : string;
    status : boolean;
    constructor(private rucher : RucherService,  private celendrier : CalendrierService, private httpClient :  HttpClient, private login : UserloggedService){
        this.meteo = [];
        this.rucher.rucherObs.subscribe(
            ()=>{},
            ()=>{},
            ()=>{
                this.getWeather(this.rucher.rucher.ville);
            }

        )
    }

    getWeather(city: string){
        this.status = false;
        this.ville = city;
        this.arrayMeteo = [];
        this.meteoObs = this.httpClient.get<Meteo[]>('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&appid=***REMOVED***');
        this.meteoObs.subscribe(
            (data)=>{
                var date = null;
                let premierElement = data['list'][0];
                this.meteo = [];
                this.meteo.push({
                    date : this.convertDate(premierElement.dt_txt), 
                    icons : premierElement.weather[0].icon, 
                    tempMin : Math.round(premierElement.main.temp_min), 
                    tempMax : Math.round(premierElement.main.temp_max)});
                data['list'].forEach(element => {
                    let heure = new Date(element.dt_txt).getHours();
                    date = new Date(element.dt_txt);
                    if(heure  == 12 && date.getDate() != new Date().getDate()){
                        this.meteo.push({ date : this.convertDate(element.dt_txt), icons : element.weather[0].icon, tempMin : Math.round(element.main.temp_min), tempMax : Math.round(element.main.temp_max) });
                    }

                });
                console.log(this.meteo);
                this.getArray();
                console.log(this.arrayMeteo);
                this.mergeOption = {
                    series: [{ 
                        type: 'custom',
                        coordinateSystem: 'calendar',
            
                        renderItem:this.celendrier.renderItem, 
                        data:this.arrayMeteo
                    }]
                    }
                    this.status = true;
              
                
            },  
            (err)=>{
                console.log(err);
            },
            ()=>{
            }
        );
        console.log(this.meteo.length);
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
            this.arrayMeteo.push([element.date, element.icons, element.tempMin, element.tempMax]);
        });
    }
    //[element.date, element.icons, element.tempMax, element.tempMin])
}   
