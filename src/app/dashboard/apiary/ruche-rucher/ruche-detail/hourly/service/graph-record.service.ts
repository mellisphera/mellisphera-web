import { Injectable } from '@angular/core';
import { GraphGlobal } from '../../../../../graph-echarts/GlobalGraph';
import { UnitService } from '../../../../../service/unit.service';

@Injectable({
    providedIn: 'root'
})
export class GraphRecordService {

    option: any;
    constructor(private globalGraph: GraphGlobal, private unitService: UnitService) {
        this.option = {
            title: {
                text: 'Weight & Temperature',
                left: 'center',
                top: '-5'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: (params: any) => {
                    return this.unitService.getHourlyDate(new Date(params[0].name)) + '<br/>' +
                        params.map((elt: any) => {
                            return elt.marker + elt.seriesName + ': ' + elt.data.value[1];
                        }).join('<br/>');
                }
            },
            toolbox: {
                orient: 'horizontal',
                /*right: '0',
                left : '99%',*/
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    /* magicType: {type: ['line', 'bar']}, */
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                },
                max: new Date(),
                axisLabel: {
                    show: true,
                    formatter: (value: number, index: number) => {
                      return new Date(value).getHours() === 0 ? this.unitService.getDailyDate(new Date(value)) :  this.unitService.getHourlyDate(new Date(value));
                    }
                  }
            },
            legend: {
                top: 30,
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
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
                    realtime: true,
                    filterMode: 'empty'
                },
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    left: 'left'
                },
                {
                    type: 'slider',
                    yAxisIndex: 1,
                    filterMode: 'empty'
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: this.globalGraph.weight.name,
                    min: this.globalGraph.weight.min,
                    max: this.globalGraph.weight.max,
                    interval: this.globalGraph.weight.interval,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: this.globalGraph.temp.name,
                    min: this.globalGraph.temp.min,
                    max: this.globalGraph.temp.max,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value}'
                    }

                }
            ],
            series: [
            ]
        };
    }


}
