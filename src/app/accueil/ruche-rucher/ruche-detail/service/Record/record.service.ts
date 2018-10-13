import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../../../../config';
import { Record } from '../../../../../_model/record';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  recArray : Record[];
  recordObs : Observable<Record[]>;

  recArrrayTint : any[];
  recArrayText : any[];
  recArrayWeight : any[];
  recArrayDate : any[];

  mergeOption : any = null;
  constructor(private http : HttpClient) { 

  }

  getRecordByIdHive(idHive : string){
    this.recArray = [];
    this.recordObs = this.http.get<Record[]>(CONFIG.URL+'records/hive/'+idHive);
    this.recordObs.subscribe(
      (data)=>{
        data.forEach(element=>{
          this.recArray.push({
            id : element.id,
            battery_ext : element.battery_ext,
            battery_int : element.battery_int,
            humidity_ext : element.humidity_ext,
            humidity_int : element.humidity_int,
            recordDate : element.recordDate,
            weight_icome : element.weight_icome,
            recordsType : element.recordsType,
            sensorRef : element.sensorRef,
            temp_ext : element.temp_ext,
            temp_int : element.temp_int,
            weight : element.weight,
            idHive : element.weight
          })
        });
        this.sortRecordByTemp();
        /*
        console.log(this.recArrrayTint);
        console.log(this.recArrayText);
        console.log(this.recArrayWeight);*/
        console.log(this.recArrayDate);

        this.mergeOption = {
          xAxis: [
            {
              data: this.recArrayDate,
            }],
          series: [
            {
              data : this.recArrayWeight
            },
            {
              data : this.recArrrayTint
            },
            {
              data : this.recArrayText
            }
        ]
        }
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  sortRecordByTemp(){
    this.recArrrayTint = [];
    this.recArrayText = [];
    this.recArrayWeight = [];
    this.recArrayDate = [];
    this.recArray.forEach(element=>{
      if(element.temp_ext != null){
        this.recArrayText.push(element.temp_ext);
      }
      else if(element.temp_int != null){
        this.recArrrayTint.push(element.temp_int);
      }
      this.recArrayWeight.push(element.weight);
      this.recArrayDate.push(element.recordDate);
    })
  }
}
