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

/**
 * @author mickael
 * @description Ensemble des requetes pour les records Journalier des ruches
 *
 */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyRecordTh } from '../../../_model/daily-record-th';
import { CONFIG } from '../../../../constants/config';
import { UserloggedService } from '../../../userlogged.service';
import { UnitService } from '../unit.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { RucherService } from './rucher.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Injectable()
export class DailyRecordService {
    dailyRecObs: Observable<DailyRecordTh>;
    dailyRecObsArray: Observable<DailyRecordTh[]>;
    dailyRecTabObs: Observable<DailyRecordTh[]>;

    private arrayTempInt: any[];
    private arrayHint: any[];
    private arrayHealth: any[];
    public dailyRecords: DailyRecordTh[];
    public dailyRecordsDayD3D7: DailyRecordTh[][];
    public dailyRecordsGraph: DailyRecordTh[];
    public statusLoading: boolean;
    public rangeDailyRecord: Date;
    public mergeOptionTint: any;
    public mergeOptionHint: any;
    private unitSystem: string;
    public mergeOptionCalendarHealth: any;

    constructor(private http: HttpClient,
        private user: UserloggedService,
        private unitService: UnitService,
        private translateService: TranslateService,
        private rucherService: RucherService,
        private graphGlobal: GraphGlobal) {
        this.statusLoading = false;
        this.rangeDailyRecord = new Date();
        this.arrayTempInt = [];
        this.arrayHint = [];
        this.arrayHealth = [];
        this.rangeDailyRecord.setDate(new Date().getDate() - 2);
        this.rangeDailyRecord.setHours(23);
        this.rangeDailyRecord.setMinutes(0);
        this.dailyRecords = [];
        this.dailyRecordsDayD3D7 = [];
        this.dailyRecordsDayD3D7[0] = [];
        this.dailyRecordsDayD3D7[1] = [];
        this.dailyRecordsDayD3D7[2] = [];
        if (this.user.getUser()) {
            this.getDailyRecThByApiary(window.localStorage.getItem('currentApiary'));

        }
    }


