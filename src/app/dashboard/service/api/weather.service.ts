import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentDailyWeather } from '../../../_model/current-daily-weather';
import { CONFIG } from '../../../../constants/config';
import { Observable } from 'rxjs';
import { ForecastDailyWeather } from '../../../_model/forecast-daily-weather';
import { ForecastHourlyWeather } from '../../../_model/forecast-hourly-weather';
import { CurrentHourlyWeather } from '../../../_model/current-hourly-weather';
import { map } from 'rxjs-compat/operator/map';
import { UnitService } from '../unit.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private unitSystem: string;
  constructor(private httpClient: HttpClient, private unitService: UnitService) { }


  /**
   *
   *
   * @param {string} unit
   * @memberof WeatherService
   */
  setUnitSystem(unit: string): void {
    this.unitSystem = unit;
  }
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
  public getForecastDailyWeather(idApiary: string, range: Date[]): Observable<ForecastDailyWeather[]> {
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
  public getTempForecastHourlyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'forecastHourlyWeather/temp/apiary/' + idApiary, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }

  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempCurrentHourlyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'hourlyWeather/temp/apiary/' + idApiary, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getRainCurrentDailyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'dailyWeather/rain/apiary/' + idApiary, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertMilimetreToPouce(_value.value.rainDay, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }


  /**
   *
   *
   * @param {string} idApiary
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getRainForecastDailyWeather(idApiary: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + 'forecastDailyWeather/rain/apiary/' + idApiary, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertMilimetreToPouce(_value.value.rainDay, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }


  public getRainAllWeather(idApiary: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getRainCurrentDailyWeather(idApiary, range),
      this.getRainForecastDailyWeather(idApiary, range)
    ]);
  }
}
