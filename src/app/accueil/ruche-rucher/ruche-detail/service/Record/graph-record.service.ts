import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphRecordService {

  constructor() { }

  dataWeight : any[] = [15,65,80,97,14,65];
  dataDate : any[] = ['2018-02-03','2018-02-04','2018-02-05','2018-02-06','2018-02-07','2018-02-08'];
  dataTemp : any[] = [18,30,25,13,28,33];

  option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    markLine: {
        symbol: ['none', 'none'],
        data: [
            [
                {
                    name: 'from lowest to highest',
                    type: 'min',
                    valueDim: 'lowest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                        normal: {show: false},
                        emphasis: {show: false}
                    }
                },
                {
                    type: 'max',
                    valueDim: 'highest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                        normal: {show: false},
                        emphasis: {show: false}
                    }
                }
            ],
            {
                name: 'min line on close',
                type: 'min',
                valueDim: 'close'
            },
            {
                name: 'max line on close',
                type: 'max',
                valueDim: 'close'
            }
        ]
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'line']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['Poids','Temp-int','Temp-ext']
    },
    dataZoom: [
        {   
            show: true,
            realtime: true,
            start: 30,
            end: 85
        },
        {
            type: 'inside',
            show: true,
            realtime: true,
            start: 30,
            end: 85
        }
    ],
    xAxis: [
        {
            type: 'category',
            data: this.dataDate,
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: 'Width',
            min: 0,
            max: 350,
            interval: 50,
            axisLabel: {
                formatter: '{value} Kg'
            }
        },
        {
            type: 'value',
            name: '°C',
            min: 0,
            max: 35,
            interval: 5,
            axisLabel: {
                formatter: '{value} °C'
            }
        }
    ],
    series: [
        {
            name:'Poids',
            type:'line',
            data : ''
        },
        {
            name:'Temp-int',
            type:'line',
            data : ''
        },
        {
            name:'Temp-ext',
            type:'line',
            data : '',
            yAxisIndex: 1,
        }
    ]
};

}
