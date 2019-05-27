/**
 * @author mickael
 * @description Ensemble des requetes pour les records Journalier des ruches
 *
 */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyRecordTh } from '../../_model/daily-record-th';
import { CONFIG } from '../../../config';
import { UserloggedService } from '../../userlogged.service';
import { UnitService } from './unit.service';

@Injectable()
export class DailyRecordService {
    dailyRecObs: Observable<DailyRecordTh>;
    dailyRecObsArray: Observable<DailyRecordTh[]>;
    dailyRecTabObs: Observable<DailyRecordTh[]>;

    private arrayTempInt: any[];
    private arrayHint: any[];
    private arrayHealth: any[];
    public dailyRecords: DailyRecordTh[];
    public statusLoading: boolean;
    public rangeDailyRecord: Date;
    public mergeOptionTint: any;
    public mergeOptionHint: any;
    private unitSystem: string;
    public mergeOptionCalendarHealth: any;

    constructor(private http: HttpClient, private user: UserloggedService, private unitService: UnitService) {
        this.statusLoading = false;
        this.rangeDailyRecord = new Date();
        this.arrayTempInt = [];
        this.arrayHint = [];
        this.arrayHealth = [];
        this.rangeDailyRecord.setDate(new Date().getDate() - 1);
        this.rangeDailyRecord.setHours(0);
        this.rangeDailyRecord.setMinutes(0);
        if (this.user.getUser()) {
            this.getDailyRecThByApiary(sessionStorage.getItem('currentApiary'));
        }
    }

    getByHive(idHive: string) {
        console.log(this.unitSystem);
        return this.http.get<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/hive/' + idHive).map(res => {
            this.arrayTempInt = res.filter(elt => elt.temp_int_max !== null).
            map(eltMap => [eltMap.recordDate, this.unitService.convertTempFromUsePref(eltMap.temp_int_max, this.unitSystem)]);
            this.arrayHint = res.filter(elt => elt.humidity_int_max !== null).map(eltMap => [eltMap.recordDate, eltMap.humidity_int_max]);
            this.arrayHealth = res.map(elt => [elt.recordDate, elt.health_status, elt.health_trend]);
            return {
                tempInt: {
                    series: {
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data: this.arrayTempInt
                    },
                    title: {
                        text: 'Internal Temperature (max, °C)'
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
                        text: 'Internal Relative Humidity (max)'
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
                        type: 'custom',
                        coordinateSystem: 'calendar',
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
        this.dailyRecords = [];
        this.http.get<DailyRecordTh[]>(CONFIG.URL + '/dailyRecordsTH/hive/' + idHive).map(daily => {
            this.arrayTempInt = daily.filter(elt => elt.temp_int_max !== null).
            map(eltMap => [eltMap.recordDate, this.unitService.convertTempFromUsePref(eltMap.temp_int_max, this.unitSystem)]);
            this.arrayHint = daily.filter(elt => elt.humidity_int_max !== null).map(eltMap => [eltMap.recordDate, eltMap.humidity_int_max]);
            this.arrayHealth = daily.map(elt => [elt.recordDate, elt.vitality, elt.health_trend]);
            return daily;
        })
        .subscribe(
            (data) => {
                this.dailyRecords = data;
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
    public nextDay(idApiary: string): void{
        this.rangeDailyRecord.setDate(this.rangeDailyRecord.getDate() + 1);
        this.rangeDailyRecord.setHours(0);
        this.rangeDailyRecord.setMinutes(0);
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
        this.rangeDailyRecord.setHours(0);
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
            }
        };
        this.mergeOptionTint = {
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: this.arrayTempInt
            },
            title: {
                text: 'Internal Temperature (max, ' + (this.unitSystem === 'METRIX' ? '°C' : '°F') + ')'
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
                text: 'Internal Relative Humidity (max)'
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
        this.dailyRecTabObs = this.http.post<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + idApiary, this.rangeDailyRecord);
        this.dailyRecords = [];
        this.dailyRecTabObs.subscribe(
            (data) => {
                if (data[0] != null) {
                    this.dailyRecords = data;
                    console.log(this.dailyRecords);

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
            if (selectHive[0].vitality >= 95 && selectHive[0].vitality <= 100) {
                return '#498513';
            } else if (selectHive[0].vitality >= 90 && selectHive[0].vitality <= 95) {
                return '#63C908';
            } else if (selectHive[0].vitality >= 75 && selectHive[0].vitality <= 90) {
                return 'yellow';
            } else if (selectHive[0].vitality >= 60 && selectHive[0].vitality <= 75) {
                return '#FD6204';
            } else {
                return 'red';
            }
        } else {
            return 'white';
        }
    }

    public getPourcentByHive(idHive: string): any {
        const selectHive = this.dailyRecords.filter(elt => elt.idHive === idHive)[0];
        return selectHive !== undefined ? selectHive.vitality + ' %' : null;

    }
}