import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class StackApiaryGraphService {

  echartsUtil: any;
  options: any;
  img: string;
  constructor() {
    this.img = './assets/asterisk.png';
    this.echartsUtil = (<any>echarts).util;
    this.options = {
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
          /* magicType: { type: ['line', 'bar'] }, */
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
          max: new Date(),
          splitLine: {
            show: true
          },
/*           axisLabel: {
            show: false
          } */
        },
        {
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true},
          position: 'bottom',
          gridIndex: 1,
          max: new Date(),
          splitLine: {
            show: true
          },
/*           axisLabel: {
            show: false
          } */
        },
        {
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 2,
          max: new Date(),
          splitLine: {
            show: true
          }
        },
      ],
      yAxis: [
        {
          name: 'Weight (kg)',
          nameLocation: 'middle',
          nameGap: 25,
          type: 'value',
        },
        {
          gridIndex: 1,
          name: 'Temperature (°C)',
          type: 'value',
          nameGap: 25,
          nameLocation: 'middle',
          min: 0,
          max: 40,
        },
        {
          gridIndex: 2,
          name: 'Humidity (%)',
          type: 'value',
          nameLocation: 'middle',
          nameGap: 25,
          min: 0,
          max: 100,
        },
      ],
      series: [],
    };
  }

  renderObs(param, api) {
    var point = api.coord([
        api.value(0),
        0
    ]);
    return {
        type: 'group',
        children: [{
            type: 'image',
            style: {
                image: api.value(this.img),
                x: -this.img / 2,
                y: -this.img / 2,
                width: 45,
                height: 45
            },
            position: [point[0], 110]
        }, {
            type: 'text',
            style: {
                text: api.value(1) + ' - ' + api.value(2) + '°',
                textFont: api.font({fontSize: 14}),
                textAlign: 'center',
                textVerticalAlign: 'bottom'
            },
            position: [point[0], 80]
        }]
    };
}
}
