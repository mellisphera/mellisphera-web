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
                bottom: 0,
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

        yAxis: {
            name: '',
            nameLocation: 'middle',
            type: 'value',
            nameGap: 30,
            scale: true

        },

        xAxis: [
            {
                type: 'time',
                boundaryGap: false,
                gridIndex: 0,
                axisLine: { onZero: true },
                position: 'bottom',
                splitLine: {
                    show: true
                },
                splitArea: {
                    show: true,
                },
                axisLabel: {}
            },
        ],
        series: []

    },
    baseOptionDaily: {
        // visualMap: {},
        legend: {},
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        toolbox: {
            orient: 'horizontal',
            itemSize: 20,
            feature: {
                dataView: { readOnly: false },
                saveAsImage: {}
            }
        },
        calendar: CALENDAR.calendar
    },

    yAxis: {
        name: '',
        show: true,
        nameLocation: 'middle',
        type: 'value',
        nameGap: 25,
        //interval: 0,
        min: 0,
        max: 0,
        gridIndex: 0
    },
    tooltip: {
        trigger: 'item',
        formatter: {}
    },
    legend: {
        orient: 'horizontal',
        data: [],
        selectedMode: 'multiple'
    },

    xAxis: {
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
                width: '95%', 
                height: '25%', 
                background: 'white' 
            },
             { x: '3%', y: '32%', width: '95%', height: '25%', background: 'white' },
             { x: '3%', y: '63%', width: '95%', height: '25%', background: 'white' }
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
    }


}