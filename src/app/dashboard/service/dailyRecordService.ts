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
    public mergeOptionCalendarHealth: any;

    constructor(private http: HttpClient, private user: UserloggedService) {
        this.statusLoading = false;
        this.rangeDailyRecord = new Date();
        this.arrayTempInt = [];
        this.arrayHint = [];
        this.arrayHealth = [];
        this.rangeDailyRecord.setDate(new Date().getDate() - 1);
        if (this.user.getUser()) {
            this.getDailyRecThByApiary(sessionStorage.getItem('currentApiary'));
        }
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
            this.arrayTempInt = daily.filter(elt => elt.temp_int_max !== null).map(eltMap => [eltMap.recordDate, eltMap.temp_int_max]);
            this.arrayHint = daily.filter(elt => elt.humidity_int_max !== null).map(eltMap => [eltMap.recordDate, eltMap.humidity_int_max]);
            this.arrayHealth = daily.map(elt => [elt.recordDate, elt.health_status, elt.health_trend]);
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
        this.getDailyRecThByApiary(idApiary);
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
                data: this.arrayTempInt
            },
            title: {
                text: 'Internal Temperature (max, °C)'
            },
            visualMap: {
                calculable: true,
                min: -10,
                max: 40,
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
    public getStatus(idHive: string): string {
        const selectHive = this.dailyRecords.filter(elt => elt.idHive === idHive);
        return (selectHive.length > 0) ? 'ruche ' + selectHive[0].health_status + selectHive[0].health_trend : 'ruche Inconnu';
    }
}