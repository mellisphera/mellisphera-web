/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
import { WEATHER } from '../../melli-charts/charts/icons/icons_weather';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private unitSystem: string;
  constructor(private httpClient: HttpClient, private unitService: UnitService, private userPrefService: UserParamsService) { }


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
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentDailyWeather[]>}
   * @memberof WeatherService
   */
  public getCurrentDailyWeather(apiaryId: string, range: Date[]): Observable<CurrentDailyWeather[]> {
    return this.httpClient.post<CurrentDailyWeather[]>(CONFIG.URL + `dailyWeather/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
   public getCurrentHourlyWeather(apiaryId: string, range: Date[]): Observable<CurrentHourlyWeather[]> {
    return this.httpClient.post<CurrentHourlyWeather[]>(CONFIG.URL + `hourlyWeather/hourly/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
   public getCurrentHourlyWeatherWithWSrcs(apiaryId: string, ws: string, range: Date[]): Observable<CurrentHourlyWeather[]> {
    return this.httpClient.post<CurrentHourlyWeather[]>(CONFIG.URL + `hourlyWeather/hourly/apiary/${apiaryId}/${ws}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
   public getCurrentDailyWeatherWithWSrcs(apiaryId: string, ws: string, range: Date[]): Observable<CurrentDailyWeather[]> {
    return this.httpClient.post<CurrentHourlyWeather[]>(CONFIG.URL + `dailyWeather/daily/apiary/${apiaryId}/${ws}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<ForecastDailyWeather[]>}
   * @memberof WeatherService
   */
  public getForecastDailyWeather(apiaryId: string, range: Date[]): Observable<ForecastDailyWeather[]> {
    return this.httpClient.post<ForecastDailyWeather[]>(CONFIG.URL + `forecastDailyWeather/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
   public getForecastHourlyWeather(apiaryId: string, range: Date[]): Observable<ForecastHourlyWeather[]> {
    return this.httpClient.post<ForecastHourlyWeather[]>(CONFIG.URL + `forecastHourlyWeather/hourly/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempForecastHourlyWeather(apiaryId: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + `forecastHourlyWeather/temp/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getTempCurrentHourlyWeather(apiaryId: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + `hourlyWeather/temp/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range).map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef };
    }));
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
   public getRainByApiaryAndOriginAndDateBetween(apiaryId: string, origin: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + `dailyWeather/rain/apiary/${apiaryId}/${origin}`, range);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<CurrentHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getRainCurrentDailyWeather(apiaryId: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + `dailyWeather/rain/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<ForecastHourlyWeather[]>}
   * @memberof WeatherService
   */
  public getRainForecastDailyWeather(apiaryId: string, range: Date[]): Observable<any[]> {
    return this.httpClient.post<any[]>(CONFIG.URL + `forecastDailyWeather/rain/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);/* .map(_elt => _elt.map(_value => {
      return { date: _value.date, value: this.unitService.convertMilimetreToPouce(_value.value.rainDay, this.unitSystem), sensorRef: _value.sensorRef };
    })); */
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getTempExtForecastDailyWeather(apiaryId: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + `forecastDailyWeather/tExt/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any[][]>}
   * @memberof WeatherService
   */
  public getAllTempWeather(apiaryId: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getTempExtCurrentDailyWeather(apiaryId, range),
      this.getTempExtForecastDailyWeather(apiaryId, range)
    ]);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getWindCurrentDailyWeather(apiaryId: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + `dailyWeather/wind/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
   public getWindByApiaryIdAndOriginAndDate(apiaryId: string, origin: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + `dailyWeather/wind/apiary/${apiaryId}/${origin}`, range);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getWindForecastDailyWeather(apiaryId: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + `forecastDailyWeather/wind/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`,range);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any>}
   * @memberof WeatherService
   */
  public getTempExtCurrentDailyWeather(apiaryId: string, range: Date[]): Observable<any> {
    return this.httpClient.post<any>(CONFIG.URL + `dailyWeather/tExt/apiary/${apiaryId}/${this.userPrefService.getUserPref().weatherSource}`, range);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any[][]>}
   * @memberof WeatherService
   */
  public getWindAllWeather(apiaryId: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getWindCurrentDailyWeather(apiaryId, range),
      this.getWindForecastDailyWeather(apiaryId, range)
    ]);
  }


  /**
   *
   *
   * @param {string} apiaryId
   * @param {Date[]} range
   * @returns {Observable<any[][]>}
   * @memberof WeatherService
   */
  public getRainAllWeather(apiaryId: string, range: Date[]): Observable<any[][]> {
    return Observable.forkJoin([
      this.getRainCurrentDailyWeather(apiaryId, range),
      this.getRainForecastDailyWeather(apiaryId, range)
    ]);
  }



  getPicto(nomPicto: string, cellPoint: Array<number>): Array<any> {
    if (!isUndefined(WEATHER[nomPicto])) {
      return WEATHER[nomPicto].map(_path => {
        return {
          type: 'path',
          scale: _path.scale,
          shape: {
            pathData: _path.path,
          },
          position: [cellPoint[0] + _path.position[0], cellPoint[1] + _path.position[1]],
          style: _path.style
        };
      });
    } else {
      console.log(nomPicto);
      return [];
    }

  }


  /**
   *
   *
   * @param {string} enLabel
   * @param {string} lang
   * @returns {string}
   * @memberof WeatherService
   */
  getTranslateDescriptionMainDay(enLabel: string, lang: string): string {
    if (lang !== 'fr') {
      return enLabel;
    } else {
      switch (enLabel) {
        case 'Clear':
          return 'Ensoleillé';
        case 'Few clouds':
          return 'Eclaircies';
        case 'Scattered clouds':
          return 'Couvert';
        case 'Shower rain':
          return 'Averses';
        case 'Broken clouds':
          return 'Très nuageux';
        case 'Shower':
          return 'Averses';
        case 'Rain':
          return 'Pluie';
        case 'Thunderstorm':
          return 'Orages';
        case 'Shower snow':
          return 'Averses de neige';
        case 'Snow':
          return 'Neige';
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Dust':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
          return 'Brouillard';
        case 'Clouds':
          return 'Nuageux';
        default:
          return '';
      }
    }
  }

  /*Clear sky : Ensoleillé
Few clouds : Eclaircies
Scattered clouds : Couvert
Broken clouds : Très nuageux
Shower rain : Averses
Rain : Pluie
Thunderstorm : Orages
Snow : Neige
Mist/Gust : Brouillard*/
}
