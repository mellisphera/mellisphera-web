import { Component, OnInit, Input, Output} from '@angular/core';
import { Requete } from './Service/Requete';
import { JsonRequete } from './Service/JsonRequete';
import * as echarts from '../../../../assets/echarts';
//import dispose from '../../../../assets/echarts';
import { Calendrier } from './calendrier';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { Rucher } from '../../ruche-rucher/rucher';
import { resolve } from 'dns';
import { reject } from 'q';
import { Meteo } from "./Service/Meteo";

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit {

  constructor(private rucherService : RucherService, private calendrier : Calendrier, private requete : Requete, private json : JsonRequete, private login : UserloggedService) { }

  calendrierInit : any = null;;
  meteo : any = null;
  tabRucher : Rucher[];
  idRucher : string;
  username: string;
  cityRucher : string;
  tabMeteo : Meteo[];
  ngOnInit() {
    this.username = this.login.currentUser().username;
    this.getRucherByUser();
    setTimeout(
      ()=>{
        this.cityRucher = this.tabRucher[0].codePostal;
        this.getWeatherByCity();
        setTimeout(()=>{
          console.log(this.tabRucher);
          this.json.setJsonWeather(this.meteo);
          this.json.sortProcess();
          this.tabMeteo=this.json.getResultat();
          this.showCalendar();
        },500)
      },500
    );
   
    
    /*
    this.requete.setUrl('***REMOVED***/dailyweather');
    this.requete.exeRequete();
    setTimeout(
      ()=>{
        this.json.setJsonActu(this.requete.gettabMeteo());
        this.tabNbRucher = this.json.getJsonActu();
        this.json.sortJsonMeteoActu();
        //console.log(this.requete.gettabMeteo());
        console.log(this.json.getJsonStaticMeteoActu());
        this.json.recupMeteoById(this.json.getJsonStaticMeteoActu()[0][4]);
        this.idRucher = this.json.getJsonStaticMeteoActu()[0][4]; 
        this.requetteMeteoFutur();
        this.tabMeteo = this.json.getResultat();
        setTimeout(
          ()=>{
            this.affichCalendrier();
          },1000
        );
        
      },1000
    );*/
  }

  getWeatherByCity(){
    this.requete.getWeather(this.cityRucher).subscribe(
      (data)=>{
        this.meteo = data
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  showCalendar(){
    if(this.calendrierInit != null){
      this.calendrierInit.dispose("#main");
      this.calendrierInit = null;
    }
    this.calendrierInit = echarts.init(document.getElementById('main'));
    /*let tab=[
      ["2018-08-25",'01d',26,34],
      ["2018-08-26",'01d',26,34],
      ["2018-08-27",'01d',26,34],
      ["2018-08-28",'01d',26,34]
    ];*/
    console.log('Avant affichage calendrier :');
    this.calendrier.options.series[0].data = this.tabMeteo;
   // this.calendrier.meteo = this.tabMeteo;
    //this.calendrier.options.range = '2018-08';
    this.calendrierInit.setOption(this.calendrier.options);
  }
  getRucherByUser() {
    this.rucherService.getUserRuchers(this.username).subscribe(
      (data) => {
        this.tabRucher = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
/*
  requetteMeteoFutur(){
    this.requete.setUrl('https://api.openweathermap.org/data/2.5/forecast?q='+this.requete.city+'&units=metric&appid=***REMOVED***');
    this.requete.exeRequete();
    setTimeout(
      ()=>{
        this.json.setJsonMeteoFutur(this.requete.gettabMeteo());
        this.json.sortJsonMeteoFutur();
      },1000
    );

  }
*/
  onChange(id){
    this
    this.idRucher = id.target.value;
    console.log(this.tabRucher[this.idRucher]);
    this.cityRucher = this.tabRucher[this.idRucher].codePostal;
    console.log(this.cityRucher);
    this.getWeatherByCity();
    setTimeout(()=>{
      this.json.setJsonWeather(this.meteo);
      this.json.sortProcess();
      this.tabMeteo=this.json.getResultat();
      this.showCalendar();
    },500)
  }

}
