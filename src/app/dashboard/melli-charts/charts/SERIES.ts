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
import * as echarts from 'echarts';

export const SERIES = {
  effectScatter: {
    name: 'gain',
    type: 'effectScatter',
    coordinateSystem: 'calendar',
    data: [],
    symbol: '',
    symbolSize: {},
    showEffectOn: 'emphasis',
    rippleEffect: {
      brushType: 'stroke'
    },
    itemStyle: {},
    hoverAnimation: true,
  },
  heatmap: {
    name: '',
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: []
  },
  custom: {
    type: 'custom',
    name: '',
    // tooltip: {},
    //z: -15,
    coordinateSystem: 'calendar',
    renderItem: null,
    data: []
  },
  serieMarkTemp: {
    type: 'line',
    name: 'MarkZone',
    data: null,
    yAxisIndex: 0,
    xAxisIndex: 0,
    markArea: {
      silent: true,
      data: [
        [{
          yAxis: 0,
          name: 'This is a mark area',
          label: {
            show: true,
            position: "insideLeft",
            color: "black",
            borderWidth: 1,
            padding: 2,
            verticalAlign: 'middle',
            shadowBlur: 2,
            shadowColor: "yellow",
            opacity: 1
          },
          itemStyle: {
            opacity: 0.7,
            color: '#8ec6ad'
          }
        }, {
          yAxis: 0
        }]
      ]
    }
  },
  serieMarkPourcent: {
    type: 'line',
    name: 'MarkZone',
    data: null,
    yAxisIndex: 0,
    xAxisIndex: 0,
    markArea: {
      silent: true,
      data: [
        [{
          yAxis: 0,
          name: 'This is a mark area',

          label: {
            show: true,
            position: "insideLeft",
            color: "black",
            borderWidth: 0,
            verticalAlign: 'middle',
            opacity: 1
          },
          itemStyle: {
            opacity: 1.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(142,198,173, 0.7)'
              }, {
              offset: 1,
              color: 'rgb(255,255,255, 0.7)'
              }]),
              borderColor: '#000',
          }

        }, {
          yAxis: 0
        }]
      ]
    }
  },
  serieMarkHint: {
    type: 'line',
    name: 'MarkZone',
    data: null,
    yAxisIndex: 0,
    xAxisIndex: 0,
    markArea: {
      silent: true,
      data: [
        [{
          yAxis: 0,
          name: 'This is a mark area',

          label: {
            show: true,
            position: "insideLeft",
            color: "black",
            borderWidth: 1,
            padding: 2,
            verticalAlign: 'middle',
            shadowBlur: 2,
            shadowColor: "yellow",
            opacity: 1
          },
          itemStyle: {
            opacity: 0.7,
            color: '#8ec6ad'
        }

        }, {
          yAxis: 0
        }]
      ]
    }
  },
  line: {
    name: '',
    // id: '',
    type: 'line',
    xAxisIndex: 0,
    yAxisIndex: 0,
    data: [],
    lineStyle: {},
    showSymbol: false,
    hoverAnimation: true,
    splitArea: {
      show: true,
    },
    /*         markArea: {
              silent: true,
              itemStyle: {
                color: '#EBEBEB'
              },
              label: {
                show: true
              },
              data: [[{
                yAxis: this.unitSystem === 'METRIC' ? '33' : '90'
              }, {
                yAxis: this.unitSystem === 'METRIC' ? '37' : '100'
              }]]
            }, */
  }

}
