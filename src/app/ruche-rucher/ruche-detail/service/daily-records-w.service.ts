import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../config';
import { DailyRecordsW } from '../../../_model/daily-records-w';
import { ElementSchemaRegistry } from '@angular/compiler';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DailyRecordsWService {


  /*
  *   Service pour les données DailyRecordsW pour le calendrier de poid
  *
  */

  dailyObs : Observable<DailyRecordsW[]>;

  dailyRec : DailyRecordsW[];
  dailyRecArray: any[];
  mergeOption: any = null;
  rangeCalendar: Array<string>;
  currentIdHive: string;

  arrayTempExt: any[];
  mergeOptionTempExt: any;

  timeLine : any[];

  constructor(private http : HttpClient) {
    this.rangeCalendar = [];
    var max = new Date();
    var min = new Date((max.getFullYear()-1)+'-'+(max.getMonth()+1)+'-'+max.getDate());
    this.rangeCalendar = [this.convertDate(min),this.convertDate(max)];
    console.log(this.rangeCalendar);
    this.dailyRecArray = [];
    this.updateCalendar();
  }

  getDailyRecordsWbyIdHive(idHive : string){
    this.currentIdHive = idHive;
    this.dailyRecArray = [];
    this.arrayTempExt = [];
    this.dailyRec = [];
    this.dailyObs = this.http.get<DailyRecordsW[]>(CONFIG.URL+'dailyRecordsW/hive/'+idHive);
    this.dailyObs.subscribe(
      (data)=>{
        if(data.length > 0){
        this.dailyRec = data;
          this.getArray();
          this.updateCalendar();
        }
      },
      (err)=>{
        console.log(err);
      }

    );
  }

  updateCalendar(){
    this.mergeOption = {
      series : [
        {
            data: this.dailyRecArray,

        },
        {
            data: this.dailyRecArray,
        },

      ]
    }
    this.mergeOptionTempExt = {
        series : {
          data : this.arrayTempExt
        },
        title: {
          text: 'External Temperature (max)'
      },
      visualMap: {
          min: -10,
          max: 40,
          calculable : true,
          inRange: {
            color: ['#abd9e9','#CC0000']
          },
      }
    };
  }
  
  cleanQuery(){
    this.dailyRec = [];
    this.dailyRecArray = [];
    this.dailyObs = null;
    this.mergeOption = null;
  }

  convertDate(date : Date){
    var jour = ''+date.getDate();
    var mois = ''+(date.getMonth()+1);
    var anee = date.getFullYear();
    if(parseInt(jour) < 10 ){ jour = '0'+jour; }
    if(parseInt(mois) < 10 ){ mois = '0'+mois; }

    return anee + '-' +mois+'-'+ jour;
  }

  getMonth(date : Date){
    return (new Date(date).getMonth()+1);
  }
  getYear(date : string){
    return new Date(date).getFullYear();
}

  getArray(){
    this.timeLine = [];
    let lastMonth = null;
    this.dailyRec.forEach((element,index) =>{
      this.arrayTempExt.push([element.recordDate, element.temp_ext_max])
      if(this.getMonth(element.recordDate) != lastMonth){
        this.timeLine.push(element.recordDate);
      }
        this.dailyRecArray.push([
          element.recordDate,
          element.weight_income_gain
        ]);
        lastMonth = this.getMonth(element.recordDate)
    });
  }

}