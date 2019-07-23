import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentDailyWeather } from '../../../_model/current-daily-weather';
import { CONFIG } from '../../../../constants/config';
import { Observable } from 'rxjs';
import { ForecastDailyWeather } from '../../../_model/forecast-daily-weather';
import { ForecastHourlyWeather } from '../../../_model/forecast-hourly-weather';
import { CurrentHourlyWeather } from '../../../_model/current-hourly-weather';

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

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempForecastHourlyWeather(idApiary: string, range: Date[]): Observable<ForecastHourlyWeather[]> {
    return this.httpClient.post<ForecastHourlyWeather[]>(CONFIG.URL + 'forecastHourlyWeather/temp/apiary/' + idApiary, range);
  }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempCurrentHourlyWeather(idApiary: string, range: Date[]): Observable<CurrentHourlyWeather[]> {
    return this.httpClient.post<CurrentHourlyWeather[]>(CONFIG.URL + 'hourlyWeather/temp/apiary/' + idApiary, range);
  }
}
