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

import { Component } from '@angular/core';
import { DailyRecordsWService } from '../../../service/api/daily-records-w.service';
import { CalendrierPoidsService } from '../../../service/api/calendrier-poids.service';
import { RucheService } from '../../../service/api/ruche.service';
import { UserParamsService } from '../../../preference-config/service/user-params.service';
import { DailyStockHoneyService } from '../../../service/api/daily-stock-honey.service';
import { MyDate } from '../../../../class/MyDate';
import { UnitService } from '../../../service/unit.service';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';

@Component({
  selector: 'app-weight-hives',
  templateUrl: './weight-hives.component.html',
  styleUrls: ['./weight-hives.component.css']
})
export class WeightHivesComponent{
    option: any;
  constructor(public dailyRecordWservice: DailyRecordsWService,
    public calendrierPoids: CalendrierPoidsService,
    public rucheService: RucheService,
    public dailyStockHoneyService: DailyStockHoneyService,
    private userConfig: UserParamsService,
    private unitService: UnitService,
    private graphGlobal: GraphGlobal) {
        this.option = {
            //backgroundColor: 'white',
            title: {
                top: 5,
                text: this.graphGlobal.getTitle("DailyWeightIncomes"),
                left: 'center',
                textStyle: {
                  color: 'black',
                  fontWeight : 'normal',
                  fontSize : 16
              }
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    return params.marker + this.unitService.getDailyDate(params.data[0].split('T')[0]) + 
                    '<br/>' + params.seriesName + ' : ' + this.graphGlobal.getNumberFormat(this.unitService.getValRound(params.data[1])) + ' ' + this.graphGlobal.weight.unitW;
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
                top: 30,
                data: ['gain', this.graphGlobal.getTitle("loss")],
                textStyle: {
                    color: 'black'
                }
            },
            calendar: [{
                top: 70,
                left: '15%',
                right: '2%',
                width: '70%',
                //right: '4%',
                height: '45%',
                //height:'auto',
                cellSize: ['20', '20'],
                range: MyDate.getRangeForCalendarHome(),
                orient: 'horizontal',
                /*cellSize: 'auto',
                height:'200',*/
                //  width:'95%',
                // top:70,
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
                    firstDay: 1, // start on Monday
                    show: false,
                },
                monthLabel: {
                    nameMap: this.graphGlobal.getMonth()
                },
                yearLabel: {
                    formatter: '{start}-{end}',
                    show: false,
                    margin: 40,
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
            series: [
                {
                    name: 'gain',
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    data: '',
                    symbolSize: (val: Array<any>) => {
                        if (val[1] >= 0) {
                            if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                                return (0.5 * Math.sqrt((1000 * val[1])));
                            } else {
                                return (0.5 * Math.sqrt((1000 * val[1] * 0.45)));
                            }  
                        }
                        else { return 0; }
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#00FE0C'
                        }
                    }
                },
                {
                    name: this.graphGlobal.getTitle("loss"),
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    data: '',
                    symbolSize: (val: Array<any>) => {
                        if (val[1] < 0) {
                            if (this.unitService.getUserPref().unitSystem === 'METRIC') {
                                return (0.5 * Math.sqrt(Math.abs(1000 * val[1])));
                            } else {
                                return (0.5 * Math.sqrt(Math.abs(1000 * val[1] * 0.45)));
                            }  
                        }
                        else { return 0; }
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
      
                    itemStyle: {
                        normal: {
                            color: '#FE0000'
      
                        }
                    }
                },
      
            ]
        };
        this.option.series.push(this.graphGlobal.getDaySerie());
    }

  convertDate(date: Date) {
      var jour = '' + date.getDate();
      var mois = '' + (date.getMonth() + 1);
      var anee = date.getFullYear();
      if (parseInt(jour) < 10) { jour = '0' + jour; }
      if (parseInt(mois) < 10) { mois = '0' + mois; }

      return anee + '-' + mois + '-' + jour;
  }
}
