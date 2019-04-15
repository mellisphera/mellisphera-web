import { RucherService } from '../../apiary/ruche-rucher/rucher.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meteo } from '../../../_model/meteo';
import { element } from 'protractor';
import { UserloggedService } from '../../../userlogged.service';
import { Observable } from 'rxjs';
import { CalendrierService } from './calendrier.service';
import { GraphMeteoService } from './graph-meteo.service';

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
    mergeOptionGraph  : any = null;

    tabTempMoy : any[];
    tabDate : any[];
    tabHeatmap : any[];
    tabHumidty : any[];

    constructor(private celendrier: CalendrierService, 
        private httpClient:  HttpClient,
        private login: UserloggedService,
        private graphMeteo: GraphMeteoService){
        this.meteo = [];
    }

    getWeather(zipCode: string) {
        this.status = false;
        this.arrayMeteo = [];
        this.meteoObs = this.httpClient.get<Meteo[]>('https://api.openweathermap.org/data/2.5/forecast?zip='+zipCode+',fr&units=metric&appid=110ff02ed24ccd819801248373c3b208');
        this.meteoObs.subscribe(
            (data)=>{
                var date = null;
                let premierElement = data['list'][0];
                this.meteo = [];
                this.meteo.push({
                    date : this.convertDate(premierElement.dt_txt), 
                    humidity : premierElement.main.humidity,
                    icons : premierElement.weather[0].icon, 
                    tempMin : Math.round(premierElement.main.temp_min), 
                    tempMax : Math.round(premierElement.main.temp_max,),
                    tempMoy : (premierElement.main.temp_min + premierElement.main.temp_max)/2});
                data['list'].forEach(element => {
                    let heure = new Date(element.dt_txt).getHours();
                    date = new Date(element.dt_txt);
                    if(heure  == 12 && date.getDate() != new Date().getDate()){
                        this.meteo.push({ 
                            date : this.convertDate(element.dt_txt),
                            humidity : element.main.humidity, 
                            icons : element.weather[0].icon, 
                            tempMin : Math.round(element.main.temp_min), 
                            tempMax : Math.round(element.main.temp_max),
                            tempMoy : (element.main.temp_min + element.main.temp_max)/2
                        
                        });
                    }

                });
                this.getArray();
                this.mergeOption = {
                    series: [{ 
                        data : this.arrayMeteo
                    },/*
                    {
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data:this.tabHeatmap
                    }*/],
                    }
                    this.mergeOptionGraph = {
                        xAxis: {
                            type: 'category',
                            data: this.tabDate
                        },
                        series : [
                            {
                                data : this.tabTempMoy
                            },
                            {
                                data : this.tabHumidty
                            }
                        ]
                    }
                    this.status = true;
              
                
            },  
            (err)=>{
                console.log(err);
            },
            ()=>{
            }
        );
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
        this.tabHumidty = [];
        this.tabTempMoy =  [];
        this.tabDate = [];
        this.tabHeatmap = [];
        this.meteo.forEach(element =>{
            this.arrayMeteo.push([element.date, element.icons, element.tempMin, element.tempMax]);
            this.tabTempMoy.push(element.tempMoy.toFixed(2));
            this.tabDate.push(element.date);
            this.tabHeatmap.push([element.date, element.humidity]);
            this.tabHumidty.push(element.humidity);
        });
    }
    //[element.date, element.icons, element.tempMax, element.tempMin])
}   
