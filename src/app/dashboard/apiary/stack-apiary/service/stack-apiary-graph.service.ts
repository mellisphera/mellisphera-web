/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Injectable } from '@angular/core';
import * as echarts from 'echarts';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { UnitService } from '../../../service/unit.service';
import { Timestamp } from 'rxjs/Rx';
import { truncate } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class StackApiaryGraphService {

  echartsUtil: any;
  options: any;
  constructor(private configGraph: GraphGlobal, 
    private unitService: UnitService) {
    this.echartsUtil = (<any>echarts).util;
    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        },
        formatter: (params) => {
          return '<strong>' + this.unitService.getHourlyDate(params[0].name) + '</strong></br>' +
            params.map((elt: any) => {
              return elt.marker  + elt.seriesName + ': <b>' + this.configGraph.getNumberFormat(this.unitService.getValRound(elt.data.value[1])) + ' ' + this.configGraph.getUnitBySerieName(elt.seriesName) + '</b>';
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
        itemSize: 20,
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
        { x: '3%', y: '5%', width: '90%', height: '25%', background: 'white' },
        { x: '3%', y: '35%', width: '90%', height: '25%', background: 'white' },
        { x: '3%', y: '65%', width: '90%', height: '25%', background: 'white' }
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
          splitArea: {
            show: true,
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
          splitArea: {
            show: true,
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
          splitArea: {
            show: true,
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
          nameGap: 18,
          interval: this.configGraph.weight.interval,
          type: 'value',
          min: this.configGraph.weight.min
        },
        {
          gridIndex: 1,
          name: this.configGraph.temp.name,
          type: 'value',
          nameGap: 18,
          nameLocation: 'middle',
          min: this.configGraph.temp.min,
          max: this.configGraph.temp.max,
        },
        {
          gridIndex: 2,
          name: this.configGraph.getTitle("Humidity"),
          type: 'value',
          nameLocation: 'middle',
          nameGap: 18,
          min: 0,
          max: 100,
        },
      ],
      series: [],
    };
  }

}
