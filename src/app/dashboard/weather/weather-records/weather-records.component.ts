import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { BASE_OPTIONS } from '../../melli-charts/charts/BASE_OPTIONS';
import * as echarts from 'echarts';
import { WeatherOptionService } from '../service/weather-option.service';
import { UnitService } from '../../service/unit.service';
import { WeatherDateService } from '../service/weather-date.service';
import { TranslateService } from '@ngx-translate/core';
import { RucherService } from '../../service/api/rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { DailyManagerService } from '../../melli-charts/hive/service/daily-manager.service';
import { WeatherService } from '../../service/api/weather.service';
import { Observable } from 'rxjs';
import { SERIES } from '../../melli-charts/charts/SERIES';
import { Console } from 'console';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { _MatTabMixinBase } from '@angular/material/tabs/typings/tab';

const colors: string[] = ['rgb(20,150,255)', 'green', 'red', 'purple', 'orange', 'cyan', 'magenta', 'brown', 'grey'];

@Component({
  selector: 'app-weather-records',
  templateUrl: './weather-records.component.html',
  styleUrls: ['./weather-records.component.css']
})
export class WeatherRecordsComponent implements OnInit {

  public options: any;
  private valueSubjectComplete: number;
  private gridIndex: Array<number>;
  public user_apiaries: RucherModel[];

  private type_graph: string = 'desktop';

