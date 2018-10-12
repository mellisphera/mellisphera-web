import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../../config';
import { DailyRecordsW } from '../../../../_model/daily-records-w';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DailyRecordsWService {

  dailyObs : Observable<DailyRecordsW[]>;

  dailyRec : DailyRecordsW[];
  dailyRecArray : any[];
  mergeOption : any = null;
  rangeCalendar  : any[];

  constructor(private http : HttpClient) { 
    this.dailyRecArray = [];
  }

  
  getDailyRecordsWbyIdHive(idHive : string){
    this.dailyRecArray = [];
    this.dailyRec = [];
    this.dailyObs = this.http.get<DailyRecordsW[]>(CONFIG.URL+'/dailyRecordsW/hive/'+idHive);
    this.dailyObs.subscribe(
      (data)=>{
        console.log(data); 
          this.rangeCalendar = [];
          this.rangeCalendar.push(this.convertDate(data[0].recordDate), this.convertDate(data[data.length-1].recordDate));
          console.log(this.rangeCalendar);
          data.forEach((element, index)=>{
            this.dailyRec.push({
              recordDate : this.convertDate(element.recordDate),
              idHive : element.idHive,
              temp_int_min : element.temp_int_min,
              temp_int_max : element.temp_int_max,
              weight_min : element.weight_min,
              weight_max : element.weight_max,
              weight_gain : element.weight_gain,
              weight_income_gain : element.weight_income_gain,
              weight_foragingbees : element.weight_foragingbees,
              weight_hive : element.weight_hive,
              weight_colony : element.weight_colony,
              weight_filling_rate : element.weight_filling_rate
          });
        });
        console.log(this.dailyRec);
        this.getArray();
        console.log(this.dailyRecArray);
        this.mergeOption = {
          calendar : [{
            range: this.rangeCalendar,
          }],
          series : [
            {
                data: this.dailyRecArray,

            },
            {
                data: this.dailyRecArray,
            },
    
          ]
        }
      },
      (err)=>{
        console.log(err);
      }

    );
  }

  cleanQuery(){
    this.dailyRec = [];
    this.dailyRecArray = [];
    this.dailyObs = null;
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
    this.dailyRec.forEach(element =>{
        this.dailyRecArray.push([
          element.recordDate,
          element.weight_income_gain, 
          element.idHive,
          element.temp_int_min,
          element.temp_int_max,
          element.weight_min,
          element.weight_max,
          element.weight_gain,
          element.weight_foragingbees,
          element.weight_hive,
          element.weight_colony,
          element.weight_filling_rate
        ]);
    });
  }

}
