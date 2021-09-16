
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

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { Observable } from 'rxjs';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { SERIES } from '../charts/SERIES';
import { RucheService } from '../../service/api/ruche.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { AdminService } from '../../admin/service/admin.service';
import { InspApiaryService } from '../../service/api/insp-apiary.service';
import { InspHiveService } from '../../service/api/insp-hive.service';
import * as moment from 'moment';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { UserPref } from '../../../_model/user-pref';
import { AlertInterface } from '../../../_model/alert';
import { InspHive } from '../../../_model/inspHive';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from '../../service/api/alerts.service';
import { MelliChartsFilterService } from '../service/melli-charts-filter.service';
import { InspectionService } from '../../service/api/inspection.service';
import { Inspection } from '../../../_model/inspection';

//import { HIVE_POS } from '../../../../constants/hivePositions';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { DailyManagerService } from '../hive/service/daily-manager.service';
import { MelliChartsHiveService } from '../service/melli-charts-hive.service';
import { RucherService } from '../../service/api/rucher.service';

const IMG_PATH = '../../../../assets/ms-pics/';

class InspHiveItem{
    name: string;
    insp: Inspection[];
}

class AlertHiveItem{
  name: string;
  alerts: AlertInterface[];
}

@Component({
  selector: 'app-vitality',
  templateUrl: './vitality.component.html',
  styleUrls: ['./vitality.component.css']
})
export class VitalityComponent implements OnInit, OnDestroy{

  private inspHives: InspHiveItem[];
  private alertHives: AlertHiveItem[];
  public user_pref : UserPref;

  private option: {
    baseOption: any,
    media: any[]
  };