  constructor(
    private rucherService: RucherService,
    private userService: UserloggedService,
    public w_o_service: WeatherOptionService,
    private w_d_service: WeatherDateService,
    private weatherService: WeatherService,
    private unitService: UnitService,
    private translateService: TranslateService,
    private graphGlobal: GraphGlobal,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries].sort(this.compare);
      },
      () => {},
      () => {
        const elt = document.getElementsByClassName('apiaryGroup')[0];
        if (elt.classList.contains('apiary-group-weather-config')) {
          elt.classList.remove('apiary-group-weather-config');
        } 
        elt.classList.add('apiary-group-weather-records');
        this.w_d_service.today = new Date();

        this.options = Object.assign({}, BASE_OPTIONS.baseOptionWeather);
        this.options.series = [];
        this.options.yAxis = [];
        this.options.xAxis = [];
        this.valueSubjectComplete = 0;
        this.gridIndex = [0, 1, 2, 3];
        this.w_o_service.setRecordsChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-weather'),{},{height: '1400px'}));
        this.setOptionForChart();
        this.loadAllRecords((options: any) => {
          this.w_o_service.getRecordsChartInstance().setOption(options, true);
          this.w_o_service.getRecordsChartInstance().hideLoading();
        });
      }
    );
    
  }

  compare( a:RucherModel, b:RucherModel ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  setOptionForChart(){
    this.options.title[0].text = this.translateService.instant('WEATHER.GRAPH.TEMP');
    this.options.title[0].left = this.translateService.instant('WEATHER.GRAPH.TEMP_LEFT');
    this.options.title[1].text = this.translateService.instant('WEATHER.GRAPH.RAIN');
    this.options.title[1].left = this.translateService.instant('WEATHER.GRAPH.RAIN_LEFT');
    this.options.title[2].text = this.translateService.instant('WEATHER.GRAPH.HUMI');
    this.options.title[2].left = this.translateService.instant('WEATHER.GRAPH.HUMI_LEFT');
    this.options.title[3].text = this.translateService.instant('WEATHER.GRAPH.WIND');
    this.options.title[3].left = this.translateService.instant('WEATHER.GRAPH.WIND_LEFT');

    let yAxisTemp = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisTemp.name = this.graphGlobal.temp.name;
    yAxisTemp.min = function (value) {
      if(value.min < 0){
        let nb = Math.ceil(value.min) / 5;
        return Math.ceil(nb) * 5;
      }
      else{
        return 0;
      }
    };

    yAxisTemp.max = function (value) {
      if(value.max > 5){
        let nb = Math.ceil(value.max) / 5;
        return Math.ceil(nb) * 5;
      }
      else{
        return 40;
      }
    };
    yAxisTemp.gridIndex = 0;
    yAxisTemp.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisTemp);

    let xAxis = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxis.gridIndex = 0;
    xAxis.max = this.w_d_service.getRangeForRequest()[1];
    xAxis.min = this.w_d_service.getRangeForRequest()[0];
    xAxis.axisLabel.margin = 10;
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxis.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxis);

    let yAxisRain = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisRain.name = this.graphGlobal.rain.name;
    yAxisRain.min = 0;
    yAxisRain.max = 10;
    yAxisRain.gridIndex = 1;
    yAxisRain.interval = 1;
    yAxisRain.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisRain);

    let xAxisRain = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisRain.gridIndex = 1;
    xAxisRain.max = this.w_d_service.getRangeForRequest()[1];
    xAxisRain.min = this.w_d_service.getRangeForRequest()[0];
    xAxisRain.axisLabel.margin = 10;
    xAxisRain.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisRain.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisRain);

    let xAxisHumi = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisHumi.gridIndex = 2;
    xAxisHumi.max = this.w_d_service.getRangeForRequest()[1];
    xAxisHumi.min = this.w_d_service.getRangeForRequest()[0];
    xAxisHumi.axisLabel.margin = 10;
    xAxisHumi.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisHumi.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisHumi);

    let yAxisHumi = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisHumi.name = this.graphGlobal.humidity.name;
    yAxisHumi.min = 0;
    yAxisHumi.max = 100;
    yAxisHumi.gridIndex = 2;
    yAxisHumi.interval = 10;
    yAxisHumi.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisHumi);

    let yAxisWind = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisWind.name = this.graphGlobal.wind.name;
    yAxisWind.min = 0;
    yAxisWind.max = 25;
    yAxisWind.gridIndex = 3;
    yAxisWind.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisWind);

    let xAxisWind = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisWind.gridIndex = 3;
    xAxisWind.max = this.w_d_service.getRangeForRequest()[1];
    xAxisWind.min = this.w_d_service.getRangeForRequest()[0];
    xAxisWind.axisLabel.margin = 10;
    xAxisWind.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisWind.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisWind);

    this.options.tooltip.formatter = (params) => {
      return params.map((_elt, index) => {
        return this.getTooltipFormater(_elt.marker, (index === 0 ? this.unitService.getHourlyDate(_elt.data.name) : ''), new Array(
          {
            name: _elt.seriesName,
            value: this.unitService.getValRound(_elt.data.value[1]),
            unit:  this.graphGlobal.getUnitBySerieName(_elt.seriesId)
          }
        ));
      }).join('');
    }

    this.w_o_service.getRecordsChartInstance().setOption(this.options);

    let width = (<HTMLElement>document.getElementById("graph-weather")).offsetWidth
    if(document.body.clientWidth < 950){
      if(width < 800 && width > 500){
        this.mobile800Graph();
      }
      else if( width < 500 ){
        this.mobile500Graph();
      }
      else if( width > 800 ){
        this.desktopGraph();
      }
    }
    //if(new Date().getTime() > this.w_d_service.start.getTime() && new Date().getTime() < this.w_d_service.end.getTime() ){
      //this.insertMarklines();
    //}
  }

  insertMarklines(){
    let text = this.unitService.getHourlyDate(new Date());
    this.options.series.push({
      type: 'line',
      showSymbol: false,
      data: [],
      markLine: {
        data: [ {name: "", xAxis: new Date()} ],
        lineStyle: {normal: { type:'dashed',color: 'rgb(0, 0, 150)', width: 1} },
        symbol: ['circle', 'none'],
        label:{
          formatter: function(){
            return '';
          }
        },
        silent: true,
      },
      name:"markLine",
      yAxisIndex: 0,
      xAxisIndex: 0
    });
    this.options.series.push({
      type: 'line',
      showSymbol: false,
      data: [],
      markLine: {
        data: [ {name: "", xAxis: new Date()} ],
        lineStyle: {normal: { type:'dashed',color: 'rgb(0, 0, 150)', width: 1} },
        symbol: ['circle', 'none'],
        label:{
          formatter: function(){
            return '';
          }
        },
        silent: true,
      },
      name:"markLine",
      yAxisIndex: 1,
      xAxisIndex: 1
    });
    this.options.series.push({
      type: 'line',
      showSymbol: false,
      data: [],
      markLine: {
        data: [ {name: "", xAxis: new Date()} ],
        lineStyle: {normal: { type:'dashed',color: 'rgb(0, 0, 150)', width: 1} },
        symbol: ['circle', 'none'],
        label:{
          formatter: function(){
            return '';
          }
        },
        silent: true,
      },
      name:"markLine",
      yAxisIndex: 2,
      xAxisIndex: 2
    });
    this.options.series.push({
      type: 'line',
      showSymbol: false,
      data: [],
      markLine: {
        data: [ {name: "", xAxis: new Date()} ],
        lineStyle: {normal: { type:'dashed',color: 'rgb(0, 0, 150)', width: 1} },
        symbol: ['circle', 'none'],
        label:{
          formatter: function(){
            return '';
          }
        },
        silent: true,
      },
      name:"markLine",
      yAxisIndex: 3,
      xAxisIndex: 3
    });
    this.w_o_service.getRecordsChartInstance().setOption(this.options);
  }

  onResize(event: any) {
    this.w_o_service.getRecordsChartInstance().resize({
      width: 'auto',
      height: '1400px'
    });
    let width = (<HTMLElement>document.getElementById("graph-weather")).offsetWidth
    if(document.body.clientWidth < 950){
      if( (this.type_graph === 'desktop' || this.type_graph === 'mobile500') && width < 800 && width > 500){
        this.mobile800Graph();
      }
      else if((this.type_graph === 'mobile800' || this.type_graph === 'desktop') && width < 500){
        this.mobile500Graph();
      }
      else if((this.type_graph === 'mobile800' || this.type_graph === 'mobile500') && width > 800){
        this.desktopGraph();
      }
    }
    else if((this.type_graph === 'mobile800' || this.type_graph === 'mobile500')){
      this.desktopGraph();
    }
    
  }

  mobile800Graph(){
    console.log('allo800');
    this.type_graph = 'mobile800';
    this.options.legend.orient = "horizontal";
    delete this.options.legend.right;
    delete this.options.legend.left;
    this.options.legend.center = 'center';
    this.options.legend.top = 0;
    this.options.legend.width = '100%';
    this.options.title[0].top = "3%";
    this.options.title.forEach((_t,i) => {
      _t.top = (3 + i*16) + '%';
      _t.left = 'center';
    });
    this.options.grid[0].top = "5%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (5 + i*16) + '%';
      _t.width = "85%";
      _t.left = "8%";
    });
    this.options.xAxis.forEach(_a => _a.axisLabel.fontSize = 10);
    this.options.yAxis.forEach(_a => {
      _a.axisLabel.fontSize = 10;
      _a.nameGap = 20;
      _a.nameTextStyle = {
        fontSize : 10
      }
    });
    this.w_o_service.getRecordsChartInstance().setOption(this.options);
  }

  mobile500Graph(){
    console.log('allo500');
    this.type_graph = 'mobile500';
    this.options.legend.orient = "horizontal";
    delete this.options.legend.right;
    delete this.options.legend.left;
    this.options.legend.center = 'center';
    this.options.legend.top = 0;
    this.options.legend.width = '100%';
    this.options.title[0].top = "5%";
    this.options.title.forEach((_t,i) => {
      _t.top = (5 + i*16) + '%'
      _t.left = 'center';
    });
    this.options.grid[0].top = "7%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (7+ i*16) + '%';
      _t.width = "83%";
      _t.left = "10%";
    });
    this.options.xAxis.forEach(_a => _a.axisLabel.fontSize = 8);
    this.options.yAxis.forEach(_a => {
      _a.axisLabel.fontSize = 8;
      _a.nameGap = 15;
      _a.nameTextStyle = {
        fontSize : 9
      }
    });
    this.w_o_service.getRecordsChartInstance().setOption(this.options);
  }

  desktopGraph(){
    console.log('allo');
    this.type_graph = 'desktop';
    this.options.legend.orient = "horizontal";
    this.options.legend.right = 10;
    this.options.legend.top = "5%";
    this.options.legend.width = 150;
    delete this.options.legend.center;
    this.options.title[0].top = "3%";
    this.options.title.forEach((_t,i) => _t.top = (3 + i*16) + '%');
    this.options.title[0].left = this.translateService.instant('WEATHER.GRAPH.TEMP_LEFT');
    this.options.title[1].left = this.translateService.instant('WEATHER.GRAPH.RAIN_LEFT');
    this.options.title[2].left = this.translateService.instant('WEATHER.GRAPH.HUMI_LEFT');
    this.options.title[3].left = this.translateService.instant('WEATHER.GRAPH.WIND_LEFT');

    this.options.grid[0].top = "5%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (5 + i*16) + '%';
      _t.width = "75%";
      _t.left = "6%";
    });
    this.options.xAxis.forEach(_a => _a.axisLabel.fontSize = 12);
    this.options.yAxis.forEach(_a => {
      _a.axisLabel.fontSize = 12;
      _a.nameGap = 25;
      _a.nameTextStyle = {
        fontSize : 16
      }
    });
    this.w_o_service.getRecordsChartInstance().setOption(this.options);
  }

  /**
   *
   *
   * @param {string} markerSerie
   * @param {string} date
   * @param {Array<any>} series
   * @returns {string}
   * @memberof StackComponent
   */
   getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '<B>{D}</B> <br/>';
    let templateValue = '{*} {n}: <B>{v} {u}</B> {R}';
    let tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
    }).join('');

    return tooltipGlobal;
  }

  loadAllRecords(next: Function){
    if(this.w_o_service.getRecordsChartInstance().getOption().series.findIndex(_s => _s.name === "markLine") === -1){
      if(new Date().getTime() > this.w_d_service.start.getTime() && new Date().getTime() < this.w_d_service.end.getTime() ){
        this.insertMarklines();
      }
    }
    let temp: any[], rain: any[], wind: any[], humi: any[];
    this.w_o_service.getRecordsChartInstance().showLoading();
    let obsArray = [];
    obsArray = this.w_o_service.getApiariesSelected().map(_a => {
      return [
        { apiary: _a,
          name: _a.name,
          obs: this.weatherService.getCurrentHourlyWeather(_a._id, this.w_d_service.getCurrentRangeForRequest())
        },
        { apiary: _a,
          name: _a.name,
          obs: this.weatherService.getForecastHourlyWeather(_a._id, this.w_d_service.getForecastRangeForRequest()) 
        },
      
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _records => {
        //console.log(_records);
        _records.forEach((_apiRec: any[], index) => {
          if(index % 2 === 0){
            temp = [];
            rain = [];
            humi = [];
            wind = [];
            temp = _apiRec.map(_elt => {
              return { date: _elt.date, value: _elt.value[0].temp ? _elt.value[0].temp : null , sensorRef: _elt.sensorRef, type: "temp" }
            });
            rain = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[2]['1h'] ? _elt.value[2]['1h'] : null , sensorRef: _elt.sensorRef, type: "rain" }
            });
            humi = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].humidity ? _elt.value[0].humidity : null , sensorRef: _elt.sensorRef, type: "humi" }
            });
            wind = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[1].speed ? _elt.value[1].speed : null , sensorRef: _elt.sensorRef, type: "wind" }
            });
          }
          else{
            //ADD TEMP TO GRAPH
            this.getSerieByData(temp.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].temp ? _elt.value[0].temp : null , sensorRef: _elt.sensorRef, type: "temp" }
            }) ), obsArray[index].name, (serieComplete: any) => {
              
              serieComplete.id = "Temp " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 0;
              serieComplete.xAxisIndex = 0;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              /*this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });*/
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series[indexSerie] = Object.assign({}, serieComplete);
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
              }
            });
            //ADD RAIN TO GRAPH
            this.getSerieByData(rain.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[2]['3h'] ?  _elt.value[2]['3h'] : null , sensorRef: _elt.sensorRef, type: "rain" }
            }) ), obsArray[index].name, (serieComplete: any) => {

              serieComplete.type = 'bar';
              serieComplete.id = "Rain " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 1;
              serieComplete.xAxisIndex = 1;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              /*this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });*/
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series[indexSerie] = Object.assign({}, serieComplete);
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
              }
            });
            //ADD HUMIDITY TO GRAPH
            this.getSerieByData(humi.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].humidity ? _elt.value[0].humidity : null , sensorRef: _elt.sensorRef, type: "humi" }
            }) ), obsArray[index].name, (serieComplete: any) => {

              serieComplete.id = "Hum " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 2;
              serieComplete.xAxisIndex = 2;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              /*this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });*/
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series[indexSerie] = Object.assign({}, serieComplete);
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
              }
            });
            //ADD WIND TO GRAPH
            this.getSerieByData(wind.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[1].speed ? _elt.value[1].speed : null , sensorRef: _elt.sensorRef, type: "wind" }
            }) ), obsArray[index].name, (serieComplete: any) => {

              serieComplete.id = "Wind " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 3;
              serieComplete.xAxisIndex = 3;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series[indexSerie] = Object.assign({}, serieComplete);
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
          }
        });
      },
      () => {},
      () => {
        //console.log(this.options.series);
        next(this.options);
      }
    );
  }

  loadRecords(apiary: RucherModel){
    if(this.w_o_service.getRecordsChartInstance().getOption().series.findIndex(_s => _s.name === "markLine") === -1){
      if(new Date().getTime() > this.w_d_service.start.getTime() && new Date().getTime() < this.w_d_service.end.getTime() ){
        this.insertMarklines();
      }
    }
    let temp: any[], rain: any[], wind: any[], humi: any[];
    this.w_o_service.getRecordsChartInstance().showLoading();
    let obsArray = [];
    obsArray = [
        { apiary: apiary,
          name: apiary.name,
          obs: this.weatherService.getCurrentHourlyWeather(apiary._id, this.w_d_service.getRangeForRequest())
        },
        { apiary: apiary,
          name: apiary.name,
          obs: this.weatherService.getForecastHourlyWeather(apiary._id, this.w_d_service.getRangeForRequest()) 
        },
    ];
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _records => {
        //console.log(_records);
        _records.forEach((_apiRec: any[], index) => {
          if(index % 2 === 0){
            temp = [];
            rain = [];
            humi = [];
            wind = [];
            temp = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].temp ? _elt.value[0].temp : null , sensorRef: _elt.sensorRef, type: "temp" }
            });
            rain = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[2]['1h'] ? _elt.value[2]['1h'] : null , sensorRef: _elt.sensorRef, type: "rain" }
            });
            humi = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].humidity ? _elt.value[0].humidity : null , sensorRef: _elt.sensorRef, type: "humi" }
            });
            wind = _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[1].speed ? _elt.value[1].speed : null , sensorRef: _elt.sensorRef, type: "wind" }
            });
          }
          else{
            //ADD TEMP TO GRAPH
            this.getSerieByData(temp.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].temp ? _elt.value[0].temp : null , sensorRef: _elt.sensorRef, type: "temp" }
            }) ), obsArray[index].name, (serieComplete: any) => {
              
              serieComplete.id = "Temp " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 0;
              serieComplete.xAxisIndex = 0;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              /*this.options.xAxis.forEach(_xAxe => {
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
              });*/
              if(serieComplete.data.length > 0){
                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series[indexSerie] = Object.assign({}, serieComplete);
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                }
              }
             
            });
            //ADD RAIN TO GRAPH
            this.getSerieByData(rain.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[2]["1h"] ? _elt.value[2]["1h"] : null , sensorRef: _elt.sensorRef, type: "rain" }
            }) ), obsArray[index].name, (serieComplete: any) => {

              serieComplete.type = 'bar';
              serieComplete.id = "Rain " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 1;
              serieComplete.xAxisIndex = 1;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              /*this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });*/
              if(serieComplete.data.length > 0){
                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series[indexSerie] = Object.assign({}, serieComplete);
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                }
              }
            });
            //ADD HUMIDITY TO GRAPH
            this.getSerieByData(humi.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].humidity ? _elt.value[0].humidity : null , sensorRef: _elt.sensorRef, type: "humi" }
            }) ), obsArray[index].name, (serieComplete: any) => {

              serieComplete.id = "Hum " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 2;
              serieComplete.xAxisIndex = 2;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              /*this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });*/
              if(serieComplete.data.length > 0){
                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series[indexSerie] = Object.assign({}, serieComplete);
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                }
              }
            });
            //ADD WIND TO GRAPH
            this.getSerieByData(wind.concat( _apiRec.map(_elt => { 
              return { date: _elt.date, value: _elt.value[1].speed ? _elt.value[1].speed : null , sensorRef: _elt.sensorRef, type: "wind" }
            }) ), obsArray[index].name, (serieComplete: any) => {

              serieComplete.id = "Wind " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 3;
              serieComplete.xAxisIndex = 3;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary)
              };
              this.options.xAxis.forEach(_xAxe => {
                _xAxe.min = this.w_d_service.getRangeForRequest()[0];
                _xAxe.max = this.w_d_service.getRangeForRequest()[1];
              });
              if(serieComplete.data.length > 0){
                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series[indexSerie] = Object.assign({}, serieComplete);
                } else {
                  this.options.legend.data.push(serieComplete.name);
                  this.options.series.push(Object.assign({}, serieComplete));
                }
              }
            });
          }
        });
      },
      () => {},
      () => {
        this.options.xAxis.forEach(_x => {
          _x.max = this.w_d_service.getRangeForRequest()[1];
          _x.min = this.w_d_service.getRangeForRequest()[0];
        });
        this.w_o_service.getRecordsChartInstance().setOption(this.options, true);
        this.w_o_service.getRecordsChartInstance().hideLoading();
      }
    );
  }

  removeRecords(apiary: RucherModel){
    let option = this.w_o_service.getRecordsChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name && _filter.name.includes(apiary.name.substr(0,5)));
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.options.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.w_o_service.getRecordsChartInstance().setOption(option, true);
  }

  getSerieByData(data: any, nameSerie: string, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach(_data => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, SERIES.line);
        serieTmp.name = nameSerie.substr(0,5) + ' | ' + (_data.sensorRef === 'WeatherSource' ? 'WeatherS' : _data.sensorRef);
        if (nameSerie.indexOf('ext') !== -1 || nameSerie.indexOf('Ext') !== -1) {
          serieTmp.lineStyle = {
            normal: {
                type: 'dashed'
            }
          };
        }
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, typeof _map.value === 'string' ? _map.value.replace(/,/ , '.') : _map.value , _map.sensorRef] };
        });
        next(serieTmp);
      }
    });
  }

  getColor(apiary: RucherModel): string{
    let index = this.user_apiaries.findIndex(_a => _a._id === apiary._id);
    return colors[index];
  }

  ngOnDestroy(){
    this.w_o_service.recordsChartInstance.dispose();
  }

}
