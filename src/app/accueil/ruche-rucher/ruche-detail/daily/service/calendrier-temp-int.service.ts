import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendrierTempIntService {

  constructor() { }

  option = {
    title: {
        top: 30,
        left: 'center',
    },
    tooltip : {
        formatter: (params)=>{
            return params.data[0]+'<br/>'+params.data[1];
        }   
    },
    visualMap: {
        min: 0,
        max: 40,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
            color: '#000'
        },
    },
    calendar: {
        top: 120,
        left: 30,
        right: 30,
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
