import { MyDate } from '../../../../../../class/MyDate';
import { Injectable } from '@angular/core';
import { EChartOption } from 'echarts';
import { GraphGlobal } from '../../../../../graph-echarts/GlobalGraph';
import { UnitService } from '../../../../../service/unit.service';

@Injectable({
    providedIn: 'root'
})
export class GrapheReserveMielService {

    option: any;
    constructor(private graphGlobal: GraphGlobal, private unitService: UnitService) {
        this.option = {
            title: {
                text: this.graphGlobal.getTitle("reserveMiel"),
                left: 'center',
                top: '5'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: (params: any) => {
                    return '<strong>' + this.unitService.getHourlyDate(new Date(params[0].name)) + '</strong></br>' +
                        params.map((elt: any) => {
                            return elt.marker + elt.seriesName + ': <b>' + this.graphGlobal.getNumberFormat(this.unitService.getValRound(elt.data.value[1])) + ' ' + this.graphGlobal.weight.unitW + '</b>';
                        }).join('<br/>');
                }
            },
            legend: {
                top: 40
            },
            toolbox: {
                top: 'middle',
                orient: 'vertical',
                itemSize: 20,
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
            series: [],
            dataZoom: [
                /*{   
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },*/
                {
                    type: 'inside',
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                }
            ],
            grid: {
                left: '1%',
                right: 0,
                top: 70,
                width: '94%',
                bottom: 0,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    min: MyDate.getIsoFromDate(MyDate.calcLastYear(new Date())),
                    max: new Date(),
                    axisLabel: {
                        show: true,
                        formatter: (value: number, index: number) => {
                            return new Date(value).getHours() === 0 ? this.unitService.getDailyDate(new Date(value)) : this.unitService.getHourlyDate(new Date(value));
                        }
                    }
                }
            ],
            yAxis:
            {
                name: this.graphGlobal.weight.name,
                type: 'value'
                // max: 'dataMax'

            }
        };
    }




}
