import { Injectable } from '@angular/core';
import { EChartOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class StackApiaryGraphService {

  options: object;
  constructor() {
    this.options  = {
      title: {
        text: 'Stack',
        x: 'center',
        /* top: -5 */
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      toolbox: {
        orient: 'horizontal',
        //right: '0',
  /*       left: '80%', */
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
        { x: '3%', y: '5%', width: '93%', height: '40%' },
        { x: '3%', y: '54%', width: '93%', height: '33%' },
        { x: '3%', y: '96%', width: '93%', height: '20%' },
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
       series: []
    };
  }
}
