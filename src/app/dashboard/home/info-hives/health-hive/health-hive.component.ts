import { Component} from '@angular/core';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { MyDate } from '../../../../class/MyDate';
//import { ECharts } from 'echarts';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';

@Component({
  selector: 'app-health-hive',
  templateUrl: './health-hive.component.html',
  styleUrls: ['./health-hive.component.css']
})
export class HealthHiveComponent {

  option: any;

  constructor(private unitService: UnitService, private graphGlobal: GraphGlobal, public dailyRecordThService: DailyRecordService) {
      this.option = {
          backgroundColor: 'white',
          title: {
              top: 5,
              text: this.graphGlobal.getTitle("BroodDynamics"),
              left: 'center',
              textStyle: {
                  color: 'black'
              }
          },
          tooltip: {
              trigger: 'item',
              formatter: (params) => {
                  return params.marker + unitService.getDailyDate(params.data[0]) + '<br/>' + params.data[1] + ' %';
              }
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
          calendar: [{
              top: 80,
              left: '15%',
              bottom: '3%',
              height: '45%',
              width: '70%',
              range: MyDate.getRangeForCalendarHome(),
              orient: 'horizontal',
              cellSize: ['20', '20'],
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: '#000',
                      width: 2,
                      type: 'solid'
                  }
              },
/*                 visualMap: {
                  calculable: true,
                  min: 0,
                  max: 100,
                  orient: 'horizontal',
                  top : 100,
                  itemWidth : 15,
                  itemSymbol : 'diamond',
                  left: 'center',
                  inRange: {
                      color: ['red', '#FD6204', 'yellow',
                      '#63C908', '#498513']
                  }
              }, */
              dayLabel: {
                  nameMap: this.graphGlobal.getDays(),
                  firstDay: 1, // start on Monday
              },
              monthLabel: {
                  nameMap: this.graphGlobal.getMonth()
              },
              yearLabel: {
                  formatter: '{start}-{end}',
                  show: false,
                  margin: 40,
                  orient: 'horizontal',
                  top : 30,
                  itemWidth : 15,
                  itemSymbol : 'diamond',
                  left: 'center',
                  textStyle: {
                      color: 'black'
                  }
              },
              itemStyle: {
                  normal: {
                      color: '#EBEBEB',
                      borderWidth: 1,
                      borderColor: '#111'
                  }
              }
          }],
          series: {
              type: 'heatmap',
              coordinateSystem: 'calendar',
          }
      };

  }


}
