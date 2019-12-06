/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Component} from '@angular/core';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { MyDate } from '../../../../class/MyDate';
//import { ECharts } from 'echarts';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { MEDIA_QUERY_MELLIUX } from '../../../../dashboard/melli-charts/charts/MEDIA';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';

@Component({
  selector: 'app-health-hive',
  templateUrl: './health-hive.component.html',
  styleUrls: ['./health-hive.component.css']
})
export class HealthHiveComponent {

  option: any;
  constructor(private unitService: UnitService, private graphGlobal: GraphGlobal, public dailyRecordThService: DailyRecordService) {
      this.option = {
          baseOption : {
            backgroundColor: 'white',
            title: {
                top: 5,
                left: 'center',
                text: this.graphGlobal.getTitle("BroodDynamics"),
                textStyle: {
                    color: 'black',
                    fontWeight : 'normal',
                    fontSize : 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    return params.marker + unitService.getDailyDate(params.data[0]) + '<br/>' + this.graphGlobal.getNumberFormat(this.unitService.getValRound(params.data[1])) + ' %';
                }
            },
            toolbox: {
                orient: 'vertical',
                itemSize: 15,
                top: 'middle',
                feature: {
                    dataView: { show: false, readOnly: false },
                    restore: { show: false },
                    saveAsImage: { show: false }
                }
            },
            legend: {
                show: false,
            },
            calendar: [{
                top: 70,
                left: 'center',
                //width: '70%',
                range: MyDate.getRangeForCalendarAlerts(),
                orient: 'vertical',
                cellSize: [40, 40],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#000',
                        width: 2,
                        type: 'solid'
                    }
                },
                dayLabel: {
                    nameMap: this.graphGlobal.getDays(),
                    show: false,
                    margin: 10,
                    position: 'end',
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
            series: [{
                type: 'heatmap',
                coordinateSystem: 'calendar',
            }]
        },
        media: JSON.parse(JSON.stringify(MEDIA_QUERY_MELLIUX))
    };
    this.option.media.push(
        {
            option: {
                visualMap: {
                    orient: 'horizontal',
                }
            }
        },
    );
      this.option.baseOption.series.push(this.graphGlobal.getDaySerie());


  }


}
