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
                range: MyDate.getPersoDate(),
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
        img = 'm 122.23968,68.892919 c -1.48705,-0.460128 -2.97396,-2.03591 -3.4575,-3.664151 -1.18894,-4.003598 0.46896,-8.003673 3.67237,-8.860454 5.86238,-1.567948 9.95803,2.819061 8.21843,8.803079 -0.94793,3.260735 -4.647,4.893096 -8.4333,3.721526 zm 122.23968,68.892919 c -1.48705,-0.460128 -2.97396,-2.03591 -3.4575,-3.664151 -1.18894,-4.003598 0.46896,-8.003673 3.67237,-8.860454 5.86238,-1.567948 9.95803,2.819061 8.21843,8.803079 -0.94793,3.260735 -4.647,4.893096 -8.4333,3.721526 z m 4.52575,-0.963317 c 3.57273,-1.349874 4.42456,-6.7895 1.49666,-9.557481 -0.97882,-0.92536 -1.94402,-1.273604 -3.52996,-1.273604 -1.58594,0 -2.55114,0.348244 -3.52996,1.273604 -2.39978,2.268711 -2.39978,6.292942 0,8.566954 0.41351,0.391838 1.04949,0.830775 1.41329,0.975417 0.8903,0.353965 3.23056,0.362486 4.14997,0.01511 zm 122.62718,68.866546 c -1.48411,-0.667406 -2.55654,-1.617944 -3.3441,-2.964029 -0.63117,-1.078779 -0.73917,-1.553318 -0.73917,-3.247749 0,-1.700649 0.10714,-2.167607 0.74931,-3.265892 2.52113,-4.311793 7.9485,-4.423034 10.68069,-0.218915 0.90371,1.390565 0.97511,1.645734 0.97511,3.484807 0,1.839072 -0.0714,2.094241 -0.97511,3.484806 -1.25001,1.923439 -2.89542,2.937075 -4.95801,3.054329 -0.93146,0.05295 -1.81109,-0.0676 -2.38872,-0.327357 z m 4.13825,-0.936944 c 3.57273,-1.349874 4.42456,-6.7895 1.49666,-9.557481 -0.97882,-0.92536 -1.94402,-1.273604 -3.52996,-1.273604 -1.58594,0 -2.55114,0.348244 -3.52996,1.273604 -2.39978,2.268711 -2.39978,6.292942 0,8.566954 0.41351,0.391838 1.04949,0.830775 1.41329,0.975417 0.8903,0.353965 3.23056,0.362486 4.14997,0.01511 zm 122.62718,68.866546 c -1.48411,-0.667406 -2.55654,-1.617944 -3.3441,-2.964029 -0.63117,-1.078779 -0.73917,-1.553318 -0.73917,-3.247749 0,-1.700649 0.10714,-2.167607 0.74931,-3.265892 2.52113,-4.311793 7.9485,-4.423034 10.68069,-0.218915 0.90371,1.390565 0.97511,1.645734 0.97511,3.484807 0,1.839072 -0.0714,2.094241 -0.97511,3.484806 -1.25001,1.923439 -2.89542,2.937075 -4.95801,3.054329 -0.93146,0.05295 -1.81109,-0.0676 -2.38872,-0.327357 z m 5.23739,-1.287493 c 3.20767,-2.222913 3.20233,-7.629355 -0.01,-9.85531 -1.60911,-1.115108 -4.63633,-1.115108 -6.24544,0 -2.91269,2.018501 -3.25743,6.892872 -0.66004,9.332487 1.18634,1.114267 2.1537,1.434424 4.07969,1.350212 1.41766,-0.06199 1.95895,-0.21993 2.83551,-0.827389 zm 122.62718,68.866546 c -1.48411,-0.667406 -2.55654,-1.617944 -3.3441,-2.964029 -0.63117,-1.078779 -0.73917,-1.553318 -0.73917,-3.247749 0,-1.700649 0.10714,-2.167607 0.74931,-3.265892 2.52113,-4.311793 7.9485,-4.423034 10.68069,-0.218915 0.90371,1.390565 0.97511,1.645734 0.97511,3.484807 0,1.839072 -0.0714,2.094241 -0.97511,3.484806 -1.25001,1.923439 -2.89542,2.937075 -4.95801,3.054329 -0.93146,0.05295 -1.81109,-0.0676 -2.38872,-0.327357 z m 5.18162,-1.071889 c 3.67028,-2.269162 3.65637,-8.019219 -0.0249,-10.29518 -1.85625,-1.147627 -4.24727,-1.147627 -6.10352,0 -1.89688,1.172753 -2.84867,3.080969 -2.71911,5.451452 0.0753,1.37694 0.26486,2.024949 0.88686,3.031009 1.69103,2.735177 5.18264,3.530248 7.96068,1.812719 zm 123.14463,69.029798 c -0.38919,-0.109913 0.26425,-0.186806 1.5875,-0.186806 1.32325,0 1.97669,0.07689 1.5875,0.186806 -0.3638,0.102743 -1.07818,0.186806 -1.5875,0.186806 -0.50932,0 -1.2237,-0.08406 -1.5875,-0.186806 z m -4.64258,-5.439264 c -0.0974,-0.649495 -0.0687,-1.631761 0.0637,-2.182812 0.20667,-0.859934 0.24131,-0.692592 0.24443,1.1809 0.002,1.200547 -0.0267,2.182812 -0.0637,2.182812 -0.037,0 -0.14703,-0.531405 -0.24443,-1.1809 z m 12.16426,-0.935766 c 0,-2.014303 0.0256,-2.131631 0.2455,-1.12448 0.15095,0.691386 0.15095,1.557573 0,2.248959 -0.21988,1.007151 -0.2455,0.889823 -0.2455,-1.124479 z m -7.05866,-6.444267 c 0.69139,-0.150947 1.55757,-0.150947 2.24896,0 1.00715,0.219886 0.88982,0.245502 -1.12448,0.245502 -2.0143,0 -2.13163,-0.02562 -1.12448,-0.245502 z';
        /*         img = 'M306,153c-21.114,0-38.25,17.136-38.25,38.25S284.886,229.5,306,229.5s38.25-17.117,38.25-38.25S327.133,153,306,153z' +
        'M306,267.75c-21.114,0-38.25,17.117-38.25,38.25v114.75c0,21.114,17.136,38.25,38.25,38.25s38.25-17.136,38.25-38.25V306' +
       'C344.25,284.886,327.133,267.75,306,267.75z M306,0C137.279,0,0,137.279,0,306s137.279,306,306,306s306-137.279,306-306' +
       'S474.721,0,306,0z M306,554.625C168.893,554.625,57.375,443.088,57.375,306S168.893,57.375,306,57.375' +
       'c137.088,0,248.625,111.537,248.625,248.625S443.088,554.625,306,554.625z'; */
        const group = {
            type: 'group',
            children: [{
              type: 'path',
              shape: {
                pathData: img,
                x: -8,
                y: -8,
                width: 500,
                height: 500
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
