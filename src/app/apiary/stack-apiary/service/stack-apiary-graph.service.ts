import { Injectable } from '@angular/core';
import { EChartOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class StackApiaryGraphService {

  options: EChartOption;
  constructor() {
    this.options = {
      title: {
        text: 'Stack',
        left: 'center',
        /* top: -5 */
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        orient: 'horizontal',
        /*       x: '5%',
              y: '2%' */
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
          start: 80,
          end: 100,
          bottom: 50,
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
        { x: '3%', y: '5%', width: '95%', height: '40%' },
        { x: '3%', y: '54%', width: '95%', height: '33%' },
        { x: '3%', y: '96%', width: '95%', height: '20%' },
      ],
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
    };
  }
}
