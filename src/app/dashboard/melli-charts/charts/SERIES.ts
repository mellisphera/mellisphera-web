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
    coordinateSystem: 'calendar',
    renderItem: null,
    data: []
  },
  line: {
    name: '',
    // id: '',
    type: 'line',
    xAxisIndex: 0,
    yAxisIndex: 0,
    data: [],
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