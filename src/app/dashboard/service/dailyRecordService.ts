/**
 * @author mickael
 * @description Ensemble des requetes pour la record Journalier des ruches
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

    arrayTempInt: any[];
    arrayHint: any[];
    arrayHealth: any[];
    status: string;
    dailyRecord: DailyRecordTh;
    dailyRecords: DailyRecordTh[] = null;

    statusLoading: boolean;

    mergeOptionTint: any;
    mergeOptionHint: any;
    mergeOptionCalendarHealth: any;

    constructor(private http: HttpClient, private user: UserloggedService) {
        this.statusLoading = false;
        this.status = 'Inconnu';
        if (this.user.getUser()) {
            this.getDailyRecThByApiary(sessionStorage.getItem('currentApiary'));
        }
    }
    getByIdHive(idHive) {
        this.dailyRecords = [];
        this.dailyRecObsArray = this.http.get<DailyRecordTh[]>(CONFIG.URL + '/dailyRecordsTH/hive/' + idHive);
        this.dailyRecObsArray.subscribe(
            (data) => {
                this.dailyRecords = data;
                this.dailyRecordToArray();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    dailyRecordToArray() {
        this.arrayTempInt = [];
        this.arrayHint = [];
        this.arrayHealth = [];
        this.dailyRecords.forEach(element => {
            this.arrayTempInt.push([element.recordDate, element.temp_int_max]);
            this.arrayHint.push([element.recordDate, element.humidity_int_max]);
            this.arrayHealth.push([element.recordDate, element.health_status, element.health_trend]);
        });
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

    getDailyRecThByApiary(idApiary) {
        this.dailyRecTabObs = this.http.get<DailyRecordTh[]>(CONFIG.URL + 'dailyRecordsTH/apiary/' + idApiary);
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

    getStatus(idHive: string) {
        this.status = 'ruche Inconnu';
        this.verifId(idHive);
        return this.status;
    }

    verifId(idHive: string) {
        this.dailyRecords.forEach((element, index) => {
            if (element.idHive === idHive) {
                this.status = 'ruche ' + element.health_status + element.health_trend;
            }
        });
    }

    convertDate(date: string) {
        var dateIso = new Date(date);
        var jour = '' + dateIso.getDate();
        var mois = '' + (dateIso.getMonth() + 1);
        var anee = dateIso.getFullYear();
        if (parseInt(jour) < 10) { jour = '0' + jour; }
        if (parseInt(mois) < 10) { mois = '0' + mois; }

        return anee + '-' + mois + '-' + jour;
    }


}