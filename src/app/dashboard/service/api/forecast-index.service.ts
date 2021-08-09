import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { RucherService } from './rucher.service';
import { ForecastIndex } from '../../../_model/forecast-index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ForecastIndexService {

  constructor(private http: HttpClient) {}

  getForecastIndexByApiaryAndDateBetween(apiaryId: string, range: Date[]): Observable<ForecastIndex[]> {
    return this.http.post<ForecastIndex[]>(CONFIG.URL + 'forecastIndex/apiary/between/'+ apiaryId, range, httpOptions);
  }


}
