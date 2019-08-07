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
            this.rucherService.rucherSubject.subscribe(() => {}, () => {}, () => {
                console.log(sessionStorage.getItem('currentApiary'));
                this.getDailyRecThByApiary(sessionStorage.getItem('currentApiary'));
            });
        }
    }

    getByHive(idHive: string) {
        return this.http.get<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/hive/' + idHive).map(res => {
            this.arrayTempInt = res.filter(elt => elt.temp_int_max !== null).
                map(eltMap => [eltMap.recordDate, this.unitService.convertTempFromUsePref(eltMap.temp_int_max, this.unitSystem, false)]);
            this.arrayHint = res.filter(elt => elt.humidity_int_max !== null).map(eltMap => [eltMap.recordDate, eltMap.humidity_int_max]);
            this.arrayHealth = res.map(elt => [elt.recordDate, elt.brood]);
            return {
                tempInt: {
                    series: {
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data: this.arrayTempInt
                    },
                    title: {
                        text: this.graphGlobal.getTitle("InternalTemperature") + '(max, °C)'
                    },
                    visualMap: {
                        calculable: true,
                        min: this.unitSystem === 'METRIC' ? -10 : 50,
                        max: this.unitSystem === 'METRIC' ? 40 : 100,
                        inRange: {
                            /* color: ['#abd9e9', '#CC0000'] */
                            color: ['#313695', '#4575b4', '#74add1',
                                '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        }
                    },
                },
                hInt: {
                    series: {
                        data: this.arrayHint
                    },
                    title: {
                        text: this.graphGlobal.getTitle("InternalRelativeHumidity")
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
                },
                health: {
                    series: {
                        data: this.arrayHealth,
                        type: 'heatmap',
                    }
                }
            }
        })
    }
    /**
     *
     * @public
     * @param {string} idHive
     * @memberof DailyRecordService
     */
    public getByIdHive(idHive: string): void {
        this.dailyRecordsGraph = [];
        this.http.get<DailyRecordTh[]>(CONFIG.URL + '/dailyRecordsTH/hive/' + idHive).map(daily => {
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
     * @param {string} idApiary
     * @memberof DailyRecordService
     */
    public nextDay(idApiary: string): void {
        this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() + 1);
        this.rangeDailyRecord.setHours(23);
        this.rangeDailyRecord.setMinutes(0);
        this.rangeDailyRecord.setSeconds(0);
        this.getDailyRecThByApiary(idApiary);

    }
    /**
     *
     * @public
     * @param {string} idApiary
     * @memberof DailyRecordService
     */
    public previousDay(idApiary: string): void {
        this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() - 1);
        this.rangeDailyRecord.setHours(23);
        this.rangeDailyRecord.setMinutes(0);
        this.getDailyRecThByApiary(idApiary);
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
                top: 30,
                itemWidth: 15,
                itemSymbol: 'diamond',
                left: 'center',
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
     * @param {string} idApiary
     * @memberof DailyRecordService
     */
    public getDailyRecThByApiary(idApiary: string): void {
        var tabDate: Date[];
        var previousDay: Date;
        previousDay = new Date();
        previousDay.setFullYear(this.rangeDailyRecord.getFullYear());
        previousDay.setMonth(this.rangeDailyRecord.getMonth());
        previousDay.setDate(this.rangeDailyRecord.getDate() + 1);
        previousDay.setHours(23);
        previousDay.setMinutes(0);
        tabDate = [this.rangeDailyRecord, previousDay];
        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + idApiary, tabDate);
        this.dailyRecTabObs.subscribe(
            (data) => {
                if (data[0] != null) {
                    this.dailyRecords = data;

                }else{
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
     * @param {string} idApiary
     * @memberof DailyRecordService
     */
    // Get recordTH by apiary for a date, and get records for date -3 days and date -7 days. Stock it into an array.
    public getRecThByApiaryByDateD3D7(idApiary: string, date: Date): void {
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

        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + idApiary, tabDate);
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

        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + idApiary, tabDate);
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

        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + idApiary, tabDate);
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
     * @param {string} idHive
     * @returns {string}
     * @memberof DailyRecordService
     */
    public getColorByPourcent(idHive?: string): any {
        const selectHive = this.dailyRecords.filter(elt => elt.idHive === idHive);
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

    public getPourcentByHive(idHive: string): any {
        const selectHive = this.dailyRecords.filter(elt => elt.idHive === idHive)[0];
        return selectHive !== undefined ? selectHive.brood + ' %' : null;

    }

    // get pourcent by hive for the current day, day -3 or day -7.
    public getPourcentByHiveDayD3D7(idHive: string, index : number): any {
        const selectHive = this.dailyRecordsDayD3D7[index].filter(elt => elt.idHive === idHive)[0];
        return selectHive !== undefined ? selectHive.brood + ' %' : null;
    }

    /**
     * 
     * @param idHIve 
     * @param range 
     */
    public getTempIntMaxByHive(idHIve: string, range: Date[]): Observable<any[]> {
        return this.http.post<any[]>(CONFIG.URL + 'dailyRecordsTH/tMax/' + idHIve, range).map(_elt => _elt.map(_value => {
            return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef};
        }));
    }
    /**
     * 
     * @param idHIve 
     * @param range 
     */
    public getHintByHive(idHIve: string, range: Date[]): Observable<any> {
        return this.http.post<any[]>(CONFIG.URL + 'dailyRecordsTH/hInt/' + idHIve, range);
    }

    /**
     * 
     * @param idHive 
     * @param range 
     */
    public getBroodByHive(idHive: string, range: Date[]): Observable<any[]> {
        return this.http.post<any[]>(CONFIG.URL + 'dailyRecordsTH/brood/' + idHive, range);
    }

    /**
     * 
     * @param idHive 
     * @param range 
     */
    public getTminByHive(idHive: string, range: Date[]): Observable<any[]> {
        return this.http.post<any[]>(CONFIG.URL + 'dailyRecordsTH/tMin/' + idHive, range).map(_elt => _elt.map(_value => {
            return { date: _value.date, value: this.unitService.convertTempFromUsePref(_value.value, this.unitSystem), sensorRef: _value.sensorRef};
        }));
    }


}