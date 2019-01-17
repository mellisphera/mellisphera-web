import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyRecordTh } from '../../../_model/daily-record-th';
import { CONFIG } from '../../../../config';
import { UserloggedService } from '../../../userlogged.service';

@Injectable()
export class DailyRecordService{
    

    dailyRecObs : Observable<DailyRecordTh>;
    dailyRecObsArray : Observable<DailyRecordTh[]>;
    dailyRecTabObs : Observable<DailyRecordTh[]>;

    arrayTempInt : any[];
    arrayHint : any[];
    arrayHealth : any[];
    status : string = "Inconnu";
    dailyRecord : DailyRecordTh;
    dailyRecords : DailyRecordTh[] = null;

    statusLoading : boolean;

    mergeOptionTint : any;
    mergeOptionHint : any;
    mergeOptionCalendarHealth : any;

    constructor(private http : HttpClient, private user : UserloggedService){
        this.statusLoading = false;
        this.getDailyRecThByApiary(sessionStorage.getItem("idApiaryUpdate"));
    }

    getDailyRecThByIdHivelas(idHive){
        this.dailyRecObs = this.http.get<DailyRecordTh>(CONFIG.URL+'/dailyRecordsTH/last/'+idHive);
        this.dailyRecObs.subscribe(
            (data)=>{
                this.dailyRecord = data;
            },
            (err)=>{
                console.log(err);
            }
        );
    }
    getByIdHive(idHive){
        this.dailyRecords = [];
        this.dailyRecObsArray = this.http.get<DailyRecordTh[]>(CONFIG.URL+'/dailyRecordsTH/hive/'+idHive);
        this.dailyRecObsArray.subscribe(
            (data)=>{
                this.dailyRecords = data;
                this.dailyRecordToArray();
            },
            (err)=>{
                console.log(err);
            }
        );
    }

    dailyRecordToArray(){
        this.arrayTempInt = [];
        this.arrayHint = [];
        this.arrayHealth = [];
        this.dailyRecords.forEach(element=>{
            this.arrayTempInt.push([this.convertDate(element.recordDate),element.temp_int_max]);
            this.arrayHint.push([this.convertDate(element.recordDate), element.humidity_int_max]);
            this.arrayHealth.push([element.recordDate,element.health_status,element.health_trend]);
        })
        this.mergeOptionCalendarHealth = {
            series:{
                data:this.arrayHealth
            }
        }
        this.mergeOptionTint = {
            series : {
                    data: this.arrayTempInt
                },
            title: {
                    text: 'Internal Temperature (max)'
                },
            visualMap: {
                    min: -10,
                    max: 40,
                    splitNumber : 5,
                    inRange : {
                        color: ['#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    }
                    
            },
        }
        this.mergeOptionHint = {
            series : {
                data : this.arrayHint
            },
            title: {
                text: 'Internal Relative Humidity (max)'
            },
            visualMap: {
                min: 20,
                max: 100,
                splitNumber : 4,
                inRange: {
                    color: ["#97A6C5","#6987C5",'#3C68C5','#0F4AC5'],
                },
            },
            
        }
        this.statusLoading = true;
    }

    getDailyRecThByApiary(idApiary){
        this.dailyRecTabObs = this.http.get<DailyRecordTh[]>(CONFIG.URL+'dailyRecordsTH/'+this.user.currentUser().username+'/'+idApiary);
        this.dailyRecords = [];
        this.dailyRecTabObs.subscribe(
            (data)=>{
                if(data[0]!= null){
                    this.dailyRecords = data;

                }
            },
            (err)=>{
                console.log(err)
            }
        );
    }

    getStatus(id){
        this.status = "ruche Inconnu";
        this.verifId(id);
        return this.status;
    }

    verifId(id){
        this.dailyRecords.forEach((element,index)=>{
            if(element.idHive == id){
                this.status =  "ruche "+ element.health_status+element.health_trend;
            }
        })
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
    

}