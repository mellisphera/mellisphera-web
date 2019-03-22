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
        top: 5,
        left: 'center',
    },
    tooltip : {
        formatter: (params)=>{
            return  MyDate.getIsoFromDate(MyDate.getWekitDate(params.data[0])) + '<br/>' + params.data[1];
        }   
    },
    toolbox: {
        orient : 'vertical',
        itemSize: 15,
        top : 'middle',
        feature: {
            dataView: {show: true, readOnly: false},
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
        range:MyDate.getPersoDate(),
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
