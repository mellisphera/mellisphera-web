import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { WeatherSource } from '../../../_model/weatherSource';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserloggedService } from '../../../userlogged.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class WeatherSrcsService {

  public userWeatherSources: WeatherSource[] = [];

  constructor(private http: HttpClient,
    private user: UserloggedService) {
    this.requestUserWeatherSrcs(this.user.getIdUserLoged()).subscribe(
      _ws => {this.userWeatherSources = [..._ws]}, () => {}, () => {}
    );
  }

  requestUserWeatherSrcs(userId: string):Observable<WeatherSource[]>{
    return this.http.get<WeatherSource[]>(CONFIG.URL + 'weathersrcs/userId/' + userId, httpOptions)
  }

  requestUserWeatherSrcsWithDateBetween(userId: string, range: Date[]):Observable<WeatherSource[]>{
    return this.http.post<WeatherSource[]>(CONFIG.URL + 'weathersrcs/userId/between/' + userId, range, httpOptions)
  }

  requestApiaryWeatherSrcs(apiaryId: string):Observable<WeatherSource[]>{
    return this.http.get<WeatherSource[]>(CONFIG.URL + 'weathersrcs/apiaryId/' + apiaryId, httpOptions)
  }

  requestApiaryWeatherSrcsWithDateBetween(apiaryId: string, range: Date[]):Observable<WeatherSource[]>{
    return this.http.post<WeatherSource[]>(CONFIG.URL + 'weathersrcs/apiaryId/between/' + apiaryId, range, httpOptions)
  }

  getUserWeatherSrcs(): WeatherSource[]{
    return this.userWeatherSources;
  }

  getApiaryWeatherSrcs(apiaryId: string): WeatherSource[]{
    return this.userWeatherSources.filter(_ws => _ws.apiaryId === apiaryId);
  }

  insert(ws: WeatherSource): Observable<WeatherSource>{
    return this.http.post<WeatherSource>(CONFIG.URL + 'weathersrcs/insert', ws, httpOptions);
  }

  update(ws: WeatherSource): Observable<WeatherSource>{
    return this.http.put<WeatherSource>(CONFIG.URL + 'weathersrcs/update', ws, httpOptions);
  }

  delete(wsId: string): Observable<String[]> {
    return this.http.post<String[]>(CONFIG.URL + 'weathersrcs/delete', [wsId], httpOptions);
  }
}
