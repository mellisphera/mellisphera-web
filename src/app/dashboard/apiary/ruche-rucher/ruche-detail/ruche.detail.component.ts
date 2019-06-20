import { RucherService } from '../../../service/rucher.service';
import { DataRange } from './service/Record/data-range';
import { MyDate } from '../../../../class/MyDate';
import { Component, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserloggedService } from '../../../../userlogged.service';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { DailyRecordsWService } from './service/daily-records-w.service';
import { DailyStockHoneyService } from './service/daily-stock-honey.service';
import { RecordService } from './service/Record/record.service';
import { DailyRecordService } from '../../../service/dailyRecordService';
import { RucheService } from '../../../service/ruche.service';
import { ObservationService } from './observation/service/observation.service';
import { CONFIG } from '../../../../../constants/config';
import { CalendrierTempIntService } from './daily/service/calendrier-temp-int.service';
import { AtokenStorageService } from '../../../../auth/Service/atoken-storage.service';
import { RucheInterface } from '../../../../_model/ruche';
import { GraphStackService } from './stack/service/graph-stack.service';
import { GraphRecordService } from './hourly/service/graph-record.service';
import { GrapheReserveMielService } from './stock/service/graphe-reserve-miel.service';
import { CalendrierPoidsService } from './stock/service/calendrier-poids.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UnitService } from '../../../service/unit.service';
import { UserParamsService } from '../../../preference-config/service/user-params.service';


@Component({
    selector: 'app-ruche-detail',
    templateUrl: './ruche.detail.component.html',
    styleUrls: ['./ruche.detail.component.scss'],
})

export class RucheDetailComponent implements OnInit, OnDestroy {


    public loadingStockHoney: boolean;
    public loaddingHourly: boolean;
    public loadingStack: boolean;

    message: string;
    hiveSelect: RucheInterface;
    compteurHive: number;
    currentTab: string;
    public img: string;
    private merge: any;
    public range: DataRange;
    private echartInstance: any;
    public ranges: DataRange[];
    constructor(private activatedRoute: ActivatedRoute,
        private route: Router,
        public rucheService: RucheService,
        private observationService: ObservationService,
        public dailyRecordThService: DailyRecordService,
        public dailyRecordWservice: DailyRecordsWService,
        public dailyStockHoneyService: DailyStockHoneyService,
        public recordService: RecordService,
        public userService: UserloggedService,
        public tokenService: AtokenStorageService,
        public calendrierTempInt: CalendrierTempIntService,
        public calendrierPoids: CalendrierPoidsService,
        public grapheMielService: GrapheReserveMielService,
        public graphStack: GraphStackService,
        public graphRecordService: GraphRecordService,
        private userConfig: UserParamsService) {
        this.compteurHive = 0;
        this.currentTab = 'notes';
        this.hiveSelect = {
            id: null,
            name: '....',
            description: '',
            idUsername: '',
            username: '',
            idApiary: '',
            hivePosX: '',
            hivePosY: '',
            sharingUser: []
        };
        this.merge = {
            series: [],
            legend: {
                data: []
            }
        };
        this.ranges = [
            { scale: 3, type: 'DAY' },
            { scale: 7, type: 'DAY' },
            { scale: 15, type: 'DAY' },
            { scale: 30, type: 'DAY' },
            { scale: 3, type: 'MONTH' },
            { scale: 6, type: 'MONTH' },
            { scale: 1, type: 'YEAR' }
        ];
        this.range = this.ranges[0];
        this.observationService.setRange(this.ranges[4]);
        this.recordService.setRange(this.range);
        this.message = '';
        this.img = CONFIG.URL_FRONT + 'assets/icons/next-button-4.png';
    }

