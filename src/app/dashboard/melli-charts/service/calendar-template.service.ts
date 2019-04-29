import { Injectable } from '@angular/core';
import { MyDate } from '../../../class/MyDate';

@Injectable({
  providedIn: 'root'
})
export class CalendarTemplateService {

  options: any;
  constructor() {
    this.options = {
      title: {
        left: 'center',
      },
      toolbox: {
        orient: 'vertical',
        itemSize: 15,
        top: 'middle',
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      tooltip: {
        trigger: 'item',
      },
      calendar: {
        left: '5%',
        right: '5%',
        width: '90%',
        height: '45%',
        cellSize: ['20', 'auto'],
        range: MyDate.getRangeForCalendar(),
        itemStyle: {
          normal: {
            color: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#111'
          }
        },
        yearLabel: {
          formatter: '{start}-{end}',
         // margin: 40,
          show: true,
          textStyle: {
            color: 'black'
          }
        },
        dayLabel: {
          nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          firstDay: 1, // start on Monday
        },
      },
      series: [

      ]
    };
  }
}
