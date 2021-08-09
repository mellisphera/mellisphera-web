import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { RucherService } from './rucher.service';
import { CurrentIndex } from '../../../_model/current-index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CurrentIndexService {

  constructor(private http: HttpClient) {}

  getCurrentIndexByApiaryAndDateBetweenWS(apiaryId: string, range: Date[]): Observable<CurrentIndex[]> {
    return this.http.post<CurrentIndex[]>(CONFIG.URL + 'currentIndex/apiary/ws/between/'+ apiaryId, range, httpOptions);
  }

  getCurrentIndexByApiaryAndDateBetweenLocal(apiaryId: string, range: Date[]): Observable<CurrentIndex[]> {
    return this.http.post<CurrentIndex[]>(CONFIG.URL + 'currentIndex/apiary/local/between/'+ apiaryId, range, httpOptions);
  }

  getCurrentIndexByApiaryAndSensorRefAndDateBetweenLocal(apiaryId: string, sensorRef: string, range: Date[]): Observable<CurrentIndex[]> {
    return this.http.post<CurrentIndex[]>(CONFIG.URL + 'currentIndex/apiary/local/sensor/between/'+ apiaryId + '/' + sensorRef, range, httpOptions);
  }

}