  constructor(
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private dailyThService: DailyRecordService,
    private tokenService: AtokenStorageService,
    private adminService: AdminService,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private rucherService: RucherService,
    private unitService: UnitService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
    private userPrefsService: UserParamsService,
    private translate: TranslateService,
    private alertService: AlertsService,
    private melliFilters: MelliChartsFilterService,
    private inspService: InspectionService,
    private translateService: TranslateService,
    private dailyManager: DailyManagerService,
    private melliHive: MelliChartsHiveService
    ){
    this.option = {
      baseOption : JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionHourly)),
      media: [
        {
          option: {
            grid:{
              width: '85%'
            },
            toolbox: {
              show: true,
              right: 2,
            }
          }
        },
        {
          query: {// 这里写规则
            maxWidth: 1100,
          },
          option: {// 这里写此规则满足下的option
/*             toolbox: {
              show: true,
              right: -20,
            } */
          }
        },
        {
          query: {// 这里写规则
            maxWidth: 400,
          },
          option: {// 这里写此规则满足下的option
            grid:[{
              width: '97%'
            }],
            toolbox: {
              show: false
            }
          }
        },
      ]
    };
  }

  ngOnInit() {
    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
      },
      () => {},
      () => {
        this.initGraph();
      }
    );
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-hive')) {
      elt.classList.remove('apiary-group-hive');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-weight');
    } else if (elt.classList.contains('apiary-group-events')){
      elt.classList.remove('apiary-group-events');
    }
    elt.classList.add('apiary-group-brood');
  }

  initGraph(): void{
    this.stackService.setBroodChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-brood')));
    this.option.baseOption.series = [];
    this.setOptionForStackChart();
    if (this.stackService.getHiveSelect().length >= 1) {
      this.loadAllHiveAfterRangeChange((options: any) => {
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    }
  }

  setOptionForStackChart(): void {
    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis[0]);
    yAxis.name = this.graphGlobal.brood.name;
    yAxis.min = 0;
    yAxis.max = 100;
    yAxis.interval = 20;
    this.option.baseOption.yAxis.push(yAxis);

    let serieMarkBrood = JSON.parse(JSON.stringify(SERIES.serieMarkPourcent));
    serieMarkBrood.markArea.data[0][0].name = this.graphGlobal.getNameZoneByGraph('BROOD');
    serieMarkBrood.markArea.data[0][0].yAxis = 80;
    serieMarkBrood.markArea.data[0][1].yAxis = 100;
    this.option.baseOption.series.push(serieMarkBrood);

    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };

    this.option.baseOption.tooltip.formatter = (params) => {
      let words = params.seriesName.split(' | ');
      if(words.includes('inspection') || words.includes('event')){
        let indexSerie = this.option.baseOption.series.findIndex(_s => _s.name === params.seriesName);
        let indexHiveInspItem = this.inspHives.findIndex(_insp => _insp.name === words[0]);
        let indexHiveInsp = this.inspHives[indexHiveInspItem].insp.findIndex(_insp => new Date(_insp.opsDate).getTime() === new Date(params.name).getTime());
        return this.getInspTooltipFormatter(words[0], indexSerie, indexHiveInspItem, indexHiveInsp);
      }
      else if(words.includes('alert')){
        let indexSerie = this.option.baseOption.series.findIndex(_s => _s.name === params.seriesName);
        let indexHiveAlertItem = this.alertHives.findIndex(_alert => _alert.name === words[0]);
        let indexHiveAlert = this.alertHives[indexHiveAlertItem].alerts.findIndex(_alert => new Date(_alert.opsDate).getTime() === new Date(params.name).getTime());
        return this.getAlertTooltipFormatter(words[0], indexSerie, indexHiveAlertItem, indexHiveAlert);
      }
      else{
        return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data.name), new Array(
          {
            name: params.seriesName,
            value: this.unitService.getValRound(params.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName('Brood')
          }
        ));
      }
    }
    this.option.baseOption.xAxis.push(xAxis);
    this.stackService.getBroodChartInstance().setOption(this.option);
  }

  onResize(event: any) {
    this.stackService.getBroodChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  getSerieByData(data: Array<any>, nameSerie: string, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach(_data => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, SERIES.line);
        serieTmp.name = nameSerie + ' | ' + this.getNameSerieByPosition(_data);
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, _map.value, _map.sensorRef], position: _map.position };
        });
        next(serieTmp);
      }
    });
  }

  getNameSerieByPosition(elt: any): string{
    if(elt.position == null || elt.position == undefined || elt.position === "" ){
      return elt.sensorRef;
    }
    else{
      let nameSerie = elt.position;
      return this.translateService.instant('HIVE_POS.'+nameSerie.toUpperCase()+'.MSG')
    }
  }

  removeHiveSerie(hive: RucheInterface): void {
    let option = this.stackService.getBroodChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getBroodChartInstance().setOption(option, true);
    let index = this.inspHives.findIndex(_elt => _elt.name === hive.name);
    this.inspHives.splice(index, 1);
  }

  removeSerieByFilter(filterName: string): void{
    let option = this.stackService.getBroodChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(filterName) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getBroodChartInstance().setOption(option, true);
  }

  loadSerieByFilter(filterName: string): void{
    if (this.stackService.getHiveSelect().length >= 1) {
      this.loadAllHiveAfterRangeChange((options: any) => {
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    }
  }

  loadAllHiveAfterRangeChange(next: Function): void {
    this.option.baseOption.series.length = 1;
    const obs = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.dailyThService.getBroodOldMethod(_hive._id, this.melliDateService.getRangeForReqest())}
    });
    this.inspHives = [];
    this.alertHives = [];
    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _broods => {
        _broods.forEach((_elt, index) => {
          this.getSerieByData(_elt, obs[index].name, (serieComplete: any) => {
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
            };
            serieComplete.showSymbol = true;
            serieComplete.symbol = 'emptyCircle';
            serieComplete.type = 'line';
            const indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            if (indexSerie !== -1) {
              this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
            } else {
              this.option.baseOption.series.push(Object.assign({}, serieComplete));
            }
            this.loadEventsByHiveAfterRangeChange(obs, index, serieComplete);
          });
        })
      },
      () => {},
      () => {
        next(this.option);
      }
    )
  }

  loadEventsByHiveAfterRangeChange(obs: any, index: number, serieComplete: any): void{
    let new_series = [];
    this.inspService.getInspectionByHiveIdAndOpsDateBetween(obs[index].hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _hive_insp => {
        let item : InspHiveItem = {name: obs[index].hive.name, insp: [..._hive_insp]};
        this.inspHives.push(item);
        _hive_insp.forEach(insp => {
          let d1 : Date = new Date(insp.opsDate);
          d1.setHours(12 - (d1.getTimezoneOffset()/60));
          d1.setMinutes(0);
          d1.setSeconds(0);
          d1.setMilliseconds(0);
          let insp_index = serieComplete.data.findIndex(e => new Date(e.name).getTime() === d1.getTime());
          if(insp_index != -1){
            let new_item = {
              name:insp.opsDate,
              value:[insp.opsDate, serieComplete.data[insp_index].value[1], serieComplete.data[insp_index].value[2]]
            };
            let data = [
              new_item
            ];
            if(insp.type == 'hive' && insp.apiaryInspId != null && this.melliFilters.getShowInsp()){
              let seriesIndex = new_series.findIndex( s => s.name === serieComplete.name + ' | inspection');
              if(seriesIndex !== -1){
                new_series[seriesIndex].data.push(new_item);
              }
              else{
                let newSerie = this.createNewCustomSerie(serieComplete, new_item, 'inspection', IMG_PATH + 'ui/calendbars/inspect-api_cb.png', 30, -30/2, -40/2);
                new_series.push(newSerie);
              }
            }
            if(insp.type == 'hive' && insp.apiaryInspId == null && this.melliFilters.getShowEvent()){
              let seriesIndex = new_series.findIndex( s => s.name === serieComplete.name + ' | event');
              if(seriesIndex !== -1){
                new_series[seriesIndex].data.push(new_item);
              }
              else{
                let newSerie = this.createNewCustomSerie(serieComplete, new_item, 'event', IMG_PATH + 'ui/calendbars/inspect_cb.png', 30, -30/2, -40/2);
                new_series.push(newSerie);
              }
            }
          }
        })
      },
      () => {},
      () => {
        new_series.forEach(s =>{
          let indexSerie = this.option.baseOption.series.findIndex(e => e.name === s.name);
          if (indexSerie !== -1) {
            this.option.baseOption.series[indexSerie] = Object.assign({}, s);
          } else {
            this.option.baseOption.series.push(Object.assign({}, s));
          }
        });
        this.loadAlertByHiveAfterRangeChange(obs, index, serieComplete);
        //this.stackService.getBroodChartInstance().setOption(this.option);
      }
    );
  }

  loadAlertByHiveAfterRangeChange(obs: any, index: number, serieComplete: any): void{
    let new_series = [];
    this.alertService.getAlertByHive(obs[index].hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _hive_alerts => {
        let item : AlertHiveItem = {name: obs[index].hive.name, alerts: [..._hive_alerts]};
        this.alertHives.push(item);
        _hive_alerts.forEach( alert => {
          let d1 : Date = new Date(alert.opsDate);
          d1.setHours(12 - (d1.getTimezoneOffset()/60));
          d1.setMinutes(0);
          d1.setSeconds(0);
          let alert_index = serieComplete.data.findIndex(e => new Date(e.name).getTime() === d1.getTime());
          if(alert_index !== -1){
            let new_item = {
              name:alert.opsDate,
              value:[alert.opsDate, serieComplete.data[alert_index].value[1], serieComplete.data[alert_index].value[2]]
            };
            let data = [
              new_item
            ];
            if(this.melliFilters.getShowAlert() && this.melliFilters.getShowAlertIcon(alert.icon)){
              let seriesIndex = new_series.findIndex( s => s.name === serieComplete.name + ' | alert | ' + alert.icon);
              if(seriesIndex !== -1){
                new_series[seriesIndex].data.push(new_item);
              }
              else{
                let newSerie = this.createNewCustomSerie(serieComplete, new_item, 'alert | ' + alert.icon, IMG_PATH + 'alerts/ruche/' + alert.icon.toLowerCase() + '_cb.png', 30, -30/2, -40/2);
                new_series.push(newSerie);
              }
            }
          }
        });
      },
      () => {},
      () => {
        new_series.forEach(s =>{
          let indexSerie = this.option.baseOption.series.findIndex(e => e.name === s.name);
          if (indexSerie !== -1) {
            this.option.baseOption.series[indexSerie] = Object.assign({}, s);
          } else {
            this.option.baseOption.series.push(Object.assign({}, s));
          }
        });
        this.stackService.getBroodChartInstance().setOption(this.option);
      }
    );

  }

  createNewCustomSerie(serie: any, new_item: any, type: string, img: string, size:number, x_pos: number, y_pos: number): any{
    let new_data = [
      new_item
    ];
    return {
      name: serie.name + ' | ' + type,
      type:'custom',
      itemStyle:{
        opacity: 1,
      },
      //id: 'swarm',
      renderItem: (param, api) => {
        let point = api.coord([api.value(0), api.value(1)]);
        return {
          type: 'image',
          style: {
            image: img,
            x: x_pos,
            y: y_pos,
            width: size,
            height: size,
          },
          position:point,
        }
      },
      data: new_data,
      silent: false,
      z: 10,
    };
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof VitalityComponent
   */
  loadDataByHive(hive: RucheInterface): void{
    let serie;
    this.stackService.getBroodChartInstance().showLoading();
    this.dailyThService.getBroodOldMethod(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _brood => {
        this.getSerieByData(_brood, hive.name, (serieComplete: any) => {
          serie = Object.assign({}, serieComplete);
          serieComplete.itemStyle = {
            color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
          };
          serieComplete.showSymbol = true;
          serieComplete.symbol = 'emptyCircle';
          serieComplete.type = 'line';
          this.option.baseOption.series.push(serieComplete);
          this.stackService.getBroodChartInstance().setOption(this.option);
        })
      },
      () => {},
      () => {
        this.stackService.getBroodChartInstance().hideLoading();
        this.loadEventsByHive(hive, serie);
      }
    )
  }

  loadEventsByHive(hive: RucheInterface, serie:any): void{
    let data = [];
    let new_series = [];
    this.inspService.getInspectionByHiveIdAndOpsDateBetween(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _hive_insp => {
        let item : InspHiveItem = {name: hive.name, insp: [..._hive_insp]};
        this.inspHives.push(item);
        _hive_insp.forEach( insp => {
          let d1 : Date = new Date(insp.opsDate);
          d1.setHours(12 - (d1.getTimezoneOffset()/60));
          d1.setMinutes(0);
          d1.setSeconds(0);
          let index = serie.data.findIndex(e => new Date(e.name).getTime() === d1.getTime());
          if(index != -1){
            let new_item = {
              name:insp.opsDate,
              value:[insp.opsDate, serie.data[index].value[1], serie.data[index].value[2]]
            };
            data = [
              new_item
            ];
            if(insp.type == 'hive' && insp.apiaryInspId != null && this.melliFilters.getShowInsp()){
              let seriesIndex = new_series.findIndex( s => s.name === serie.name + ' | inspection');
              if(seriesIndex !== -1){
                new_series[seriesIndex].data.push(new_item);
              }
              else{
                let newSerie = this.createNewCustomSerie(serie, new_item, 'inspection', IMG_PATH + 'ui/calendbars/inspect-api_cb.png', 30, -30/2, -40/2);
                new_series.push(newSerie);
              }
            }
            if(insp.type == 'hive' && insp.apiaryInspId == null && this.melliFilters.getShowEvent()){
              let seriesIndex = new_series.findIndex( s => s.name === serie.name + ' | event');
              if(seriesIndex !== -1){
                new_series[seriesIndex].data.push(new_item);
              }
              else{
                let newSerie = this.createNewCustomSerie(serie, new_item, 'event', IMG_PATH + 'ui/calendbars/inspect_cb.png', 30, -30/2, -40/2);
                new_series.push(newSerie);
              }
            }
          }
        });
      },
      () => {},
      () => {
        new_series.forEach(s =>{
          this.option.baseOption.series.push(s);
        });
        this.loadAlertsByHive(hive, serie);
      }
    );
  }

  loadAlertsByHive(hive: RucheInterface, serie:any): void{
    let data = [];
    let new_series = [];
    this.alertService.getAlertByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _hive_alerts => {
        let item : AlertHiveItem = {name: hive.name, alerts: [..._hive_alerts]};
        this.alertHives.push(item);
        _hive_alerts.forEach( alert => {
          let d1 : Date = new Date(alert.opsDate);
          d1.setHours(12 - (d1.getTimezoneOffset()/60));
          d1.setMinutes(0);
          d1.setSeconds(0);
          let index = serie.data.findIndex(e => new Date(e.name).getTime() === d1.getTime());
          if(index !== -1){
            let new_item = {
              name: alert.opsDate,
              value:[alert.opsDate, serie.data[index].value[1], serie.data[index].value[2]]
            };
            data = [
              new_item
            ];
            if(this.melliFilters.getShowAlert() && this.melliFilters.getShowAlertIcon(alert.icon)){
              let seriesIndex = new_series.findIndex( s => s.name === serie.name + ' | alert | ' + alert.icon);
              if(seriesIndex !== -1){
                new_series[seriesIndex].data.push(new_item);
              }
              else{
                let newSerie = this.createNewCustomSerie(serie, new_item, 'alert | ' + alert.icon, IMG_PATH + 'alerts/ruche/' + alert.icon.toLowerCase() + '_cb.png', 30, -30/2, -40/2);
                new_series.push(newSerie);
              }
            }

          }
        })
      },
      () => {},
      () => {
        new_series.forEach(s =>{
          this.option.baseOption.series.push(s);
        });
        this.stackService.getBroodChartInstance().setOption(this.option);
        this.stackService.getBroodChartInstance().hideLoading();
      }
    );
  }

  /**
   *
   * @param markerSerie
   * @param date
   * @param series
   */
  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '<B>{D}</B> <br/>';
    let templateValue = '{*} {n}: <B>{v} {u}</B> {R}';
    let tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, Math.round(_serie.value).toString() ).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
    }).join('');

    return tooltipGlobal;
  }

  getInspTooltipFormatter(hiveName: string, indexSerie: number, indexHiveInspItem: number, indexHiveInsp: number): string{
    let insp : Inspection = this.inspHives[indexHiveInspItem].insp[indexHiveInsp];
    let date : Date = new Date(insp.opsDate);
    if(insp.apiaryInspId != null){
      let test = date.getTimezoneOffset();
      date.setHours(date.getHours() + (test / 60));
    }
    let res =
    '<div style="width:180px;">' +
    '<div style="height:30px;">' +
    '<h5 style="float:left"><b>' + hiveName + '</b></h5>' +
    '<h5 style="float:right"><b>' + this.unitService.getHourlyDate(date) + '</b></h5>' +
    '</div>';
    
    res += '<div style="margin-top: 10px;">';
    if(insp.description != null){
      res += '<p style="max-width:400px; white-space:normal; font-size:12px; font-family:\'Poppins\'; margin: 0;">' + insp.description + '</p>';
    }
    res += '</div>';

    res += '<div style="margin-top: 10px;">';
    if(insp.todo != null){
      res += '<p style="width:auto; max-width: 400px; white-space: normal; font-size:12px; font-family:\'Poppins\'; margin: 0;">' + insp.todo + '</p>';
    }
    if(insp.obs != null){
      res += '<div>';
      insp.obs.forEach( o => {
        let name = this.translate.instant('INSP_CONF.'+ o.name.toUpperCase());
        res += '<div style="display:flex; width:100%; font-size:12px; align-items:center;">';
        res += `<div style="width:25px; height:25px; margin-top:-5px; background-image:url(${IMG_PATH + 'inspects/' + o.name.toLowerCase() + '_cw.png'}); background-repeat:no-repeat; background-size:25px; background-position: center;"></div>`;
        res += '<div style="height:30px; display:flex; margin-left:10px; margin-top:5px; align-items:center; font-size:12px; width:150px; white-space: normal; line-height: 1em;">' + name + '</div>';
        res += '</div>';
      });
      res += '</div>';
    }
    res += '</div>';

    return res;
  }


  getAlertTooltipFormatter(hiveName: string, indexSerie: number, indexHiveAlertItem: number, indexHiveAlert: number): string{
    let alert : AlertInterface = this.alertHives[indexHiveAlertItem].alerts[indexHiveAlert];
    let date : Date = new Date(alert.opsDate);
    let name = this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + alert.icon.toUpperCase());
    let test = date.getTimezoneOffset();
    date.setHours(date.getHours() + (test / 60));
    let res =
    `<div style="width:180px;">` +
    `<div style="height:30px;">` +
    `<h5 style="float:left"><b>${hiveName}</b></h5>` +
    `<h5 style="float:right"><b>${this.unitService.getHourlyDate(date)}</b></h5>` +
    `</div>` +
    `<div style="width:100%; display:flex; align-items:center; margin-top:10px;">` +
    `<img style="margin-top:-5px;" width=25 height=25 src=${IMG_PATH + 'alerts/ruche/' + alert.icon.toLowerCase() + '_cw.png'}>` +
    `<p style="font-size:12px; margin-left:5px; font-family:'Poppins';" >${name}</p>` +
    `</div>`;
    return res;
  }


  insertNewEvent(hive_event: Inspection): void{
    let hive_name: string;
    this.rucheService.getHiveByHiveId(hive_event.hiveId).subscribe(
      _hive => {
        hive_name = _hive.name;
      },
      () => {},
      () => {
        for(let i=0; i<this.inspHives.length; i++){
          if(this.inspHives[i].name === hive_name){
            this.inspHives[i].insp.push(hive_event);
            break;
          }
        }

        let seriesEventIndex: number = -1;
        for(let i=0; i<this.option.baseOption.series.length; i++){
          let words = this.option.baseOption.series[i].name.split(' | ');
          if(words.includes(hive_name) && words.includes('event')){
            seriesEventIndex = i;
            break;
          }
        }

        if(seriesEventIndex === -1){
          this.insertAlertNewSerie(hive_event, hive_name);
        }
        else{
          this.insertAlertExistingSerie(hive_event, hive_name, seriesEventIndex);
        }
      }
    )

  }

  insertAlertNewSerie(hive_event: Inspection, hive_name: string): void{
     // create new serie if hive selected
     let selected = -1;
     selected = this.stackService.getHiveSelect().findIndex( h => h.name === hive_name );
     if(selected !== -1){
       let seriesIndex = -1;
       let seriesDataIndex = -1;
       for(let i=0; i<this.option.baseOption.series.length; i++){
         let words = this.option.baseOption.series[i].name.split(' | ');
         if(words.includes(hive_name) && words.length === 2 && this.option.baseOption.series[i].data.length != null){
           for(let j=0; j<this.option.baseOption.series[i].data.length; j++){
             let d1 : Date = new Date(hive_event.opsDate);
             d1.setHours(12 - (d1.getTimezoneOffset()/60));
             d1.setMinutes(0);
             d1.setSeconds(0);
             if(new Date(this.option.baseOption.series[i].data[j].name).getTime() === d1.getTime() && this.option.baseOption.series[i].data[j].value[1] != null){
               seriesIndex = i;
               seriesDataIndex = j;
               break;
             }
           }
         }
       }

       if(seriesDataIndex !== -1){
         let new_item = {
           name:hive_event.opsDate,
           value:[hive_event.opsDate, this.option.baseOption.series[seriesIndex].data[seriesDataIndex].value[1], this.option.baseOption.series[seriesIndex].data[seriesDataIndex].value[2]]
         };
         let data = [
           new_item
         ];
         let newSerie = this.createNewCustomSerie(this.option.baseOption.series[seriesIndex], new_item, 'event', IMG_PATH + 'ui/calendbars/inspect_cb.png', 30, -30/2, -40/2);
         this.option.baseOption.series.push(newSerie);
         this.stackService.getBroodChartInstance().setOption(this.option);
       }
     }
  }

  insertAlertExistingSerie(hive_event: Inspection, hive_name: string, seriesEventIndex: number): void{
    let seriesIndex = -1;
    let seriesDataIndex = -1;
    for(let i=0; i<this.option.baseOption.series.length; i++){
      let words = this.option.baseOption.series[i].name.split(' | ');
      if(words.includes(hive_name) && words.length === 2 && this.option.baseOption.series[i].data.length != null){
        for(let j=0; j<this.option.baseOption.series[i].data.length; j++){
          let d1 : Date = new Date(hive_event.opsDate);
          d1.setHours(12 - (d1.getTimezoneOffset()/60));
          d1.setMinutes(0);
          d1.setSeconds(0);
          if(new Date(this.option.baseOption.series[i].data[j].name).getTime() === d1.getTime() && this.option.baseOption.series[i].data[j].value[1] != null){
            seriesIndex = i;
            seriesDataIndex = j;
            break;
          }
        }
      }
    }

    let serie = Object.assign({}, this.option.baseOption.series[seriesIndex]);
    if(seriesDataIndex !== -1){
      let new_item = {
        name:hive_event.opsDate,
        value:[hive_event.opsDate, serie.data[seriesDataIndex].value[1], serie.data[seriesDataIndex].value[2]]
      };
      this.option.baseOption.series[seriesEventIndex].data.push(new_item);
      this.stackService.getBroodChartInstance().setOption(this.option);
    }
  }

  deleteEvents(ids: String[], insps: Inspection[]): void{
    loopids:
      for(let i = 0; i<ids.length; i++){
        let insp_delete: Inspection;
        let insp_item_index;
        let insp_index_del;
    loopinspHives:
        for(let j = 0; j<this.inspHives.length; j++){
          for(let k=0; k<this.inspHives[j].insp.length; k++){
            if( new Date(this.inspHives[j].insp[k].opsDate).getTime() === new Date(insps[i].opsDate).getTime() ){
              insp_delete = Object.assign({}, this.inspHives[j].insp[k]);
              insp_item_index = j;
              insp_index_del = k;
              break loopinspHives;
            }
          }
        }
    loopOptionSerie:
        for(let t=0; t<this.option.baseOption.series.length; t++){
          if(this.option.baseOption.series[t].data != null){
            for(let u=0; u<this.option.baseOption.series[t].data.length; u++){
              if(this.option.baseOption.series[t].data[u].name === insp_delete.opsDate){
                this.option.baseOption.series[t].data.splice(u, 1);
                this.inspHives[insp_item_index].insp.splice(insp_index_del, 1);
                break loopOptionSerie;
              }
            }
          }
        }
      }
      this.stackService.getBroodChartInstance().setOption(this.option);
  }

  deleteAlerts(ids: String[], alerts: AlertInterface[]): void{
    console.log(ids);
    loopids:
      for(let i = 0; i<ids.length; i++){
        let alert_delete: AlertInterface;
        let alert_item_index;
        let alert_index_del;
    loopAlertHives:
        for(let j = 0; j<this.alertHives.length; j++){
          for(let k=0; k<this.alertHives[j].alerts.length; k++){
            if( this.alertHives[j].alerts[k]._id === alerts[i]._id ){
              alert_delete = Object.assign({}, this.alertHives[j].alerts[k]);
              alert_item_index = j;
              alert_index_del = k;
              break loopAlertHives;
            }
          }
        }
    loopOptionSerie:
        for(let t=0; t<this.option.baseOption.series.length; t++){
          console.log(this.option.baseOption.series[t]);
          if(this.option.baseOption.series[t].data != null){
            for(let u=0; u<this.option.baseOption.series[t].data.length; u++){
              if(this.option.baseOption.series[t].data[u].name === alert_delete.opsDate
                 && this.option.baseOption.series[t].name.includes('alert')
                ){
                console.log(this.option.baseOption.series[t].data[u].name);
                console.log(alert_delete.opsDate);
                this.option.baseOption.series[t].data.splice(u, 1);
                this.alertHives[alert_item_index].alerts.splice(alert_index_del, 1);
                break loopOptionSerie;
              }
            }
          }
        }
      }
      this.stackService.getBroodChartInstance().setOption(this.option);
  }

  applyFilter(filter: string, show: boolean): void{
    if(show){
      this.loadSerieByFilter(filter);
      return;
    }
    if(!show){
      this.removeSerieByFilter(filter);
      return;
    }
  }

  openHelp(){
    let url = this.translate.instant('HELP.EXPLORE.BROOD');
    window.open(url);
  }

  ngOnDestroy(): void {
    this.stackService.broodChartInstance.dispose();
  }
}
