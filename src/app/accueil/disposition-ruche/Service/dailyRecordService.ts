import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class DailyRecordService{
    
    constructor(private http : HttpClient){}

    getDailyRecThByIdHive(idHive){
        return this.http.get("***REMOVED***/dalyRecordsTH/last/"+idHive);
    }

}