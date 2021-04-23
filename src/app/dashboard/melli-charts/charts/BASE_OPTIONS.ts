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

import { CALENDAR } from "./CALENDAR";
import { SERIES } from "./SERIES";

export const BASE_OPTIONS = {
    baseOptionHourly: {
        tooltip: {
            /*trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: null*/
            trigger:'item',
            //showContent: true,
            formatter: null,
        },
        legend: {
            width: '100%',
            orient: 'horizontal',
            top: '0',
            align: 'left',
            data: [],
        },
        /*axisPointer: {
            link: { xAxisIndex: 'all' }
        },*/
        /*toolbox: {
            orient: 'vertical',
            itemSize: 18,
            left: 'right',
            top: 50,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                },
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },*/
        /*dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
            },
            {
                type: 'inside',
                filter: 'none',
                realtime: true,
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                filter: 'none',
                left: 'left'
            },
        ],*/
        grid: [{
            containLabel: true,
            top: 30,
            height: '90%',
            left: 'center',
            width: '80%'
        }],

        yAxis:[],
        xAxis: [],
        series: []

    },
    baseOptionDailyMelliUx: {
        title: {
            top: 0,
            bottom: 0,
            text: '',
            left: 'center',
            textStyle: {
              color: 'black',
              fontWeight : 'normal',
              fontSize : 16
            }
         },
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
         toolbox: {
            orient: 'vertical',
            itemSize: 20,
            feature: {
                dataView: { show: false, readOnly: false },
                restore: { show: false },
                saveAsImage: { show: false }
            }
        },
        series: [],
        calendar: CALENDAR.calendarMelliUx
    },
    baseOptionDailyMelliCharts: {
        // visualMap: {},
        legend: {
            show: true,
            data: [],
            bottom: 50
        },
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        calendar: CALENDAR.calendarMelliChart,
    },

    yAxis: [
      {
        name: '',
        show: true,
        nameLocation: 'middle',
        type: 'value',
        nameGap: 25,
        interval: 5,
        splitNumber: 5,
        min: 0,
        max: 0,
        gridIndex: 0,
        axisLine:{show:true},
        axisTick:{show: true},
        axisLabel:{show: true}
      },
      {
        name: '',
        show: true,
        nameLocation: 'middle',
        type: 'value',
        splitArea: {},
        nameGap: 35,
        interval: 5,
        min: (value) => {return 0},
        max: (value) => {return 0},
        gridIndex: 0,
      },
    ],

    tooltip: {
        trigger: 'item',
        position: 'top',
        textStyle: {
            fontSize: 12
        },
        formatter: {},
    },
    legend: {
        orient: 'horizontal',
        data: [],
        selectedMode: 'multiple'
    },
    xAxis: {
        type: 'time',
        boundaryGap: false,
       // min: 'dataMin',
        max: new Date(),
        min: null,
        axisLine: { onZero: true },
        position: 'bottom',
        minInterval: 1,
        gridIndex: 0,
         splitLine: {
            show: true
        },
        splitArea: {
            show: false
        },
        axisLabel: {
            show: true,
            formatter: {}
        }
    },

    baseOptionStack: {
        toolbox: {
            orient: 'vertical',
            right:10,
            itemSize: 20,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                },
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false,
                type: 'cross'
            },

            formatter: null
        },
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        yAxis: [],
        grid: [
            {
                x: '3%',
                y: '2%',
                width: '85%',
                left: '6%',
                height: '35%',
                background: 'white'
            },
             { x: '3%', y: '41%', left: '6%', width: '85%', height: '25%', background: 'white' },
             { x: '3%', y: '70%', left: '6%', width: '85%', height: '20%', background: 'white' }
        ],
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
        xAxis: [],
        series: []
    },

    graphic:
        {
            type: 'group',
            left: 'center',
            bottom: 20,
            children: [
                {
                    type: 'rect',
                    z: 100,
                    left: 'center',
                    cursor: 'unset',
                    top: 'top',
                    shape: {
                        width: 500,
                        height: 90
                    },
                    style: {
                        fill: '#fff',
                        lineWidth: 0,
                    }
                },
                {
                    type: 'text',
                    z: 100,
                    cursor: 'unset',
                    left: 'center',
                    top: 'middle',
                    style: {
                        fill: '#333',
                        text: '',
                        font: '14px poppins'
                    }
                },
            ]
        }

}
