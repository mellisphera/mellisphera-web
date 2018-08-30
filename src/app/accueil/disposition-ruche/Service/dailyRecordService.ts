import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class DailyRecordService{
    
    constructor(private http : HttpClient){}

    getDailyRecThByIdHive(idHive){
        return this.http.get("http://localhost:8091/dalyRecordsTH/last/"+idHive);
    }

}