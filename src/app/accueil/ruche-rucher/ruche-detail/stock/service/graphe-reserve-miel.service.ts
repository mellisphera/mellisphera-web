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
        top:40
      },
      toolbox: {
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
        top:70,
        bottom:0,
        containLabel: true
    },
    xAxis : [
        {
            type : 'time',
            splitLine: {
                show: false
            },
            min : '2018-01-01T00:00:00.000+0000',
            max : '2018-12-31T00:00:00.000+0000'
        }
    ],
    yAxis :
        {
            name : 'Weight (kg)',
            type : 'value'  
                
        }
};




}
