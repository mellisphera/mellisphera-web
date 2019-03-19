import { MyDate } from '../../../../../class/MyDate';
import { Injectable } from '@angular/core';
import { CalendrierService } from '../../service/calendrier.service';

@Injectable({
  providedIn: 'root'
})
export class CalendrierTempIntService /*extends CalendrierService*/{

  constructor() {

   }

  option = {
    title : {
        top: 28,
        left: 'center',
    },
    tooltip : {
        formatter: (params)=>{
            return  MyDate.getIsoFromDate(MyDate.getWekitDate(params.data[0])) + '<br/>' + params.data[1];
        }   
    },
    toolbox: {
        orient : 'vertical',
        top : 'middle',
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'line']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    visualMap: {
        orient: 'horizontal',
        top : 30,
        itemWidth : 15,
       /*  itemHeight : 200, */
        itemSymbol : 'diamond',
        left: 'right',
    },
    calendar: {
        top: 80,
        bottom:10,
        left: 60,
        right: 30,
        height:'auto',
        cellSize: ['20', '20'],
        range:MyDate.getPersoDate(),
        itemStyle: {
            normal: {borderWidth: 0.5}
        },
        yearLabel: {
            formatter: '{start}-{end}',
            margin : 40,
            show:false,
            textStyle: {
                color: 'black'
            }
        },
        dayLabel: {
            nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            firstDay: 1, // start on Monday
        },
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',

    }
    };
}