    ngOnInit() {
        this.userConfig.getSubject().subscribe(
            data => {
                this.recordService.setUnitSystem(data.unitSystem);
                this.dailyRecordThService.setUnitSystem(data.unitSystem);
                this.dailyRecordWservice.setUnitSystem(data.unitSystem);
                this.dailyStockHoneyService.setUnitSystem(data.unitSystem);
            }
        )
        if (!this.observationService.obsHiveSubject.closed) {
            this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive()).subscribe();
        }
        if (!this.rucheService.hiveSubject.closed) {
            this.rucheService.hiveSubject.subscribe(() => { }, () => { }, () => {
                this.rucheService.findRucheById(this.rucheService.getCurrentHive(), (hive) => {
                    this.hiveSelect = hive[0];
                    this.compteurHive = this.rucheService.ruches.indexOf(this.hiveSelect);
                    this.rucheService.saveCurrentHive(this.hiveSelect.id);
                }, (err: string) => {
                    console.log(err);
                });
            });
        }
    }

    onChartInit($event: any) {
        this.echartInstance = $event;
    }

    receiveMessage($event) {
        this.message = $event;
    }
    /**
     *
     *
     * @memberof RucheDetailComponent
     */
    previousHive(): void {
        if (this.compteurHive !== 0 && this.compteurHive !== -1) {
            this.compteurHive--;
            this.hiveSelect = this.rucheService.ruches[this.compteurHive];
            this.rucheService.saveCurrentHive(this.hiveSelect.id);
            this.exeData(true);
        }

    }

    /**
     *
     *
     * @memberof RucheDetailComponent
     */
    nextHive(): void {
        if (this.compteurHive != this.rucheService.ruches.length - 1) {
            this.compteurHive++;
        }
        this.hiveSelect = this.rucheService.ruches[this.compteurHive];
        this.rucheService.saveCurrentHive(this.hiveSelect.id);
        this.exeData(true);
    }

    /**
     *
     *
     * @memberof RucheDetailComponent
     */
    updateEchartInstance(): void {
        const option = this.echartInstance.getOption();
        this.echartInstance.clear();
        if (this.currentTab === 'stock') {
            option.series = this.dailyStockHoneyService.mergeOption.series;
            option.legend.data = this.dailyStockHoneyService.mergeOption.legend.data;
        } else {
            option.series = this.recordService.mergeOptionHourly.series;
            option.legend.data = this.recordService.mergeOptionHourly.legend.data;
        }
        this.echartInstance.setOption(option);
    }
    selectRange(page?: string) {
        this.recordService.setRange(this.range);
        this.loaddingHourly = !this.loaddingHourly;
        this.recordService.getHourlyByHive(this.rucheService.getCurrentHive())
            .subscribe(
                (record) => {
                    this.recordService.mergeOptionHourly = record;
                }, () => { }, () => {
                    this.loaddingHourly = !this.loaddingHourly;
                }
            );
    }

    onTab(event: string) {
        this.currentTab = event;
        this.exeData();
    }

    /**
     *
     *
     * @returns {Promise<Boolean>}
     * @memberof RucheDetailComponent
     */
    checkHiveActive(): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            if (this.dailyStockHoneyService.currentIdHive !== this.rucheService.getCurrentHive()) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    }
    exeData(switchHive?: boolean) {
        if (this.currentTab.indexOf('notes') !== -1) {
            this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive()).subscribe();
        }

        else if (this.currentTab.indexOf('daily') !== -1) {
            this.dailyRecordThService.getByIdHive(this.rucheService.getCurrentHive());
            this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.getCurrentHive());
        }
        else if (this.currentTab.indexOf('stock') !== -1) {
            this.checkHiveActive().then(() => {
                this.loadingStockHoney = true;
                this.dailyStockHoneyService.getDailyStockHoneyByHIve(this.rucheService.getCurrentHive())
                    .subscribe(merge => {
                        this.dailyStockHoneyService.mergeOption = merge;
                        if (switchHive) {
                            this.updateEchartInstance();
                        }
                    },
                        err => {
                            this.dailyStockHoneyService.cleanMerge();
                            this.loadingStockHoney = false;
                            this.echartInstance.clear();
                        },
                        () => {
                            this.loadingStockHoney = false;
                        });
                this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.getCurrentHive());
            });
        }
        else if (this.currentTab.indexOf('hourly') !== -1) {
            this.checkHiveActive().then(() => {
                this.loaddingHourly = true;
                this.recordService.getHourlyByHive(this.rucheService.getCurrentHive())

                    .subscribe(
                        (record) => {
                            this.recordService.mergeOptionHourly = record;
                            if (switchHive) {
                                this.updateEchartInstance();
                            }
                        },
                        () => { }, () => {
                            this.loaddingHourly = false;
                        }
                    );
            });
        }
        else if (this.currentTab.indexOf('health') !== -1) {
            this.dailyRecordThService.getByIdHive(this.rucheService.getCurrentHive());
        }
    }
    ngOnDestroy() {
        //this.rucheService.hiveSubject.unsubscribe();
        //this.observationService.obsHiveSubject.unsubscribe();
        //this.observationService.obsApiarySubject.unsubscribe();
    }

    traduction(type : any) : String{
        var texte : String;
        switch (type) {
            case 'DAY' : {
                texte = this.userService.getJwtReponse().country === "FR" ? 'jours' : 'days';
                break;
            }
            case 'MONTH' : {
                texte = this.userService.getJwtReponse().country === "FR" ? 'mois' : 'months';
                break;
            }
            case 'YEAR' : {
                texte = this.userService.getJwtReponse().country === "FR" ? 'an' : 'year';
                break;
            }
            default: {
                texte = 'Erreur traduction';
            }
        }

        return(texte);
    }

}
