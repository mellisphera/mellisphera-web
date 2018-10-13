import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyRecordTh } from '../../../_model/daily-record-th';
import { CONFIG } from '../../../../config';
import { UserloggedService } from '../../../userlogged.service';

@Injectable()
export class DailyRecordService{
    
    constructor(private http : HttpClient, private user : UserloggedService){
        this.getDailyRecThByApiary(sessionStorage.getItem("idApiaryUpdate"));
    }

    dailyRecObs : Observable<DailyRecordTh>;
    dailyRecTabObs : Observable<DailyRecordTh[]>;
    status : string = "Inconnu";
    dailyRecord : DailyRecordTh;
    dailyRecords : DailyRecordTh[] = null;

    getDailyRecThByIdHive(idHive){
        this.dailyRecObs = this.http.get<DailyRecordTh>(CONFIG.URL+'/dailyRecordsTH/last/'+idHive);
        this.dailyRecObs.subscribe(
            (data)=>{
                console.log(data);
                this.dailyRecord = {id : data.id, recordDate : data.recordDate, idHive : data.idHive, humidity_int_min : data.humidity_int_min, 
                    humidity_int_max : data.humidity_int_max, temp_int_min: data.temp_int_min, temp_int_max : data.temp_int_max, 
                    temp_int_moy : data.temp_int_moy, temp_int_stddev: data.temp_int_stddev, health_status : data.health_status, health_trend : data.health_trend, r_int_text: data.r_int_text };
            },
            (err)=>{
                console.log(err);
            }
        );
    }
    getDailyRecThByApiary(idApiary){
        this.dailyRecTabObs = this.http.get<DailyRecordTh[]>(CONFIG.URL+'/dailyRecordsTH/'+this.user.currentUser().username+'/'+idApiary);
        this.dailyRecords = [];
        this.dailyRecTabObs.subscribe(
            (data)=>{
                console.log(data);
                if(data[0]!= null){
                    data.forEach(element => {
                        this.dailyRecords.push({id : element.id, recordDate : element.recordDate, idHive : element.idHive, humidity_int_min : element.humidity_int_min, 
                            humidity_int_max : element.humidity_int_max, temp_int_min: element.temp_int_min, temp_int_max : element.temp_int_max, 
                            temp_int_moy : element.temp_int_moy, temp_int_stddev: element.temp_int_stddev, health_status : element.health_status, health_trend : element.health_trend, r_int_text: element.r_int_text });
                    });
                console.log(this.dailyRecords);
                }
            },
            (err)=>{
                console.log(err)
            }
        );
    }

    getStatus(id){
        this.status = "Inconnu";
        this.verifId(id);
        return "ruche "+this.status;
    }

    verifId(id){
        this.dailyRecords.forEach((element,index)=>{
            if(element.idHive == id){
                this.status =  element.health_status;
            }
        })
    }
    

}