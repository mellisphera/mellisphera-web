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
  recArrayDateExt : any[];
  recArrayDateInt : any[];
  mergeOption : any = null;
  constructor(private http : HttpClient) { 

  }

  getRecordByIdHive(idHive : string){
    this.recArray = [];
    this.recordObs = this.http.get<Record[]>(CONFIG.URL+'records/hive/'+idHive);
    this.recordObs.subscribe(
      (data)=>{
        this.recArray = data;
        this.sortRecordByTemp();
        console.log(this.recArrayWeight);
        this.mergeOption = {
          series: [
            {
              //data : this.recArrayWeight
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

    /*this.data.forEach(element=>{
      element[1]=[];
      element[1] = [
        {
          name : element[1],
          value : 5125
        }
      ]
    });*/
    //Thu Mar 08 20:46:26 CET 2018

    this.recArrrayTint = [];
    this.recArrayText = [];

    this.recArrayDateInt = [];
    this.recArrayWeight = [];
    this.recArrayDateExt = [];
    this.recArray.forEach((element,index)=>{
      if(element.temp_ext != null){
        /*var date = element.recordDate.split(" ");
        console.log(date);*/
        this.recArrayText.push({name : element.recordDate, value : [
          element.recordDate , element.temp_ext
        ]});
        this.recArrayWeight.push({name : element.recordDate,value :[
          element.recordDate,element.weight
        ]});
       // this.recArrayDateExt.push(element.recordDate,element.recordDate);
      }
      else if(element.temp_int != null){
        this.recArrrayTint.push({ name : element.recordDate, value : [
          element.recordDate, element.temp_int
        ]});  
        //this.recArrayDateInt.push(element.recordDate);
      
      }
    });
  }
}
