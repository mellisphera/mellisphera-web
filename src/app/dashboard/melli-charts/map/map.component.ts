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

import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
/* import { graphic, registerMap } from 'echarts';
 */
import { MAP } from '../charts/geo';
import { SwarmService } from '../../service/api/swarm.service';
import { Swarm } from '../../../_model/swarm';
import { MyDate } from '../../../../app/class/MyDate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private dataForMap: {
    hive: string[],
    serie: any[],
    timeline: Date[]
  };
  private baseOption: any;
  private chartInstance: any;
  constructor(private swarmService: SwarmService) {
    this.dataForMap = {
      hive: [],
      serie: [],
      timeline: []
    };
    this.baseOption = JSON.parse(JSON.stringify(MAP));
  }

  ngOnInit() {
    this.chartInstance = echarts.init(<HTMLDivElement>document.getElementById('maps-swarm'));
    //this.chartInstance.setOption(this.baseOption);
    this.swarmService.getAllSwarm().subscribe(
      _swarm => {
        this.setDataForMap(_swarm);
      }
    )
  }

  setDataForMap(_swarmData: Swarm[]) {
    this.dataForMap.serie = _swarmData.map(elt => {
      if (this.dataForMap.timeline.indexOf(elt.date) === -1) {
        this.dataForMap.timeline.push((new Date(elt.date)));
        if (this.dataForMap.hive.indexOf(elt.info.hive) === -1) {
          this.dataForMap.hive.push(elt.info.hive);
        }
				return _swarmData.filter(filRes => filRes.date === elt.date);
			}
    });
    let dataTmp = [];
    this.dataForMap.serie.filter(_filter => _filter != undefined).map((elt, index) => {
			dataTmp = dataTmp.concat(elt.map(res => {
				return { name: res.info.hive, value: [res.sys.lon, res.sys.lat, res.weight_fall, res.sys.city] };
			}));
			return {
				series: {
					type: 'scatter',
					showEffectOn: 'render',
					rippleEffect: {
						brushType: 'stroke'
					},
					hoverAnimation: true,
					coordinateSystem: 'geo',
					data: dataTmp,
					symbolSize: [20, 30],
					// symbol: symbol,
					itemStyle: {
						color: 'red'
					},
					tooltip: {
						formatter: function (param) {
							return param.data.value[4] + '<br/>' + param.marker + param.data.value[3] + ' : ' + param.data.value[2];
						}
					}
				},
				title: [
					{
						show: true,
						text: MyDate.getIsoFromDate(new Date(elt[0].recordDateStart)),
						left: 'center',
						bottom: 40,
						textStyle: {
							fontSize: 35
						}

					},
					{
						show: true,
						text: 'Essaimages détectés',
						subtext: 'Printemps 2019',
						top: 20,
						subtextStyle: {
							fontWeight: 'bold',
							fontSize: 20,
							fontFamily: 'poppins',
							color: '#4F4F51'
						},
						left: 'center',
						textStyle: {
							fontFamily: 'poppins',
							fontSize: 60,
							color: '#4F4F51'

						}
					},
				]
			}
		}).forEach(oneOption => {
			this.baseOption.options.push(oneOption);
		});
    this.chartInstance.setOption(this.baseOption);
  }

}
