import { MyDate } from './../../../../../class/MyDate';
import { Injectable } from '@angular/core';
import { EChartOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class GrapheReserveMielService {

  constructor() { }
  option = {
    title: {
        text: 'Honey Stock',
        left: 'center',
        top:'-5'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend : {
        top: 40
      },
      toolbox: {
        top : 'middle',
        orient : 'vertical',
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    series : [],
    dataZoom: [
        /*{   
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },*/
        {
            type: 'inside',
            show: true,
            realtime: true,
            start: 0,
            end: 100
        }
    ],
    grid: {
        left: '2%',
        right: '2%',
        top: 70,
        bottom: 0,
        containLabel: true
    },
    xAxis : [
        {
            type : 'time',
            splitLine: {
                show: false
            },
            min: MyDate.getIsoFromDate(MyDate.calcLastYear(new Date())),
            max: 'dataMax'
        }
    ],
    yAxis :
        {
            name : 'Weight variation (kg)',
            type : 'value',
            min: -10
            // max: 'dataMax'

        }
};




}
