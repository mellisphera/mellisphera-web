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

@Injectable({
    providedIn: 'root'
})
export class CalendrierHealthService {

    option: any;

    constructor(private unitService: UnitService) {
        this.option = {
            backgroundColor: 'white',
            title: {
                top: 5,
                text: 'Brood Dynamics',
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
            legend: {
                top: '30',
                textStyle: {
                    color: 'black'
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
                        width: 4,
                        type: 'solid'
                    }
                },
                dayLabel: {
                    nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    firstDay: 1, // start on Monday
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
            series: {
                type: 'custom',
                coordinateSystem: 'calendar',
                renderItem: this.renderItem,
            }
        };

    }

    renderItem(params, api) {
        const cellPoint = api.coord(api.value(0));
        const cellWidth = params.coordSys.cellWidth;
        const cellHeight = params.coordSys.cellHeight;
        var img;
        var color;
        if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return;
        }
        img = 'M 100, 100m -75, 0a 75,75 0 1,0 150,0a 75,75 0 1,0 -150,0';
        if (api.value(1) >= 95 && api.value(1) <= 100) {
            color = '#498513';
        } else if (api.value(1) >= 90 && api.value(1) <= 95) {
            color = '#63C908';
        } else if (api.value(1) >= 75 && api.value(1) <= 90) {
            color = 'yellow';
        } else if (api.value(1) >= 60 && api.value(1) <= 75) {
            color = '#FD6204';
        } else {
            color = 'red';
        }
        const group = {
            type: 'group',
            children: [{
              type: 'path',
              shape: {
                pathData: img,
                x: -8,
                y: -9,
                width: 20,
                height: 20
              },
              position: [cellPoint[0], cellPoint[1]],
              style: api.style({
                fill: color
              })
            }]
        };
        return group;
    }

}
