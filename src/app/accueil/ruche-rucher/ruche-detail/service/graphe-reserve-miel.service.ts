import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GrapheReserveMielService {

  constructor() { }
  option = {
    title: {
        text: 'RESERVES MIEL'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend : {
      },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    dataZoom: [
        {   
            show: true,
            realtime: true,
            start: 65,
            end: 85
        },
        {
            type: 'inside',
            show: true,
            realtime: true,
            start: 65,
            end: 85
        }
    ],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '18%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [

    ],
};




}
