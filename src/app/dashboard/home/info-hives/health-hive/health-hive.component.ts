import { OnDestroy } from '@angular/core';
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

import { Component, OnInit} from '@angular/core';
import { DailyRecordService } from '../../../service/api/dailyRecordService';
import { MyDate } from '../../../../class/MyDate';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { MEDIA_QUERY_MELLIUX } from '../../../../dashboard/melli-charts/charts/MEDIA';
import * as echarts from 'echarts';

@Component({
  selector: 'app-health-hive',
  templateUrl: './health-hive.component.html',
  styleUrls: ['./health-hive.component.css']
})
export class HealthHiveComponent implements OnInit, OnDestroy {

  chartInstance: any;
  option: any;
  constructor(
      private graphGlobal: GraphGlobal,
      public dailyRecordThService: DailyRecordService) {
      this.chartInstance = null;
      this.option = {
          baseOption : {
            backgroundColor: 'white',
            title: {
                top: 5,
                left: 'center',
                text: this.graphGlobal.getTitle("BROOD"),
                textStyle: {
                    color: 'black',
                    fontWeight : 'normal',
                    fontSize : 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: null,
                alwaysShowContent: false,
                displayMode: "single",
                renderMode: "auto",
                showDelay: 0,
                hideDelay: 100,
                transitionDuration: 0.4,
            },
            toolbox: {
                orient: 'vertical',
                itemSize: 15,
                top: 'middle',
                feature: {
                    dataView: { show: false, readOnly: false },
                    restore: { show: false },
                    saveAsImage: { show: false }
                },
                showDelay : 25
            },
            legend: {
                show: true,
                data: [],
                top: 70,
                left: 'center',
                selectedMode: 'single'
            },
            visualMap: {
                calculable: true,
                min: 0,
                max: 100,
                orient: 'horizontal',
                left: 'center',
                top: 30,
                itemWidth: 15,
                itemSymbol: 'diamond',
                inRange: {
                    color: ['red', 'yellow', '#129001'],
                },
            },
            calendar: [{
                top: 100,
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
            series: []
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


  }

  ngOnInit(): void {
    this.chartInstance = echarts.init(<HTMLDivElement>document.getElementById('graphBrood'));
    this.chartInstance.showLoading();
    this.option.baseOption.calendar[0].range = MyDate.getRangeForCalendarAlerts();
  }

  initGraph(){
    this.option.baseOption.calendar[0].range = MyDate.getRangeForCalendarAlerts();
    this.option.baseOption.series = new Array();
  }

  onResize(event) {
    this.chartInstance.resize({
      width: 'auto',
      height: 'auto'
    });
  }

  ngOnDestroy(): void{
    this.chartInstance.dispose();
  }

}
