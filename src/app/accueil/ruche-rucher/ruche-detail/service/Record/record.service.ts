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

  data  = 
[
 { name : '2018-03-09T00:05:02', value : ['2018-03-09T00:05:02', 5125]},
 { name : '2018-03-10T23:57:11', value : ['2018-03-10T23:57:11', 5125]},
 { name : '2018-03-11T17:03:21', value : ['2018-03-11T17:03:21', 5125]},
 { name : '2018-03-12T04:21:44', value : ['2018-03-12T04:21:44', 5125]},
 { name : '2018-03-13T22:39:56', value : ['2018-03-13T22:39:56', 5125]},
 { name : '2018-03-14T22:19:56', value : ['2018-03-14T22:19:56', 5125]},
 { name : '2018-03-15T21:59:56', value : ['2018-03-15T21:59:56', 5125]},
 { name : '2018-03-16T22:32:08', value : ['2018-03-16T22:32:08', 5125]},
 { name : '2018-03-17T00:23:32', value : ['2018-03-17T00:23:32', 5125]},
 { name : '2018-03-18T04:49:01', value : ['2018-03-18T04:49:01', 5125]},
 { name : '2018-03-19T20:14:37', value : ['2018-03-19T20:14:37', 5125]},
 { name : '2018-03-20T00:01:49', value : ['2018-03-20T00:01:49', 5125]},
 { name : '2018-03-21T07:16:13', value : ['2018-03-21T07:16:13', 5125]},
 { name : '2018-03-22T07:29:53', value : ['2018-03-22T07:29:53', 5125]},
 { name : '2018-03-23T04:27:49', value : ['2018-03-23T04:27:49', 5125]},
 { name : '2018-03-24T04:12:40', value : ['2018-03-24T04:12:40', 5125]},
 { name : '2018-03-25T05:34:19', value : ['2018-03-25T05:34:19', 5125]},
 { name : '2018-03-26T04:05:19', value : ['2018-03-26T04:05:19', 5125]},
 { name : '2018-03-27T02:46:05', value : ['2018-03-27T02:46:05', 5125]},
 { name : '2018-03-28T05:57:49', value : ['2018-03-28T05:57:49', 5125]},
 { name : '2018-03-29T23:25:00', value : ['2018-03-29T23:25:00', 5125]},
 { name : '2018-03-30T23:52:58', value : ['2018-03-30T23:52:58', 5125]},
 { name : '2018-03-31T12:06:10', value : ['2018-03-31T12:06:10', 5125]},
 { name : '2018-04-01T23:45:45', value : ['2018-04-01T23:45:45', 5125]},
 { name : '2018-04-02T23:05:55', value : ['2018-04-02T23:05:55', 5125]},
 { name : '2018-04-03T22:54:40', value : ['2018-04-03T22:54:40', 5125]},
 { name : '2018-04-04T19:51:58', value : ['2018-04-04T19:51:58', 5125]},
 { name : '2018-04-05T23:30:13', value : ['2018-04-05T23:30:13', 5125]},
 { name : '2018-04-06T21:25:26', value : ['2018-04-06T21:25:26', 5125]},
 { name : '2018-04-07T23:09:23', value : ['2018-04-07T23:09:23', 5125]},
 { name : '2018-04-08T02:00:56', value : ['2018-04-08T02:00:56', 5125]},
 { name : '2018-04-09T08:30:48', value : ['2018-04-09T08:30:48', 5125]},
];
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
        console.log(this.recArrayWeight);
        //console.log(this.recArray);
        /*console.log(this.recArrrayTint);
        console.log(this.recArrayText);
        console.log(this.recArrayWeight);
        console.log(this.recArrrayTint);*/
        console.log(this.data)

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
