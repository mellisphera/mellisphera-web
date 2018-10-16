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
        text: 'Poids & Température horaires'

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
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    legend: {
        data:['Poids','Temp-int','Temp-ext']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    dataZoom: [
        {   
            show: true,
            realtime: true,
            start: 30,
            end: 85,
        },
        {
            type: 'inside',
            show: true,
            realtime: true,
            start: 30,
            end: 85,
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: 'Poids',
            /*min: 0,
            max: 400,*/
            interval: 5,
            axisLabel: {
                formatter: '{value} Kg'
            }
        },
        {
            type: 'value',
            name: 'Temp.',
           /* min: 0,
            max: 40,*/
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
             data : '',
             yAxisIndex: 0
         },
         {
             name:'Temp-int',
             type:'line',
             data : '',
             yAxisIndex: 1
             //xAxisIndex : 1
         },
         {
             name:'Temp-ext',
             type:'line',
             data : '',
             yAxisIndex: 1
         }
     ]
};

}
