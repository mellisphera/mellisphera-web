import { Injectable } from '@angular/core';
import { DailyRecordService } from '../../../../../service/dailyRecordService';
import { type } from 'os';
import { webSocket } from 'rxjs/webSocket';
import { CONFIG } from '../../../../../../../config';
import { CalendrierService } from '../../service/calendrier.service';
import { MyDate } from '../../../../../../class/MyDate';
//import { ECharts } from 'echarts';
import { ICON } from './icon';

@Injectable({
    providedIn: 'root'
})
export class CalendrierHealthService {

    option: any;

    constructor() {
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
                trigger: 'axis',
                formatter: (params) => {
                    console.log(params.data);
                    return params.data[0] + '<br/>' + params.data[2];
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
        var cellPoint = api.coord(api.value(0));
        console.log(cellPoint);
        var cellWidth = params.coordSys.cellWidth;
        var cellHeight = params.coordSys.cellHeight;
        var img;
        var value = api.value(1);
        if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return;
        }
        switch (api.value(1)) {
            case 'statusC':
                if (api.value(2) === 'Fluctuation') {
                    img = ICON.wfbfl;
                    // img = 'wfbfl';
                }
                else if (api.value(2) === 'Decline') {
                    img = ICON.wfbde;
                    // img = 'wfbde';
                }
                else if (api.value(2) === 'Stable') {
                    img = ICON.wfbst;
                    // img = 'wfbst';
                }
                else if (api.value(2) === 'Improve') {
                    img = ICON.wfbim;
                    // img = 'wfbim';
                }
                break;
            case 'statusB':
                if (api.value(2) === 'Fluctuation') {
                    img = ICON.wnbfl;
                    // img = 'wnbfl';
                }
                else if (api.value(2) === 'Decline') {
                    img = ICON.wnbde;
                    // img = 'wnbde';
                }
                else if (api.value(2) === 'Stable') {
                    img = ICON.wnbst;
                    // img = 'wnbst';
                }
                else if (api.value(2) === 'Improve') {
                    img = ICON.wnbim;
                    // img = 'wnbim';
                }
                break;
            case 'statusA':
                if (api.value(2) === 'Fluctuation') {
                    img = ICON.wobfl;
                    // img = 'wobfl';
                }
                else if (api.value(2) === 'Improve') {
                    img = ICON.wobim;
                    // img = 'wobim.';
                }
                break;
            default:
                img = ICON.wos;
        }
        console.log(img);
        // img = 'M 30.302,-17.672 C 22.73,-26.3 12.531,-32.546 0.939,-35.115 c -2.161,5.888 -3.272721,12.678295 -3.272721,19.305295 0,5.663 0.864,11.1260003 2.39786051,16.03985264 C 11.983,-2.433 22.524,-8.81 30.302,-17.672 ZM 30.302,-17.672 C 22.73,-26.3 12.531,-32.546 0.939,-35.115 c -2.161,5.888 -3.272721,12.678295 -3.272721,19.305295 0,5.663 0.864,11.1260003 2.39786051,16.03985264 C 11.983,-2.433 22.524,-8.81 30.302,-17.672 Z';
        img = 'M 30.302,-17.672 C 22.73,-26.3 12.531,-32.546 0.939,-35.115 c -2.161,5.888 -3.272721,12.678295 -3.272721,19.305295 0,5.663 0.864,11.1260003 2.39786051,16.03985264 C 11.983,-2.433 22.524,-8.81 30.302,-17.672 ZM 30.302,-17.672 C 22.73,-26.3 12.531,-32.546 0.939,-35.115 c -2.161,5.888 -3.272721,12.678295 -3.272721,19.305295 0,5.663 0.864,11.1260003 2.39786051,16.03985264 C 11.983,-2.433 22.524,-8.81 30.302,-17.672 Z';
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
                fill: 'green'
              })
            }]
        };
        return group;
    }
    /* 
        getIcon(value1, value2){
            switch (value1){
                case 'statusC':
                    if(value2 === 'Fluctuation'){
                        return 'wfbfl.png';
                    }
                    else if(value2==='Decline'){
                        return 'wfbde.png';
                    }
                    else if(value2 === 'Stable'){
                        return 'wfbst.png';
                    }
                    else if(value2 === 'Improve'){
                        return 'wfbim.png';
                    }
                    break;
                case 'statusB':
                    if(value2 === 'Fluctuation'){
                        return 'wnbfl.png';
                    }
                    else if(value2==='Decline'){
                        return 'wnbde.png';
                    }
                    else if(value2 === 'Stable'){
                        return 'wnbst.png';
                    }
                    else if(value2 === 'Improve'){
                        return 'wnbim.png';
                    }
                    break;
                case 'statusA':
                    if(value2 === 'Fluctuation'){
                        return 'wobfl.png';
                    }
                    else if(value2 === 'Improve'){
                        return 'wobim.png';
                    }
                    break;
                default:
                    return 'wos.png';
                }
        } */
}
