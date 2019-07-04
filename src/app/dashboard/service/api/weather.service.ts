import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentDailyWeather } from '../../../_model/current-daily-weather';
import { CONFIG } from '../../../../constants/config';
import { Observable } from 'rxjs';
import { ForecastDailyWeather } from '../../../_model/forecast-daily-weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient: HttpClient) { }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentDailyWeather[]>}
   * @memberof WeatherService
   */
  public getCurrentDailyWeather(idApiary: string, range: Date[]): Observable<CurrentDailyWeather[]> {
    return this.httpClient.post<CurrentDailyWeather[]>(CONFIG.URL + 'dailyWeather/apiary/' + idApiary, range);
  }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<ForecastDailyWeather[]>}
   * @memberof WeatherService
   */
  public getForecastDailyWeather(idApiary: string, range: Date[]): Observable<ForecastDailyWeather[]>{
    return this.httpClient.post<ForecastDailyWeather[]>(CONFIG.URL + 'forecastDailyWeather/apiary/' + idApiary, range);
  }

}
