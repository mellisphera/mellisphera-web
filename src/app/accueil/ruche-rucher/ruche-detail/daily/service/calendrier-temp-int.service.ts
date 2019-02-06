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
            return params.data[0]+'<br/>'+params.data[1];
        }   
    },
    toolbox: {
        orient : 'horizontal',
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'line']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    visualMap: {
        orient: 'horizontal',
        top : 55,
        left: 'center',
    },
    calendar: {
        top: 100,
        bottom:10,
        left: 60,
        right: 30,
        height:'auto',
        cellSize: ['20', '20'],
        range:null,
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
