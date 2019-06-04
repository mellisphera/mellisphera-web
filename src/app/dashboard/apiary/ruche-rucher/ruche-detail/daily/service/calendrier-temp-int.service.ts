import { MyDate } from '../../../../../../class/MyDate';
import { Injectable } from '@angular/core';
import { CalendrierService } from '../../service/calendrier.service';
import { UnitService } from '../../../../../service/unit.service';
import { GraphGlobal } from '../../../../../graph-echarts/GlobalGraph';

@Injectable({
  providedIn: 'root'
})
export class CalendrierTempIntService /*extends CalendrierService*/{

  constructor(private unitService: UnitService, private graphGlobal: GraphGlobal) {

   }

  option = {
    title : {
        top: 5,
        left: 'center',
    },

    toolbox: {
        orient : 'vertical',
        itemSize: 15,
        top : 'middle',
        feature: {
            dataView: {show: true, readOnly: false, optionToContent: (opt) => {
                const series = opt.series[0].data;
                let table = '<textarea style="width:100%; height:500px;" >';
                series.map((elt: any) => {
                    table += MyDate.getIsoFromDate(MyDate.getWekitDate(elt[0])) + ' => ' + elt[1] + '\n';
                });
                table += '</textarea>';
                return table;
            }},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    visualMap: {
        orient: 'horizontal',
        top : 30,
        itemWidth : 15,
        itemSymbol : 'diamond',
        left: 'center',
    },
    calendar: {
        top: 100,
        left: '3%',
        right: '2%',
        width: '92%',
        //right: '4%',
        height: '45%',
        //height:'auto',
        cellSize: ['20', '20'],
        range:MyDate.getRangeForCalendar(),
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 2,
                type: 'solid'
            }
        },
        itemStyle: {
            normal: {
                color: '#EBEBEB',
                borderWidth: 1,
                borderColor: '#111'
            }
        },
        yearLabel: {
            formatter: '{start}-{end}',
            margin : 40,
            show: false,
            textStyle: {
                color: 'black'
            }
        },
        dayLabel: {
            nameMap: this.graphGlobal.getDays(),
            firstDay: 1, // start on Monday
        },
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',

    }
    };
}
