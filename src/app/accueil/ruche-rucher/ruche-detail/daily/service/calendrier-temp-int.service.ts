import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendrierTempIntService {

  constructor() { }

  option = {
    title: {
        top: 28,
        left: 'center',
    },
    tooltip : {
        formatter: (params)=>{
            return params.data[0]+'<br/>'+params.data[1];
        }   
    },
    dayLabel: {
        //nameMap: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        firstDay: 1, // start on Monday

    },
    visualMap: {
        min: 0,
        max: 40,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 55,
        textStyle: {
            color: '#000'
        },
    },
    calendar: {
        top: 100,
        bottom:10,
        left: 30,
        right: 30,
        height:'auto',
        cellSize: ['20', '20'],
        range: '2018',
        itemStyle: {
            normal: {borderWidth: 0.5}
        },
        yearLabel: {show: false},
        dayLabel: {
          nameMap:'fr',
          firstDay: 1, // start on Monday
        },
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',

    }
};

optionHumidityInt = this.option;
optionTempExt = this.option;
}
