export const BASE_OPTIONS = {
    basepPtions: {
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
      
        series: [],
    },
    line: {
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
                bottom: 20,
            },
            {
                type: 'inside',
                filterMode: 'empty',
                realtime: true,
            },
        ],
        grid: [{
            containLabel: true
        }],
        xAxis: [
            {
                type: '',
                boundaryGap: false,
                axisLine: { onZero: true },
                position: 'bottom',
                splitLine: {
                    show: true
                },
                splitArea: {
                    show: true,
                },
                axisLabel:{}
            },
        ],
        yAxis: [
            {
                name: '',
                nameLocation: 'middle',
                type: 'value',
            },
        ],
    }


}