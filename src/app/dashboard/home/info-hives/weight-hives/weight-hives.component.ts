import { OnDestroy } from '@angular/core';
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

import { Component } from '@angular/core';
import { DailyRecordsWService } from '../../../service/api/daily-records-w.service';
import { CalendrierPoidsService } from '../../../service/api/calendrier-poids.service';
import { RucheService } from '../../../service/api/ruche.service';
import { DailyStockHoneyService } from '../../../service/api/daily-stock-honey.service';
import { MyDate } from '../../../../class/MyDate';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { MEDIA_QUERY_MELLIUX } from '../../../../dashboard/melli-charts/charts/MEDIA';
import * as echarts from 'echarts';

@Component({
    selector: 'app-weight-hives',
    templateUrl: './weight-hives.component.html',
    styleUrls: ['./weight-hives.component.css']
})
export class WeightHivesComponent implements OnDestroy{
    option: any;
    echartInstance: any;
    constructor(public dailyRecordWservice: DailyRecordsWService,
        public calendrierPoids: CalendrierPoidsService,
        public rucheService: RucheService,
        public dailyStockHoneyService: DailyStockHoneyService,
        private unitService: UnitService,
        private graphGlobal: GraphGlobal) {
        this.option = {
            baseOption: {
                //backgroundColor: 'white',
                title: {
                    top: 0,
                    text: this.graphGlobal.getTitle("INCOME"),
                    left: 'center',
                    textStyle: {
                        color: 'black',
                        fontWeight: 'normal',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (params: any) => {
                        return params.marker + this.unitService.getDailyDate(params.data[0]) +
                            '<br/>' + params.seriesName + ' : ' + this.graphGlobal.getNumberFormat(this.unitService.getValRound(params.data[1])) + ' ' + this.graphGlobal.weight.unitW;
                    },
                    alwaysShowContent: false,
                    displayMode: "single",
                    renderMode: "auto",
                    showDelay: 0,
                    hideDelay: 100,
                    transitionDuration: 0.4,
                },
                toolbox: {
                    orient: 'vertical',
                    itemSize: 0,
                    top: 'middle',
                    feature: {
                        dataView: { show: false, readOnly: false },
                        restore: { show: false },
                        saveAsImage: { show: false }
                    }
                },
                legend: {
                    top: 30,
                    left: 'center',
                    data: [this.graphGlobal.getTitle('GAIN'), this.graphGlobal.getTitle("LOSS")],
                    textStyle: {
                        color: 'black'
                    }
                },
                calendar: [{
                    top: 80,
                    left: 'center',
                    //height:'auto',
                    cellSize: [40, 40],
                    range: MyDate.getRangeForCalendarAlerts(),
                    orient: 'vertical',
                    /*cellSize: 'auto',
                    height:'200',*/
                    //  width:'95%',
                    // top:70,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    dayLabel: {
                        nameMap: this.graphGlobal.getDays(),
                        firstDay: 1, // start on Monday,
                        margin: 10,
                        position: 'end',
                        show: false,

                    },
                    monthLabel: {
                        nameMap: this.graphGlobal.getMonth()
                    },
                    yearLabel: {
                        formatter: '{start}-{end}',
                        show: false,
                        margin: 40,
                        textStyle: {
                            color: 'black'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#EBEBEB',
                            borderWidth: 1,
                            borderColor: '#111'
                        }
                    }
                }],
                series: [
                    {
                        name: this.graphGlobal.getTitle('gain'),
                        type: 'effectScatter',
                        coordinateSystem: 'calendar',
                        data: '',
                        symbolSize: (val: Array<any>) => {
                            if (val[1] >= 0) {
                                if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                                    return (0.5 * Math.sqrt((1000 * val[1])));
                                } else {
                                    return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
                                }
                            }
                            else { return 0; }
                        },
                        showEffectOn: 'emphasis',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: '#00FE0C'
                            }
                        }
                    },
                    {
                        name: this.graphGlobal.getTitle("loss"),
                        type: 'effectScatter',
                        coordinateSystem: 'calendar',
                        data: '',
                        symbolSize: (val: Array<any>) => {
                            if (val[1] < 0) {
                                if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                                    return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
                                } else {
                                    return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
                                }
                            }
                            else { return 0; }
                        },
                        showEffectOn: 'emphasis',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,

                        itemStyle: {
                            normal: {
                                color: '#FE0000'

                            }
                        }
                    },

                ]
            },
            media: JSON.parse(JSON.stringify(MEDIA_QUERY_MELLIUX))
        };
        this.option.baseOption.series.push(this.graphGlobal.getYesterdaySerie());
    }

    convertDate(date: Date) {
        var jour = '' + date.getDate();
        var mois = '' + (date.getMonth() + 1);
        var anee = date.getFullYear();
        if (parseInt(jour) < 10) { jour = '0' + jour; }
        if (parseInt(mois) < 10) { mois = '0' + mois; }

        return anee + '-' + mois + '-' + jour;
    }

    ngOnInit(): void {
        this.echartInstance = echarts.init(<HTMLDivElement>document.getElementById('calendrierPoids'));
        this.option.baseOption.calendar[0].range = MyDate.getRangeForCalendarAlerts();
        this.echartInstance.showLoading();
    }

    initGraph(): void{
        this.option.baseOption.calendar[0].range = MyDate.getRangeForCalendarAlerts();
        this.option.baseOption.series = new Array();
    }

    onResize() {
        this.echartInstance.resize({
          width: 'auto',
          height: 'auto'
        });
    }

    ngOnDestroy(): void{
      this.echartInstance.dispose();
    }

}
