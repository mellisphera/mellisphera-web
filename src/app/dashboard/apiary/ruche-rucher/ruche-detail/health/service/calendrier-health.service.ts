import { Injectable } from '@angular/core';
import { DailyRecordService } from '../../../../../service/dailyRecordService';
import { type } from 'os';
import { webSocket } from 'rxjs/webSocket';
import { CONFIG } from '../../../../../../../config';
import { CalendrierService } from '../../service/calendrier.service';
import { MyDate } from '../../../../../../class/MyDate';
//import { ECharts } from 'echarts';
import { UserParamsService } from '../../../../../preference-config/service/user-params.service';
import { UnitService } from '../../../../../service/unit.service';
import { GraphGlobal } from '../../../../../graph-echarts/GlobalGraph';

@Injectable({
    providedIn: 'root'
})
export class CalendrierHealthService {

    option: any;

    constructor(private unitService: UnitService, private graphGlobal: GraphGlobal) {
        this.option = {
            backgroundColor: 'white',
            title: {
                top: 5,
                text: this.graphGlobal.getTitle("BroodDynamics"),
                left: 'center',
                textStyle: {
                    color: 'black'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    return params.marker + unitService.getDailyDate(params.data[0]) + '<br/>' + params.data[1] + ' %';
                }
            },
            toolbox: {
                orient: 'vertical',
                itemSize: 15,
                top: 'middle',
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calendar: [{
                top: 100,
                left: '3%',
                bottom: '3%',
                height: '45%',
                width: '92%',
                range: MyDate.getRangeForCalendar(),
                orient: 'horizontal',
                cellSize: ['20', '20'],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#000',
                        width: 2,
                        type: 'solid'
                    }
                },
/*                 visualMap: {
                    calculable: true,
                    min: 0,
                    max: 100,
                    orient: 'horizontal',
                    top : 100,
                    itemWidth : 15,
                    itemSymbol : 'diamond',
                    left: 'center',
                    inRange: {
                        color: ['red', '#FD6204', 'yellow',
                        '#63C908', '#498513']
                    }
                }, */
                dayLabel: {
                    nameMap: this.graphGlobal.getDays(),
                    firstDay: 1, // start on Monday
                },
                yearLabel: {
                    formatter: '{start}-{end}',
                    show: false,
                    margin: 40,
                    orient: 'horizontal',
                    top : 30,
                    itemWidth : 15,
                    itemSymbol : 'diamond',
                    left: 'center',
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
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
            }
        };

    }


}
