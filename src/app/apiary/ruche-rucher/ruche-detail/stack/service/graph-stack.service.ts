import { type } from 'os';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphStackService {

  option: any;
  constructor() {
    this.option  =  {
      title: {
        text: 'Stack',
        x: 'center',
        top: -5
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        orient: 'horizontal',
        data :[],
        x: '5%',
        y: '2%'
      },
      toolbox: {
        orient: 'horizontal',
        //right: '0',
        left: '80%',
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      axisPointer: {
        link: { xAxisIndex: 'all' }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 80,
          end: 100,
          bottom: -1,
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
          yAxisIndex: 0,
          left: 'left'
        },
        {
          type: 'inside',
          filterMode: 'empty',
          realtime: true,
          yAxisIndex: 1,
          left: 'left'
        }
      ],
      grid: [
        { x: '4%', y: '5%', width: '95%', height: '28%' },
        { x: '4%', y: '38%', width: '95%', height: '25%' },
        { x: '4%', y: '69%', width: '95%', height: '10%' },
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
      xAxis: [
        {
          //Temp
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 0,
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        {
          //Humdity
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 1,
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        {
          //batery
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 2,
          splitLine: {
            show: false
          }
        },
      ],
      yAxis: [
        {
          name: 'Temp',
          type: 'value',
          min: 0,
          max: 40,
        },
        {
          gridIndex: 1,
          name: 'Humidity',
          type: 'value',
          inverse: false
        },
        {
          gridIndex: 2,
          name: 'Batery',
          type: 'value',
          inverse: false
        }
      ],
      series: [
      ]
    };
  
   }
}
