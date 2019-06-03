import { Injectable } from '@angular/core';
import * as echarts from 'echarts';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { UnitService } from '../../../service/unit.service';
import { Timestamp } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class StackApiaryGraphService {

  echartsUtil: any;
  options: any;
  constructor(private configGraph: GraphGlobal, private unitService: UnitService) {
    this.echartsUtil = (<any>echarts).util;
    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        },
        formatter: (params) => {
          return this.unitService.getHourlyDate(new Date(params[0].name)) + '<br/>' +
            params.map((elt: any) => {
              return elt.marker + elt.seriesName + ': ' + elt.data.value[1];
            }).join('<br/>');
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
        { x: '3%', y: '5%', width: '90%', height: '25%' },
        { x: '3%', y: '35%', width: '90%', height: '25%' },
        { x: '3%', y: '65%', width: '90%', height: '25%' },
      ],
      xAxis: [
        {
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          minInterval: 1,
          gridIndex: 0,
          max: new Date(),
          splitLine: {
            show: true
          },
          axisLabel: {
            show: true,
             formatter: (value: number, index: number) => {
              return this.unitService.getHourlyDate(new Date(value));
            } 
          }
        },
        {
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 1,
          max: new Date(),
          splitLine: {
            show: true
          },
          axisLabel: {
            show: true,
             formatter: (value: number, index: number) => {
              return this.unitService.getHourlyDate(new Date(value));
            } 
          }
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
          },
          axisLabel: {
            show: true,
             formatter: (value: number, index: number) => {
              return this.unitService.getHourlyDate(new Date(value));
            } 
          } 
        },
      ],
      yAxis: [
        {
          name: this.configGraph.weight.name,
          nameLocation: 'middle',
          nameGap: 25,
          interval: this.configGraph.weight.interval,
          type: 'value',
          min: this.configGraph.weight.min
        },
        {
          gridIndex: 1,
          name: this.configGraph.temp.name,
          type: 'value',
          nameGap: 25,
          nameLocation: 'middle',
          min: this.configGraph.temp.min,
          max: this.configGraph.temp.max,
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

}
