import { type } from 'os';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphStackService {

  option = {
    title: {
        text: 'Stack',
        x: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        orient : 'horizontal',
        data:['Tint','Text','Hint','Hext','Batery-int','Batery-ext'],
        x: '5%'
    },
    toolbox: {
      orient : 'horizontal',
      //right: '0',
      left : '85%',
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
    axisPointer: {
        link: {xAxisIndex: 'all'}
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 80,
            end: 100,
            xAxisIndex: [0, 1, 2]
        },
        {
            type: 'inside',
            filterMode: 'empty',
            realtime: true,
            xAxisIndex: [0, 1, 2]
        },
        {
          type: 'inside',
          filterMode: 'empty',
          realtime: true,
          yAxisIndex : 0,
          left : 'left'
        },
        {
          type: 'inside',
          filterMode: 'empty',
          realtime: true,
          yAxisIndex : 1,
          left : 'left'
        }
    ],
    grid: [
      {x: '4%', y: '3%', width: '95%', height: '25%'},
      {x: '4%', y: '35%', width: '95%', height: '25%'},
      {x: '4%', y: '67%', width: '95%', height: '25%'},
  ],
  /*visualMap: {
    top: 10,
    right: 10,
    seriesIndex : [4,5],
    pieces: [{
        gt: 0,
        lte: 20,
        color: 'red'
    }],
    target: {
      outOfRange: {
          color: ['red'],
          symbolSize: [60, 200]
      }
  },
    },*/
    xAxis : [
        {
          //Temp
            type: 'time',
            boundaryGap : false,
            axisLine: {onZero: true},
            position: 'bottom',
            gridIndex: 0,
            splitLine: {
              show: false
            },
        },
        {
          //Humdity
            type : 'time',
            boundaryGap : false,
            axisLine: {onZero: true},
            position: 'bottom',
            gridIndex: 1,
            splitLine: {
              show: false
          }
        },
        {
          //batery
          type : 'time',
          boundaryGap : false,
          axisLine: {onZero: true},
          position: 'bottom',
          gridIndex: 2,
          splitLine: {
            show: false
          }
        },
    ],
    yAxis : [
        {
            name : 'Temp',
            type : 'value',
            min: 0,
            max: 40,
        },
        {
            gridIndex: 1,
            name : 'Humidity',
            type : 'value',
            inverse: false
        },
        {
          gridIndex: 2,
          name : 'Batery',
          type : 'value',
          inverse: false
        }
    ],
    series : [
        {
            name:'Tint',
            type:'line',
            //symbolSize: 8,
            showSymbol: false,
            //hoverAnimation: true,
        },
        {
            name:'Text',
            type:'line',
            //symbolSize: 8,
            showSymbol: false,
            //hoverAnimation: true,
        },
        {
          name : 'Hint',
          type : 'line',
          //symbolSize: 8,
          xAxisIndex: 1,
          yAxisIndex: 1,
          showSymbol: false,
          //hoverAnimation: true,
        },
        {
          name : 'Hext',
          type : 'line',
          //symbolSize: 8,
          xAxisIndex: 1,
          yAxisIndex: 1,
          showSymbol: false,
        },
        {
          name : "Batery-int",
          type : "bar",
          //symbolSize: 8,
          xAxisIndex: 2,
          yAxisIndex: 2,
          showSymbol: false,
          //hoverAnimation: true,
          color : 'red',
          large: true,
          largeThreshold : 10,
          barGap : '30%'
        },
        {
          name : "Batery-ext",
          type : "bar",
          //symbolSize: 8,
          xAxisIndex: 2,
          yAxisIndex: 2,
          showSymbol: false,
          //hoverAnimation: true,
          color : 'blue',
          large: true,
          largeThreshold : 10,
          barGap : '30%'
        }
    ]
};

  constructor() { }
}
