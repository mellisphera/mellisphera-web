import { Injectable } from '@angular/core';
import { EChartOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class StackApiaryGraphService {

  options: any;
  constructor() {
    this.options = {
      title: {
        text: 'Stack',
        left: 'center',
        /* top: -5 */
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        orient: 'horizontal',
        data: [],
        y: '2%'
       // show: false
      },
      axisPointer: {
        link: { xAxisIndex: 'all' }
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
      /*       axisPointer: {
              link: { xAxisIndex: 'all' }
            }, */
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          // bottom: 50,
           bottom: 20,
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
        { x: '3%', y: '5%', width: '95%', height: '25%' },
        { x: '3%', y: '35%', width: '95%', height: '25%' },
        { x: '3%', y: '65%', width: '95%', height: '25%' },
      ],
      xAxis: [
        {
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
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true},
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
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 2,
          splitLine: {
            show: false
          },
/*           axisLabel: {
            show: false
          } */
        },
      ],
      yAxis: [
        {
          name: 'Weight',
          type: 'value',
          inverse: false
        },
        {
          gridIndex: 1,
          name: 'Temp',
          type: 'value',
          min: 0,
          max: 40,
        },
        {
          gridIndex: 2,
          name: 'Humidity',
          type: 'value',
          min: 0,
          max: 100,
          inverse: false
        },
      ],
      series: []
    };
  }
}
