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
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: null
        },
        legend: {
            orient: 'horizontal',
            data: [],
        },
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        toolbox: {
            orient: 'horizontal',
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
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
            },
            {
                type: 'inside',
                filterMode: 'empty',
                realtime: true,
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty',
                left: 'left'
            },
        ],
        grid: [{
            containLabel: true,
            height: '80%',
            left: 'center',
            width: '95%'
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
        },
/*         title:{
            text: 'toto',
            left: 'center'
        }, */
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
/*         toolbox: {
            orient: 'vertical',
            itemSize: 20,
            feature: {
                dataView: { readOnly: false },
                saveAsImage: {}
            }
        }, */
        calendar: CALENDAR.calendarMelliChart,
        graphic:[]
    },

    yAxis: {
        name: '',
        show: true,
        nameLocation: 'middle',
        type: 'value',
        splitArea: {},
        nameGap: 25,
        //interval: 0,
        min: 0,
        max: 0,
        gridIndex: 0
    },
    tooltip: {
        trigger: 'item',
        formatter: {},
    },
    legend: {
        orient: 'horizontal',
        data: [],
        top: 150,
        selectedMode: 'multiple'
    },
    xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: { onZero: true },
        position: 'bottom',
        minInterval: 1,
        gridIndex: 0,
         splitLine: {
            show: true
        },
        splitArea: {
            show: true,
        },
        axisLabel: {
            show: true,
            formatter: {}
        }
    },

    baseOptionStack: {
        toolbox: {
            orient: 'vertical',
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
                animation: false
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
                width: '90%',
                left: '6%',
                height: '25%', 
                background: 'white'
            },
             { x: '3%', y: '32%', left: '6%', width: '90%', height: '25%', background: 'white' },
             { x: '3%', y: '63%', left: '6%', width: '90%', height: '25%', background: 'white' }
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
            top: 30,
            children: [
                {
                    type: 'rect',
                    z: 100,
                    left: 'center',
                    cursor: 'unset',
                    top: 'middle',
                    shape: {
                        width: 300,
                        height: 90
                    },
                    style: {
                        fill: '#fff',
                        stroke: '#555',
                        lineWidth: 2,
                        shadowBlur: 8,
                        shadowOffsetX: 3,
                        shadowOffsetY: 3,
                        shadowColor: 'rgba(0,0,0,0.3)'
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