    /**
     *
     * @public
     * @param {string} hiveId
     * @memberof DailyRecordService
     */
    public getByhiveId(hiveId: string): void {
        this.dailyRecordsGraph = [];
        this.http.get<DailyRecordTh[]>(CONFIG.URL + '/dailyRecordsTH/hive/' + hiveId).map(daily => {
            this.arrayTempInt = daily.filter(elt => elt.temp_int_max !== null).
                map(eltMap => [eltMap.recordDate, this.unitService.convertTempFromUsePref(eltMap.temp_int_max, this.unitSystem, false)]);
            this.arrayHint = daily.filter(elt => elt.humidity_int_max !== null).map(eltMap => [eltMap.recordDate, eltMap.humidity_int_max]);
            this.arrayHealth = daily.map(elt => [elt.recordDate, elt.brood]);
            return daily;
        })
            .subscribe(
                (data) => {
                    this.dailyRecordsGraph = data;
                    this.updateMerge();
                },
                (err) => {
                    console.log(err);
                }
            );
    }
    /**
     *
     * @public
     * @param {string} apiaryId
     * @memberof DailyRecordService
     */
    public nextDay(apiaryId: string): void {
        this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() + 1);
        this.rangeDailyRecord.setHours(23);
        this.rangeDailyRecord.setMinutes(0);
        this.rangeDailyRecord.setSeconds(0);
        this.getDailyRecThByApiary(apiaryId);
    }
    /**
     *
     * @public
     * @param {string} apiaryId
     * @memberof DailyRecordService
     */
    public previousDay(apiaryId: string): void {
        this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() - 1);
        this.rangeDailyRecord.setHours(23);
        this.rangeDailyRecord.setMinutes(0);
        this.getDailyRecThByApiary(apiaryId);
    }
    setUnitSystem(unit: string): void {
        this.unitSystem = unit;
    }
    /**
     *
     *
     * @public
     * @memberof DailyRecordService
     */
    public updateMerge(): void {
        this.mergeOptionCalendarHealth = {
            series: {
                data: this.arrayHealth
            },
            visualMap: {
                calculable: true,
                min: 0,
                max: 100,
                orient: 'horizontal',
                left: 'center',
                top: 30,
                itemWidth: 15,
                itemSymbol: 'diamond',
                inRange: {
                    color: ['red', 'yellow', '#129001'],
                },
            },
        };
        this.mergeOptionTint = {
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: this.arrayTempInt
            },
            tooltip: {
                formatter: (params) => {
                    return params.marker +
                        this.unitService.getDailyDate(params.data[0]) + '<br/>' 
                        + this.unitService.getValRound(params.data[1]) + (this.unitSystem === 'METRIC' ? '°C' : '°F');
                }
            },
            title: {
                text: this.graphGlobal.getTitle("InternalTemperature") + ' (max, ' + (this.unitSystem === 'METRIC' ? '°C' : '°F') + ')'
            },
            visualMap: {
                calculable: true,
                min: this.unitSystem === 'METRIC' ? -10 : 15,
                max: this.unitSystem === 'METRIC' ? 40 : 105,
                inRange: {
                    /* color: ['#abd9e9', '#CC0000'] */
                    color: ['#313695', '#4575b4', '#74add1',
                        '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                }
            },
        };
        this.mergeOptionHint = {
            series: {
                data: this.arrayHint
            },
            title: {
                text: this.graphGlobal.getTitle("InternalRelativeHumidity")
            },
            tooltip: {
                formatter: (params) => {
                    return params.marker +
                        this.unitService.getDailyDate(params.data[0]) + '<br/>' + this.unitService.getValRound(params.data[1]) + ' %';
                }
            },
            visualMap: {
                left: 'center',
                orient: 'horizontal',
                top: 50,
                right: '3%',
                type: 'piecewise',
                pieces: [
                    // Range of a piece can be specified by property min and max,
                    // where min will be set as -Infinity if ignored,
                    // and max will be set as Infinity if ignored.
                    { min: 20, max: 50 },
                    { min: 50, max: 75 },
                    { min: 75, max: 87 },
                    { min: 87, max: 100 },
                    // Label of the piece can be specified.
                ],
                inRange: {
                    color: ['#97A6C5', '#6987C5', '#3C68C5', '#05489B'],
                },
            },
        };
        this.statusLoading = true;
    }
    /**
     *
     * @public
     * @param {string} apiaryId
     * @memberof DailyRecordService
     */
    public getDailyRecThByApiary(apiaryId: string): void {
        var tabDate: Date[];
        var previousDay: Date;
        previousDay = new Date();
        previousDay.setFullYear(this.rangeDailyRecord.getFullYear());
        previousDay.setMonth(this.rangeDailyRecord.getMonth());
        previousDay.setDate(this.rangeDailyRecord.getDate() + 1);
        previousDay.setHours(23);
        previousDay.setMinutes(0);
        tabDate = [this.rangeDailyRecord, previousDay];
        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + apiaryId, tabDate);
        this.dailyRecTabObs.subscribe(
            (data) => {
                if (data[0] != null) {
                    this.dailyRecords = data;

                } else{
                    this.dailyRecords = [];
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    /**
     *
     * @public
     * @param {string} apiaryId
     * @memberof DailyRecordService
     */
    // Get recordTH by apiary for a date, and get records for date -3 days and date -7 days. Stock it into an array.
    public getRecThByApiaryByDateD3D7(apiaryId: string, date: Date): void {
        // Get recordTH by apiary for a date
        date.setDate(date.getDate() - 2);
        date.setHours(23);
        date.setMinutes(0);

        var tabDate: Date[];
        var previousDay: Date;
        previousDay = new Date();
        previousDay.setFullYear(date.getFullYear());
        previousDay.setMonth(date.getMonth());
        previousDay.setDate(date.getDate() + 1);
        previousDay.setHours(23);
        previousDay.setMinutes(0);
        tabDate = [date, previousDay];

        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + apiaryId, tabDate);
        this.dailyRecTabObs.subscribe(
            (data) => {
                if (data[0] != null) {
                    this.dailyRecordsDayD3D7[0] = data;

                }
            },
            (err) => {
                console.log(err);
            }
        );
        // Get recordTH by apiary for date -3 days
        date.setDate(date.getDate() - 3);

        previousDay = new Date();
        previousDay.setFullYear(date.getFullYear());
        previousDay.setMonth(date.getMonth());
        previousDay.setDate(date.getDate() + 1);
        previousDay.setHours(23);
        previousDay.setMinutes(0);
        tabDate = [date, previousDay];

        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + apiaryId, tabDate);
        this.dailyRecTabObs.subscribe(
            (data) => {
                if (data[0] != null) {
                    this.dailyRecordsDayD3D7[1] = data;

                }
            },
            (err) => {
                console.log(err);
            }
        );
        // Get recordTH by apiary for date -7 days
        date.setDate(date.getDate() - 4);

        previousDay = new Date();
        previousDay.setFullYear(date.getFullYear());
        previousDay.setMonth(date.getMonth());
        previousDay.setDate(date.getDate() + 1);
        previousDay.setHours(23);
        previousDay.setMinutes(0);
        tabDate = [date, previousDay];

        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + apiaryId, tabDate);
        this.dailyRecTabObs.subscribe(
            (data) => {
                if (data[0] != null) {
                    this.dailyRecordsDayD3D7[2] = data;

                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    /**
     *
     * @public
     * @param {string} hiveId
     * @returns {string}
     * @memberof DailyRecordService
     */
    public getColorByPourcent(hiveId?: string): any {
        const selectHive = this.dailyRecords.filter(elt => elt.hiveId === hiveId);
        //return (selectHive.length > 0) ? 'ruche ' + selectHive[0].health_status + selectHive[0].health_trend : 'ruche Inconnu';
        if (selectHive.length > 0 || selectHive[0] !== undefined && selectHive) {
            if (selectHive[0].brood > 85 && selectHive[0].brood <= 100) {
                return '#519504';
            } else if (selectHive[0].brood >70 && selectHive[0].brood <= 85) {
                return '#77bf02';
            } else if (selectHive[0].brood >50 && selectHive[0].brood <= 70) {
                return '#c4e203';
            }else if (selectHive[0].brood > 35 && selectHive[0].brood <= 50) {
                return '#ffdb01';
            } else if (selectHive[0].brood >= 20 && selectHive[0].brood <= 35) {
                return '#f58d08';
            } else {
                return 'red';
            }
        } else {
            return 'white';
        }
    }

    public getPourcentByHive(hiveId: string): string {
        const selectHive = this.dailyRecords.filter(elt => elt.hiveId === hiveId)[0];
        if(selectHive !== undefined){
            return selectHive.brood.toString().split('.')[0] + '%';
        }else{
            return '-';
        }
    }

    // get pourcent by hive for the current day, day -3 or day -7.
    public getPourcentByHiveDayD3D7(hiveId: string, index : number): any {
        const selectHive = this.dailyRecordsDayD3D7[index].filter(elt => elt.hiveId === hiveId)[0];
        if(selectHive !== undefined){
            if((selectHive.brood.toString().split('.')[1] !== undefined )&& (selectHive.brood.toString().split('.')[1][0] !== '0')){
                if (this.translateService.currentLang === 'fr'){
                    return selectHive.brood.toString().split('.')[0] + ',' + selectHive.brood.toString().split('.')[1][0] + '%';
                } else {
                    return selectHive.brood.toString().split('.')[0] + '.' + selectHive.brood.toString().split('.')[1][0] + '%';
                }
            }else{
                return selectHive.brood.toString().split('.')[0] + '%';
            }
        }else{
            return null
        }
    }

    /**
     * 
     * @param hiveId 
     * @param range 
     */
    public getTempIntMaxByHive(hiveId: string, range: Date[], unit: string): Observable<any[]> {
        return this.http.get<any[]>(CONFIG.URL + `dailyRecordsTH/tMax/${hiveId}/${range[0].getTime()}/${range[1].getTime()}`).pipe(
            map((_elt) => {
              _elt.forEach(_x => {
                return _x.values.map(_val => {
                  _val.temp_int_max = _val.temp_int_max !== NaN ? this.unitService.convertTempFromUsePref(_val.temp_int_max, unit): null;
                });
              });
              return _elt;
            })
          );
    }
    /**
     * 
     * @param hiveId 
     * @param range 
     */
    public getHintByHive(hiveId: string, range: Date[]): Observable<any> {
        return this.http.get<any[]>(CONFIG.URL + `dailyRecordsTH/hInt/${hiveId}/${range[0].getTime()}/${range[1].getTime()}`)
    }

    /**
     * 
     * @param hiveId 
     * @param range 
     */
    public getBroodByHive(hiveId: string, range: Date[]): Observable<any[]> {
        return this.http.get<any[]>(CONFIG.URL + `dailyRecordsTH/brood/${hiveId}/${range[0].getTime()}/${range[1].getTime()}`);
    }

    /**
     * 
     * @param hiveId 
     * @param range 
     */
    public getTminByHive(hiveId: string, range: Date[], unit): Observable<any[]> {
        return this.http.get<any[]>(CONFIG.URL + `dailyRecordsTH/tMin/${hiveId}/${range[0].getTime()}/${range[1].getTime()}`).pipe(
            map((_elt) => {
              _elt.forEach(_x => {
                return _x.values.map(_val => {
                  _val.temp_int_min = _val.temp_int_min !== NaN ? this.unitService.convertTempFromUsePref(_val.temp_int_min, unit): null;
                });
              });
              return _elt;
            })
          );
    }


}