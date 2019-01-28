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
    title: {
        text: 'Weight & Temperature',
        left: 'center',
        top:'-5'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    toolbox: {
        orient : 'horizontal',
        /*right: '0',
        left : '99%',*/
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
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    legend: {
        top:30,
        data:['Weight','Temp-int','Temp-ext']
    },
    grid: {
        left: '3%',
        right: '4%',
        containLabel: true
    },
    dataZoom: [
        {   
            show: true,
            realtime: true,
            start: 80,
            end: 100,
        },
        {
            type: 'inside',
            filterMode: 'empty'
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty',
            left:'left'
        },
        {
            type: 'slider',
            yAxisIndex: 1,
            filterMode: 'empty'
        },
    ],
    yAxis: [
        {
            type: 'value',
            name: 'Weight (kg)',
            min: 0,
            max: 80,
            interval: 5,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: 'Temp.(°C)',
            min: 0,
            max: 40,
            interval: 5,
            axisLabel: {
                formatter: '{value}'
            }

        }
    ],
    series: [
        {
             name:'Weight',
             type:'line',
             showSymbol: false,
             hoverAnimation: true,
             data : '',
             yAxisIndex: 0,
             color : 'black'
         },
         {
             name:'Temp-int',
             type:'line',
             showSymbol: false,
             hoverAnimation: true,
             data : '',
             yAxisIndex: 1,
             color : 'red'
         },
         {
             name:'Temp-ext',
             type:'line',
             showSymbol: false,
             hoverAnimation: true,
             data : '',
             yAxisIndex: 1,
             color : 'blue'
         }
     ]
};

}
