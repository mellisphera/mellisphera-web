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
import { WeatherService } from '../../service/api/weather.service';
import { Observable } from 'rxjs';
import { SERIES } from '../../melli-charts/charts/SERIES';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { WeatherSource } from '../../../_model/weatherSource';
import { WeatherSrcsService } from '../../service/api/weather-srcs.service';
import { RecordService } from '../../service/api/record.service';
import { Record } from '../../../_model/record';
import { CurrentIndexService } from '../../service/api/current-index.service';
import { ForecastIndexService } from '../../service/api/forecast-index.service';
import { WSAEACCES } from 'constants';

const colors: any = {
  local: ['rgb(50,160,210)', 'rgb(0,170,0)', 'rgb(255,0,0)', 'rgb(150,0,255)', 'rgb(220,150,0)', 'rgb(0,0,220)', 'rgb(150,0,150)', 'rgb(120,80,0)', 'rgb(150,150,150)'],
  ws: ['rgb(140,219,255)', 'rgb(122,223,134)', 'rgb(255,170,170)', 'rgb(200,130,255)', 'rgb(255,210,125)', 'rgb(130,130,255)', 'rgb(240,110,240)', 'rgb(190, 160, 90)', 'rgb(210,210,210)']
};

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

  private currentWSByApiary: WeatherSource[] = [];

  private type_graph: string = 'desktop';

  constructor(
    private rucherService: RucherService,
    private userService: UserloggedService,
    public w_o_service: WeatherOptionService,
    private w_d_service: WeatherDateService,
    private weatherService: WeatherService,
    private w_srcs_service: WeatherSrcsService,
    private unitService: UnitService,
    private translateService: TranslateService,
    private graphGlobal: GraphGlobal,
    private recordService: RecordService,
    private currentIdx: CurrentIndexService,
    private forecastIdx: ForecastIndexService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries].sort(this.compare);
        this.user_apiaries = this.user_apiaries.filter(apiary => apiary !== null && apiary.userId === this.userService.getIdUserLoged());
      },
      () => {},
      () => {
        this.getUserWeatherSrcs(() => {
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
            //console.log(this.options.series);
          });
        })
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

  getUserWeatherSrcs(next: Function){
    this.w_srcs_service.requestUserWeatherSrcsWithDateBetween(this.userService.getIdUserLoged(), this.w_d_service.getCurrentRangeForRequest()).subscribe(
      (_ws: WeatherSource[]) => {
        //console.log(_ws);
        this.currentWSByApiary = [..._ws];
      },
      () => {},
      () => {
        next();
      }
    )
  }

  setOptionForChart(){
    this.options.title[0].text = this.translateService.instant('WEATHER.GRAPH.NECTAR');
    this.options.title[0].left = this.translateService.instant('WEATHER.GRAPH.NECTAR_LEFT');
    this.options.title[1].text = this.translateService.instant('WEATHER.GRAPH.FLIGHT');
    this.options.title[1].left = this.translateService.instant('WEATHER.GRAPH.FLIGHT_LEFT');
    this.options.title[2].text = this.translateService.instant('WEATHER.GRAPH.TEMP');
    this.options.title[2].left = this.translateService.instant('WEATHER.GRAPH.TEMP_LEFT');
    this.options.title[3].text = this.translateService.instant('WEATHER.GRAPH.HUMI');
    this.options.title[3].left = this.translateService.instant('WEATHER.GRAPH.HUMI_LEFT');
    this.options.title[4].text = this.translateService.instant('WEATHER.GRAPH.RAIN');
    this.options.title[4].left = this.translateService.instant('WEATHER.GRAPH.RAIN_LEFT');
    this.options.title[5].text = this.translateService.instant('WEATHER.GRAPH.WIND');
    this.options.title[5].left = this.translateService.instant('WEATHER.GRAPH.WIND_LEFT');

    let yAxisNec = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisNec.name = this.translateService.instant('WEATHER.GRAPH.NECTAR_YAXIS');
    yAxisNec.min = 0;
    yAxisNec.max = 110;
    yAxisNec.gridIndex = 0;
    yAxisNec.interval = 10;
    yAxisNec.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisNec);

    let xAxisNec = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisNec.gridIndex = 0;
    xAxisNec.max = this.w_d_service.getRangeForRequest()[1];
    xAxisNec.min = this.w_d_service.getRangeForRequest()[0];
    xAxisNec.axisLabel.margin = 10;
    xAxisNec.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisNec.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisNec);

    let yAxisFli = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisFli.name = this.translateService.instant('WEATHER.GRAPH.FLIGHT_YAXIS');
    yAxisFli.min = 0;
    yAxisFli.max = 110;
    yAxisFli.gridIndex = 1;
    yAxisFli.interval = 10;
    yAxisFli.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisFli);

    let xAxisFli = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisFli.gridIndex = 1;
    xAxisFli.max = this.w_d_service.getRangeForRequest()[1];
    xAxisFli.min = this.w_d_service.getRangeForRequest()[0];
    xAxisFli.axisLabel.margin = 10;
    xAxisFli.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisFli.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisFli);

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
    yAxisTemp.gridIndex = 2;
    yAxisTemp.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisTemp);

    let xAxis = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxis.gridIndex = 2;
    xAxis.max = this.w_d_service.getRangeForRequest()[1];
    xAxis.min = this.w_d_service.getRangeForRequest()[0];
    xAxis.axisLabel.margin = 10;
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxis.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxis);

    let xAxisHumi = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisHumi.gridIndex = 3;
    xAxisHumi.max = this.w_d_service.getRangeForRequest()[1];
    xAxisHumi.min = this.w_d_service.getRangeForRequest()[0];
    xAxisHumi.axisLabel.margin = 10;
    xAxisHumi.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisHumi.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisHumi);

    let yAxisHumi = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisHumi.name = this.translateService.instant('WEATHER.GRAPH.HUMI_YAXIS');
    yAxisHumi.min = 0;
    yAxisHumi.max = 100;
    yAxisHumi.gridIndex = 3;
    yAxisHumi.interval = 10;
    yAxisHumi.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisHumi);

    let yAxisRain = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisRain.name = this.translateService.instant('WEATHER.GRAPH.RAIN_YAXIS') + '(' + this.graphGlobal.rain.unitT + ')';
    yAxisRain.min = 0;
    yAxisRain.max = 10;
    yAxisRain.gridIndex = 4;
    yAxisRain.interval = 1;
    yAxisRain.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisRain);

    let xAxisRain = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisRain.gridIndex = 4;
    xAxisRain.max = this.w_d_service.getRangeForRequest()[1];
    xAxisRain.min = this.w_d_service.getRangeForRequest()[0];
    xAxisRain.axisLabel.margin = 10;
    xAxisRain.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisRain.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisRain);

    let yAxisWind = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisWind.name = this.graphGlobal.wind.name;
    yAxisWind.min = 0;
    yAxisWind.max = 25;
    yAxisWind.gridIndex = 5;
    yAxisWind.axisLabel.margin = 5;
    this.options.yAxis.push(yAxisWind);

    let xAxisWind = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisWind.gridIndex = 5;
    xAxisWind.max = this.w_d_service.getRangeForRequest()[1];
    xAxisWind.min = this.w_d_service.getRangeForRequest()[0];
    xAxisWind.axisLabel.margin = 10;
    xAxisWind.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    xAxisWind.axisLabel.fontSize = 12;
    this.options.xAxis.push(xAxisWind);

    this.options.tooltip.formatter = (params) => {
      return params.filter(_p => _p.seriesId.split(" ")[0] === params[0].seriesId.split(" ")[0]).map((_elt, index) => {
        let date = (index === 0 ? _elt.seriesId.split(" ")[0] === "Nectar" || _elt.seriesId.split(" ")[0] === "Flight" ? this.unitService.getHourlyDate(_elt.data.name).substr(0,10) + " 12:00" : this.unitService.getHourlyDate(_elt.data.name) : '' )
        return this.getTooltipFormater(_elt.marker, date, new Array(
          {
            name: _elt.seriesName,
            value: this.unitService.getValRound(_elt.data.value[1]),
            unit:  this.graphGlobal.getWeatherUnitBySerieName(_elt.seriesId),
            sensorRef: _elt.data.value[2]
          }
        ));
      }).join('');
      /*return this.getTooltipFormater(params[0].marker, this.unitService.getHourlyDate(params[0].data.name), new Array(
        {
          name: params[0].seriesName,
          value: this.unitService.getValRound(params[0].data.value[1]),
          unit:  this.graphGlobal.getWeatherUnitBySerieName(params[0].seriesId),
          sensorRef: params[0].data.value[2]
        }
      ));*/
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
    }
    else{
      if( document.body.clientWidth < 1100){
        this.desktop1100Graph();
      }
      else{
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
      yAxisIndex: 4,
      xAxisIndex: 4
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
      yAxisIndex: 5,
      xAxisIndex: 5
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
      if( (this.type_graph === 'desktop' || this.type_graph === 'desktop1100' || this.type_graph === 'mobile500') && width < 800 && width > 500){
        this.mobile800Graph();
      }
      else if((this.type_graph === 'mobile800' || this.type_graph === 'desktop1100' || this.type_graph === 'desktop') && width < 500){
        this.mobile500Graph();
      }
      else if((this.type_graph === 'mobile800' || this.type_graph === 'mobile500') && width > 800){
        if(width < 1100){
          this.desktop1100Graph();
        }
        else this.desktopGraph();
      }
    }
    else if((this.type_graph === 'mobile800' || this.type_graph === 'mobile500') && width < 1100){
      this.desktop1100Graph();
    }
    else{
      this.desktopGraph();
    }
    
  }

  mobile800Graph(){
    //console.log('allo800');
    this.type_graph = 'mobile800';
    this.options.legend.orient = "horizontal";
    delete this.options.legend.right;
    delete this.options.legend.left;
    this.options.legend.center = 'center';
    this.options.legend.top = 0;
    this.options.legend.width = '100%';
    this.options.title[0].top = "3%";
    this.options.title.forEach((_t,i) => {
      _t.top = (3 + i*15) + '%';
      _t.left = 'center';
    });
    this.options.grid[0].top = "5%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (5 + i*15) + '%';
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
    //console.log('allo500');
    this.type_graph = 'mobile500';
    this.options.legend.orient = "horizontal";
    delete this.options.legend.right;
    delete this.options.legend.left;
    this.options.legend.center = 'center';
    this.options.legend.top = 0;
    this.options.legend.width = '100%';
    this.options.title[0].top = "7%";
    this.options.title.forEach((_t,i) => {
      _t.top = (7 + i*15) + '%'
      _t.left = 'center';
    });
    this.options.grid[0].top = "9%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (9+ i*15) + '%';
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

  desktop1100Graph(){
    //console.log('allo1100');
    this.type_graph = 'desktop1100';
    this.options.legend.orient = "horizontal";
    this.options.legend.center = 'center';
    this.options.legend.top = 0;
    delete this.options.legend.right;
    delete this.options.legend.left;
    this.options.legend.width = '100%';
    this.options.title[0].left = this.translateService.instant('WEATHER.GRAPH.NECTAR_LEFT');
    this.options.title[1].left = this.translateService.instant('WEATHER.GRAPH.FLIGHT_LEFT');
    this.options.title[2].left = this.translateService.instant('WEATHER.GRAPH.TEMP_LEFT');
    this.options.title[3].left = this.translateService.instant('WEATHER.GRAPH.HUMI_LEFT');
    this.options.title[4].left = this.translateService.instant('WEATHER.GRAPH.RAIN_LEFT');
    this.options.title[5].left = this.translateService.instant('WEATHER.GRAPH.WIND_LEFT');

    this.options.title[0].top = "3%";
    this.options.title.forEach((_t,i) => {
      _t.top = (3 + i*15) + '%';
      _t.left = 'center';
    });
    this.options.grid[0].top = "5%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (5 + i*15) + '%';
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

  desktopGraph(){
    //console.log('allo');
    this.type_graph = 'desktop';
    this.options.legend.orient = "horizontal";
    this.options.legend.center = 'center';
    delete this.options.legend.center;
    this.options.title[0].top = "3%";
    this.options.title.forEach((_t,i) => _t.top = (3 + i*15) + '%');
    this.options.title[0].left = this.translateService.instant('WEATHER.GRAPH.NECTAR_LEFT');
    this.options.title[1].left = this.translateService.instant('WEATHER.GRAPH.FLIGHT_LEFT');
    this.options.title[2].left = this.translateService.instant('WEATHER.GRAPH.TEMP_LEFT');
    this.options.title[3].left = this.translateService.instant('WEATHER.GRAPH.HUMI_LEFT');
    this.options.title[4].left = this.translateService.instant('WEATHER.GRAPH.RAIN_LEFT');
    this.options.title[5].left = this.translateService.instant('WEATHER.GRAPH.WIND_LEFT');

    this.options.grid[0].top = "5%";
    this.options.grid.forEach((_t,i) => {
      _t.top = (5 + i*15) + '%';
      _t.width = "85%";
      _t.left = "6%";
    });
    this.options.xAxis.forEach(_a => _a.axisLabel.fontSize = 12);
    this.options.yAxis.forEach(_a => {
      _a.axisLabel.fontSize = 12;
      _a.nameGap = 25;
      _a.nameTextStyle = {
        fontSize : 12
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
      let sensor = _serie.name.split('|')[1] === 'WeatherS' ? 'WeatherS' : _serie.sensorRef;
      return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' + sensor);
    }).join('');

    return tooltipGlobal;
  }

  loadAllRecords(next: Function){
    this.options.series = [];
    if(this.options.series.findIndex(_s => _s.name === "markLine") === -1){
      if(new Date().getTime() > this.w_d_service.start.getTime() && new Date().getTime() < this.w_d_service.end.getTime() ){
        this.insertMarklines();
      }
    }
    this.w_o_service.getRecordsChartInstance().showLoading();
    this.loadAllWithWeatherSource((options:any) => {
        //this.w_o_service.getRecordsChartInstance().setOption(options, true);
        //this.w_o_service.getRecordsChartInstance().hideLoading();
        
        if(this.currentWSByApiary.length > 0){
          this.loadAllWithChosenSource((options:any) => {
            next(options);
          });
        }
        else{
          next(options);
        }
    });
  }

  loadAllWithWeatherSource(next: Function){
    let temp: any[], rain: any[], wind: any[], humi: any[];
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
            /*console.log(_apiRec);
            console.log(_apiRec = _apiRec.filter((_r, i, self) =>
              i === self.findIndex((t) => (
                t.date === _r.date
              ))
            ))*/
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
              
              serieComplete.id = "Temp " + obsArray[index].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 2;
              serieComplete.xAxisIndex = 2;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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
              serieComplete.id = "Rain " + obsArray[index].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 4;
              serieComplete.xAxisIndex = 4;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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

              serieComplete.id = "Humi " + obsArray[index].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 3;
              serieComplete.xAxisIndex = 3;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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

              serieComplete.id = "Wind " + obsArray[index].name.substr(0, 5) + " " + "WeatherS";
              serieComplete.yAxisIndex = 5;
              serieComplete.xAxisIndex = 5;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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
        this.loadAllIndexesWeatherSource((options)=> {
          next(this.options);
        })
      }
    );
  }

  loadAllIndexesWeatherSource(next: Function){
    let nec: any[] = [], fli: any[] = [];
    let obsArray = [];
    obsArray = this.w_o_service.getApiariesSelected().map(_a => {
      return [
        { apiary: _a,
          name: _a.name,
          obs: this.currentIdx.getCurrentIndexByApiaryAndDateBetweenWS(_a._id, this.w_d_service.getCurrentRangeForRequest())
        },
        { apiary: _a,
          name: _a.name,
          obs: this.forecastIdx.getForecastIndexByApiaryAndDateBetween(_a._id, this.w_d_service.getForecastRangeForRequest()) 
        },    
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _indexes => {
        //console.log(_indexes);
        _indexes.forEach((_apiIdx: any[], index) => {
          /*_apiIdx.forEach( (_r) => {
            //_r.date = _r.date.substr(0, 11) + '10:00:00.000+0000';
            _r.date = new Date(_r.date).toUTCString();
            //console.log(new Date(_r.date).toUTCString());
          });*/
          if(index % 2 === 0){
            nec = [];
            fli = [];
            nec = _apiIdx.map(_elt => {
              return { date: _elt.date, value:_elt.nectarIdx*100, sensorRef: 'WeatherSource', type: "nec" }
            });
            fli = _apiIdx.map(_elt => {
              return { date: _elt.date, value:_elt.flightIdx*100, sensorRef: 'WeatherSource', type: "nec" }
            });
          }
          else{
            //ADD NECTAR TO GRAPH
            this.getSerieByData(nec.concat( _apiIdx.map(_elt => { 
              return { date: _elt.date, value: _elt.nectarIdx*100, sensorRef:'WeatherSource', type: "nec" }
            }) ), obsArray[index].name, (serieComplete: any) => {
              
              serieComplete.type = 'bar';

              serieComplete.id = "Nectar " + obsArray[index].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 0;
              serieComplete.xAxisIndex = 0;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') ,
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

            //ADD FLIGHT TO GRAPH
            this.getSerieByData(fli.concat( _apiIdx.map(_elt => { 
              return { date: _elt.date, value: _elt.flightIdx*100, sensorRef:'WeatherSource', type: "nec" }
            }) ), obsArray[index].name, (serieComplete: any) => {
              
              serieComplete.type = 'bar';
              serieComplete.id = "Flight " + obsArray[index].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 1;
              serieComplete.xAxisIndex = 1;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') ,
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
          }
        });
      },
      () => {},
      () => {
        next(this.options);
      }
    )
  }

  loadAllWithChosenSource(next: Function){
    let temp: any[], rain: any[], wind: any[], humi: any[];
    let recordsArr: any[][] = [];
    let obsArray = [];
    obsArray = this.currentWSByApiary.filter(_ws => this.w_o_service.getApiariesSelected().some(_a => _a._id === _ws.apiaryId)).map(_ws => {
      let start: Date = new Date(_ws.start) < this.w_d_service.getCurrentRangeForRequest()[0] ? this.w_d_service.getCurrentRangeForRequest()[0] : new Date(_ws.start);
      let end: Date = _ws.end ? (new Date(_ws.end) > this.w_d_service.getCurrentRangeForRequest()[1] ? this.w_d_service.getCurrentRangeForRequest()[1] : new Date(_ws.end)) : this.w_d_service.getCurrentRangeForRequest()[1];
      return [
        { apiary: this.w_o_service.getApiariesSelected().find(_a => _a._id === _ws.apiaryId),
          ws: _ws,
          name: _ws.apiaryName,
          obs: _ws.sourceType === "Station Davis" ? this.weatherService.getCurrentHourlyWeatherWithWSrcs(_ws.apiaryId, "WeatherLink", [start,end]) : this.recordService.getRecordsBySensorRefAndDateBetween(_ws.sourceId, [start, end])
        },
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _sensorRecords => {
        //console.log(_sensorRecords);
        _sensorRecords.forEach((_arr: any[],i) => {
          if(obsArray[i].ws.sourceType !== "Station Davis"){
             // Faire passer a 0minutes
            _arr.forEach( (_r) => {
              _r.recordDate = _r.recordDate.substr(0, 14) + '00:00.000+0000';
              //console.log(_r.recordDate.substr(0, 14) + '00:00.000+0000');
              //console.log(_r.recordDate.substr(14, 27));
            });
            // Retirer doublons meme date
            _arr = _arr.filter((_r, i, self) =>
              i === self.findIndex((t) => (
                t.recordDate === _r.recordDate
              ))
            )
            temp = _arr.map(_elt =>{
              return { date:_elt.recordDate, value: _elt.temp_int , sensorRef: _elt.sensorRef, type: "temp" }
            });
            this.getSerieByData(temp, obsArray[i].name, (serieComplete) => {
                serieComplete.id = "Temp " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
                serieComplete.yAxisIndex = 2;
                serieComplete.xAxisIndex = 2;
                //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
                serieComplete.itemStyle = {
                  color: this.getColor(obsArray[i].apiary, 'Local') 
                };

                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series.push(Object.assign({}, serieComplete));
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                  this.options.legend.data.push(serieComplete.name);
                }
            });
            if(obsArray[i].ws.sourceType === "TH"){
              humi = _arr.map(_elt =>{
                return { date: _elt.recordDate, value: _elt.humidity_int , sensorRef: _elt.sensorRef, type: "humi" }
              });
              this.getSerieByData(humi, obsArray[i].name, (serieComplete) => {
                serieComplete.id = "Humi " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
                serieComplete.yAxisIndex = 3;
                serieComplete.xAxisIndex = 3;
                //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
                serieComplete.itemStyle = {
                  color: this.getColor(obsArray[i].apiary, 'Local') 
                };

                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series.push(Object.assign({}, serieComplete));
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                  this.options.legend.data.push(serieComplete.name);
                }
              });
            }
          }
          else{
            _arr.forEach( (_r) => {
              _r.date = _r.date.substr(0, 14) + '00:00.000+0000';
              //console.log(_r.recordDate.substr(0, 14) + '00:00.000+0000');
              //console.log(_r.recordDate.substr(14, 27));
            });
            // Retirer doublons meme date
            _arr = _arr.filter((_r, i, self) =>
              i === self.findIndex((t) => (
                t.date === _r.date
              ))
            );
            console.log(_arr);
            temp = _arr.map(_elt => {
              return { date: _elt.date, value: _elt.value[0].temp ? _elt.value[0].temp : null , sensorRef: obsArray[i].ws.sourceId, type: "temp" }
            });
            rain = _arr.map(_elt => { 
              return { date: _elt.date, value: _elt.value[2] ? _elt.value[2] : null , sensorRef: obsArray[i].ws.sourceId, type: "rain" }
            });
            humi = _arr.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].humidity ? _elt.value[0].humidity : null , sensorRef: obsArray[i].ws.sourceId, type: "humi" }
            });
            wind = _arr.map(_elt => { 
              return { date: _elt.date, value: _elt.value[1].speed ? _elt.value[1].speed : null , sensorRef: obsArray[i].ws.sourceId, type: "wind" }
            });
            //ADD TEMP TO GRAPH
            this.getSerieByData(temp, obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.id = "Temp " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 2;
              serieComplete.xAxisIndex = 2;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
            //ADD HUMIDITY TO GRAPH
            this.getSerieByData(humi, obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.id = "Humi " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 3;
              serieComplete.xAxisIndex = 3;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
            //ADD RAIN TO GRAPH
            this.getSerieByData(rain, obsArray[i].name, (serieComplete: any) => {

              serieComplete.type = 'bar';
              serieComplete.id = "Rain " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 4;
              serieComplete.xAxisIndex = 4;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
            //ADD WIND TO GRAPH
            this.getSerieByData(wind, obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.id = "Wind " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 5;
              serieComplete.xAxisIndex = 5;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
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
        this.loadAllIndexesChosenSource((options) => {
          next(this.options);
        }) 
      }
    );
  }

  loadAllIndexesChosenSource(next: Function){
    let nec: any[] = [], fli: any[] = [];
    let obsArray = [];
    obsArray = this.currentWSByApiary.filter(_ws => this.w_o_service.getApiariesSelected().some(_a => _a._id === _ws.apiaryId)).map(_ws => {
      let start: Date = new Date(_ws.start) < this.w_d_service.getCurrentRangeForRequest()[0] ? this.w_d_service.getCurrentRangeForRequest()[0] : new Date(_ws.start);
      let end: Date = _ws.end ? (new Date(_ws.end) > this.w_d_service.getCurrentRangeForRequest()[1] ? this.w_d_service.getCurrentRangeForRequest()[1] : new Date(_ws.end)) : this.w_d_service.getCurrentRangeForRequest()[1];
      return [
        { apiary: this.w_o_service.getApiariesSelected().find(_a => _a._id === _ws.apiaryId),
          ws: _ws,
          name: _ws.apiaryName,
          obs: this.currentIdx.getCurrentIndexByApiaryAndSensorRefAndDateBetweenLocal(_ws.apiaryId, _ws.sourceId, [start, end])
        },
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _indexes => {
        //console.log(_indexes);
        _indexes.forEach((_arr: any[], i) => {
          /*_arr.forEach( (_r) => {
            _r.date = _r.date.substr(0, 11) + '10:00:00.000+0000';
            //console.log(_r.recordDate.substr(14, 27));
          });*/
          nec = _arr.map( _elt => {
            return { date: _elt.date, value:_elt.nectarIdx*100, sensorRef: _elt.sensorRef, type: "nec" }
          });
          this.getSerieByData(nec, obsArray[i].name, (serieComplete) => {
            serieComplete.type = 'bar';
            serieComplete.id = "Nectar " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
            serieComplete.yAxisIndex = 0;
            serieComplete.xAxisIndex = 0;
            //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
            serieComplete.itemStyle = {
              color: this.getColor(obsArray[i].apiary, 'Local') 
            };

            const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
            if (indexSerie !== -1) {
              this.options.series.push(Object.assign({}, serieComplete));
            } else {
              this.options.series.push(Object.assign({}, serieComplete));
              this.options.legend.data.push(serieComplete.name);
            }
          });
          if(obsArray[i].ws.sourceType === "Station Davis"){
            fli = _arr.map( _elt => {
              return { date: _elt.date, value:_elt.flightIdx*100, sensorRef: _elt.sensorRef, type: "fli" }
            });
            this.getSerieByData(nec, obsArray[i].name, (serieComplete) => {
              serieComplete.type = 'bar';
              serieComplete.id = "Flight " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 1;
              serieComplete.xAxisIndex = 1;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
  
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
          }
        })
      },
      () => {},
      () => {
        next(this.options);
      }
    )
  }

  loadRecords(apiary: RucherModel){
    if(this.w_o_service.getRecordsChartInstance().getOption().series.findIndex(_s => _s.name === "markLine") === -1){
      if(new Date().getTime() > this.w_d_service.start.getTime() && new Date().getTime() < this.w_d_service.end.getTime() ){
        this.insertMarklines();
      }
    }
    this.w_o_service.getRecordsChartInstance().showLoading();
    let ws = this.currentWSByApiary.filter(_ws => _ws.apiaryId === apiary._id);
    this.loadWithWeatherSource(apiary, ws, (options:any) => {
      if(ws.length > 0){
        this.loadWithChosenSource(apiary, ws, (options) => {
          this.w_o_service.getRecordsChartInstance().setOption(options, true);
          this.w_o_service.getRecordsChartInstance().hideLoading();
        })
      }
      else{
        this.w_o_service.getRecordsChartInstance().setOption(options, true);
        this.w_o_service.getRecordsChartInstance().hideLoading();
      }
    });
  }


  loadWithWeatherSource(apiary: RucherModel, ws:WeatherSource[], next: Function){
    let temp: any[], rain: any[], wind: any[], humi: any[];
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
              serieComplete.yAxisIndex = 2;
              serieComplete.xAxisIndex = 2;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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
              console.log(rain);
              serieComplete.type = 'bar';
              serieComplete.id = "Rain " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 4;
              serieComplete.xAxisIndex = 4;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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

              serieComplete.id = "Humi " + obsArray[index].name.substr(0, 5);
              serieComplete.yAxisIndex = 3;
              serieComplete.xAxisIndex = 3;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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
              serieComplete.yAxisIndex = 5;
              serieComplete.xAxisIndex = 5;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[index].apiary, 'WeatherSource') 
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
        this.loadIndexWithWeatherSource(apiary, ws, (options) => {
          next(this.options);
        }); 
      }
    );
  }

  loadIndexWithWeatherSource(apiary: RucherModel, ws: WeatherSource[], next:Function){
    let nec: any[] = [], fli: any[] = [];
    let obsArray: any[] = [];
    obsArray = [
      { apiary: apiary,
        name: apiary.name,
        obs: this.currentIdx.getCurrentIndexByApiaryAndDateBetweenWS(apiary._id, this.w_d_service.getCurrentRangeForRequest())
      },
      { apiary: apiary,
        name: apiary.name,
        obs: this.forecastIdx.getForecastIndexByApiaryAndDateBetween(apiary._id, this.w_d_service.getForecastRangeForRequest()) 
      },    
    ];
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _indexes => {
        _indexes.forEach((_apiIdx: any[], i) => {
          if(i % 2 === 0){
            nec = [];
            fli = [];
            nec = _apiIdx.map(_elt => {
              return { date: _elt.date, value:_elt.nectarIdx*100, sensorRef: 'WeatherSource', type: "nec" }
            });
            fli = _apiIdx.map(_elt => {
              return { date: _elt.date, value:_elt.flightIdx*100, sensorRef: 'WeatherSource', type: "nec" }
            });
          }
          else{
            //ADD NECTAR TO GRAPH
            this.getSerieByData(nec.concat( _apiIdx.map(_elt => { 
              return { date: _elt.date, value: _elt.nectarIdx*100, sensorRef:'WeatherSource', type: "nec" }
            }) ), obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.type = 'bar';

              serieComplete.id = "Nectar " + obsArray[i].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 0;
              serieComplete.xAxisIndex = 0;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'WeatherSource') ,
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

            //ADD FLIGHT TO GRAPH
            this.getSerieByData(fli.concat( _apiIdx.map(_elt => { 
              return { date: _elt.date, value: _elt.flightIdx*100, sensorRef:'WeatherSource', type: "nec" }
            }) ), obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.type = 'bar';
              serieComplete.id = "Flight " + obsArray[i].name.substr(0, 5)  + " " + "WeatherS";
              serieComplete.yAxisIndex = 1;
              serieComplete.xAxisIndex = 1;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'WeatherSource') ,
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
          }
        })
      },
      () => {},
      () => {
        next(this.options);
      }
    )
  }

  loadWithChosenSource(apiary: RucherModel, ws: WeatherSource[], next:Function){
    let temp: any[], rain: any[], wind: any[], humi: any[];
    let obsArray = ws.map( _ws => {
      let start: Date = new Date(_ws.start) < this.w_d_service.getCurrentRangeForRequest()[0] ? this.w_d_service.getCurrentRangeForRequest()[0] : new Date(_ws.start);
      let end: Date = _ws.end ? (new Date(_ws.end) > this.w_d_service.getCurrentRangeForRequest()[1] ? this.w_d_service.getCurrentRangeForRequest()[1] : new Date(_ws.end)) : this.w_d_service.getCurrentRangeForRequest()[1];
      return [
        { 
          apiary: this.w_o_service.getApiariesSelected().find(_a => _a._id === _ws.apiaryId),
          ws: _ws,
          name: _ws.apiaryName,
          obs: _ws.sourceType === "Station Davis" ? this.weatherService.getCurrentHourlyWeatherWithWSrcs(_ws.apiaryId, "WeatherLink", [start,end]) : this.recordService.getRecordsBySensorRefAndDateBetween(_ws.sourceId, [start, end])
        },
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _records => {
        //console.log(_records);
        _records.forEach((_arr: any[],i) => {
          if(obsArray[i].ws.sourceType !== "Station Davis"){
            _arr.forEach( _r => {
              _r.recordDate = _r.recordDate.substr(0, 14) + '00:00.000+0000';
              //console.log(_r.recordDate.substr(0, 14) + '00:00.000+0000');
              //console.log(_r.recordDate.substr(14, 27));
            });
            // Retirer doublons meme date
            _arr = _arr.filter((_r, i, self) =>
              i === self.findIndex((t) => (
                t.recordDate === _r.recordDate
              ))
            )
            temp = _arr.map(_elt =>{
              return { date:_elt.recordDate, value: _elt.temp_int , sensorRef: _elt.sensorRef, type: "temp" }
            });
            this.getSerieByData(temp, obsArray[i].name, (serieComplete) => {
                serieComplete.id = "Temp " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
                serieComplete.yAxisIndex = 2;
                serieComplete.xAxisIndex = 2;
                //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
                serieComplete.itemStyle = {
                  color: this.getColor(obsArray[i].apiary, 'Local') 
                };
  
                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series.push(Object.assign({}, serieComplete));
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                  this.options.legend.data.push(serieComplete.name);
                }
            });
            if(obsArray[i].ws.sourceType === "TH"){
              humi = _arr.map(_elt =>{
                return { date: _elt.recordDate, value: _elt.humidity_int , sensorRef: _elt.sensorRef, type: "humi" }
              });
              this.getSerieByData(humi, obsArray[i].name, (serieComplete) => {
                serieComplete.id = "Humi " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
                serieComplete.yAxisIndex = 3;
                serieComplete.xAxisIndex = 3;
                //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
                serieComplete.itemStyle = {
                  color: this.getColor(obsArray[i].apiary, 'Local') 
                };
  
                const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
                if (indexSerie !== -1) {
                  this.options.series.push(Object.assign({}, serieComplete));
                } else {
                  this.options.series.push(Object.assign({}, serieComplete));
                  this.options.legend.data.push(serieComplete.name);
                }
              });
            }
          }
          else{
            _arr.forEach( (_r) => {
              _r.date = _r.date.substr(0, 14) + '00:00.000+0000';
              //console.log(_r.recordDate.substr(0, 14) + '00:00.000+0000');
              //console.log(_r.recordDate.substr(14, 27));
            });
            // Retirer doublons meme date
            _arr = _arr.filter((_r, i, self) =>
              i === self.findIndex((t) => (
                t.date === _r.date
              ))
            );
            console.log(_arr);
            temp = _arr.map(_elt => {
              return { date: _elt.date, value: _elt.value[0].temp ? _elt.value[0].temp : null , sensorRef: obsArray[i].ws.sourceId, type: "temp" }
            });
            rain = _arr.map(_elt => { 
              return { date: _elt.date, value: _elt.value[2] ? _elt.value[2] : null , sensorRef: obsArray[i].ws.sourceId, type: "rain" }
            });
            humi = _arr.map(_elt => { 
              return { date: _elt.date, value: _elt.value[0].humidity ? _elt.value[0].humidity : null , sensorRef: obsArray[i].ws.sourceId, type: "humi" }
            });
            wind = _arr.map(_elt => { 
              return { date: _elt.date, value: _elt.value[1].speed ? _elt.value[1].speed : null , sensorRef: obsArray[i].ws.sourceId, type: "wind" }
            });
            //ADD TEMP TO GRAPH
            this.getSerieByData(temp, obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.id = "Temp " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 2;
              serieComplete.xAxisIndex = 2;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
            //ADD HUMIDITY TO GRAPH
            this.getSerieByData(humi, obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.id = "Humi " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 3;
              serieComplete.xAxisIndex = 3;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
            //ADD RAIN TO GRAPH
            this.getSerieByData(rain, obsArray[i].name, (serieComplete: any) => {

              serieComplete.type = 'bar';
              serieComplete.id = "Rain " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 4;
              serieComplete.xAxisIndex = 4;
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
            //ADD WIND TO GRAPH
            this.getSerieByData(wind, obsArray[i].name, (serieComplete: any) => {
              
              serieComplete.id = "Wind " + obsArray[i].name.substr(0, 5)  + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 5;
              serieComplete.xAxisIndex = 5;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
              } else {
                this.options.series.push(Object.assign({}, serieComplete));
                this.options.legend.data.push(serieComplete.name);
              }
            });
          }
        })
      },
      () => {},
      () => {
        this.loadIndexesWithChosenSource(apiary, ws, (options)=>{
          next(this.options);
        })
        
      }
    )
  }

  loadIndexesWithChosenSource(apiary: RucherModel, ws: WeatherSource[], next:Function){
    let nec: any[] = [], fli: any[] = [];
    let obsArray = [];
    obsArray = ws.map(_ws => {
      let start: Date = new Date(_ws.start) < this.w_d_service.getCurrentRangeForRequest()[0] ? this.w_d_service.getCurrentRangeForRequest()[0] : new Date(_ws.start);
      let end: Date = _ws.end ? (new Date(_ws.end) > this.w_d_service.getCurrentRangeForRequest()[1] ? this.w_d_service.getCurrentRangeForRequest()[1] : new Date(_ws.end)) : this.w_d_service.getCurrentRangeForRequest()[1];
      return [
        { apiary: this.w_o_service.getApiariesSelected().find(_a => _a._id === _ws.apiaryId),
          ws: _ws,
          name: _ws.apiaryName,
          obs: this.currentIdx.getCurrentIndexByApiaryAndSensorRefAndDateBetweenLocal(_ws.apiaryId, _ws.sourceId, [start, end])
        },
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _indexes => {
        _indexes.forEach((_arr: any[], i) => {
          /*_arr.forEach( (_r) => {
            _r.date = _r.date.substr(0, 11) + '00:00:00.000+0000';
            //console.log(_r.recordDate.substr(14, 27));
          });*/
          nec = _arr.map( _elt => {
            return { date: _elt.date, value:_elt.nectarIdx*100, sensorRef: _elt.sensorRef, type: "nec" }
          });
          this.getSerieByData(nec, obsArray[i].name, (serieComplete) => {
            serieComplete.type = 'bar';
            serieComplete.id = "Nectar " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
            serieComplete.yAxisIndex = 0;
            serieComplete.xAxisIndex = 0;
            //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
            serieComplete.itemStyle = {
              color: this.getColor(obsArray[i].apiary, 'Local') 
            };

            const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
            if (indexSerie !== -1) {
              this.options.series.push(Object.assign({}, serieComplete));
            } else {
              this.options.series.push(Object.assign({}, serieComplete));
              this.options.legend.data.push(serieComplete.name);
            }
          });
          if(obsArray[i].ws.sourceType === "Station Davis"){
            fli = _arr.map( _elt => {
              return { date: _elt.date, value:_elt.flightIdx*100, sensorRef: _elt.sensorRef, type: "fli" }
            });
            this.getSerieByData(nec, obsArray[i].name, (serieComplete) => {
              serieComplete.type = 'bar';
              serieComplete.id = "Flight " + obsArray[i].name.substr(0, 5) + " " + obsArray[i].ws.sourceId;
              serieComplete.yAxisIndex = 1;
              serieComplete.xAxisIndex = 1;
              //serieComplete.lineStyle = {normal: { type:'dashed', width: 1} },
              serieComplete.itemStyle = {
                color: this.getColor(obsArray[i].apiary, 'Local') 
              };
  
              const indexSerie = this.options.series.findIndex(_serie => _serie.name === serieComplete.name && _serie.yAxisIndex === serieComplete.yAxisIndex);
              if (indexSerie !== -1) {
                this.options.series.push(Object.assign({}, serieComplete));
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
        next(this.options);
      }
    )
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
        serieTmp.name = nameSerie.substr(0,5) + ' | ' + (_data.sensorRef === 'WeatherSource' ? 'WeatherS' : 'Local');
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

  getColor(apiary: RucherModel, type: string): string{
    let index = this.user_apiaries.findIndex(_a => _a._id === apiary._id);
    if(type === 'Local'){
      return colors.local[index];
    }
    else{
      return colors.ws[index];
    }
  }

  openHelp(){
    let url = this.translateService.instant('HELP.WEATHER.RECORDS');
    window.open(url);
  }

  ngOnDestroy(){
    this.w_o_service.recordsChartInstance.dispose();
  }

}
