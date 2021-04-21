import { UserPref } from './../../../_model/user-pref';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as echarts from 'echarts';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { DailyRecordsWService } from '../../service/api/daily-records-w.service';
import { RucheService } from '../../service/api/ruche.service';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import { SERIES } from '../charts/SERIES';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { DatePipe } from '@angular/common'
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { TranslateService } from '@ngx-translate/core';
import { trackByHourSegment } from 'angular-calendar/modules/common/util';
import * as moment from 'moment';


@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css'],
  providers:[DatePipe]
})
export class WeightComponent implements OnInit, AfterViewInit {

  private option: {
    baseOption: any,
    media: any[]
  };

  public ref_Date: Date;
  public ref_Values: Number[];
  public user_pref : UserPref;
  public rawWeightDisplay: boolean = false;
  public normWeightDisplay: boolean = false;
  public gainWeightDisplay: boolean = false;
  public format: string;
  //datePipe: DatePipe;

  @ViewChild('inputPicker') inputPicker: ElementRef;

  constructor(
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private dailyWService: DailyRecordsWService,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
    public datepipe: DatePipe
  ) {
    this.option = {
      // Base Option for ECharts
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
              width: '90%'
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
    this.userPrefsService.initService();
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-hive')) {
      elt.classList.remove('apiary-group-hive');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-brood');
    }
    elt.classList.add('apiary-group-brood');
    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
        console.log(_userPrefs.dateRef);
        if(_userPrefs.dateRef != null){
          this.ref_Date = new Date();
          let aux: Date = new Date(_userPrefs.dateRef);
          this.ref_Date.setTime(aux.getTime());
        }
      },
      () => {},
      () => {
        if(this.ref_Date === null || this.ref_Date === undefined){
          console.log('No ref Date in DB');
        }
        else{
          console.log(moment(this.ref_Date).format(this.user_pref.timeFormat.split(' ')[0]));
          this.changeDateTest();
        }
        //this.changeDateTest();
        this.changeRawWeight(true);
        this.initGraph();
      }
    );
  }

  initGraph(){
    this.stackService.setWeightChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-weight')));
    this.option.baseOption.series = [];
    this.setOptionForStackChart();
    if (this.stackService.getHiveSelect().length >= 1) {
          // Load Data
      this.loadAllHiveAfterRangeChange((options: any) => {
          this.stackService.getWeightChartInstance().setOption(options, true);
          this.stackService.getWeightChartInstance().hideLoading();
      });
    }
  }

  ngAfterViewInit(){

  }

  disposeGraph(){
    this.stackService.getWeightChartInstance().clear();
  }

  getGainWeightDisplay(){
    return this.gainWeightDisplay;
  }

  setOptionForStackChart(): void {
    // Add legend to chart
    this.option.baseOption.legend.data = [];
    this.rucheService.ruchesAllApiary.forEach(r => {
      this.option.baseOption.legend.data.push(r.name);
    });

    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }

    // X-Axis Options
    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.option.baseOption.tooltip.formatter = (params) => {
      if(params.data.value != undefined){
        return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data.name), new Array(
          {
            name: params.seriesName,
            value: this.unitService.getValRound(params.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName('Weight')
          }
        ));
      }
    }
    this.option.baseOption.xAxis.push(xAxis);

    // Y-Axis Options
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis[1]);
    if(this.gainWeightDisplay){
      yAxis.name = this.graphGlobal.weight.income_name;
      yAxis.interval = 1;
    }
    if(this.rawWeightDisplay){
      yAxis.name = this.graphGlobal.weight.name;
      yAxis.interval = 5;
    }
    if(this.normWeightDisplay){
      yAxis.name = this.graphGlobal.weight.norm_name;
      yAxis.interval = 5;
    }

    // ADAPT Y AXIS TO WEIGHT DISPLAY
    if(this.gainWeightDisplay){
      yAxis.min = function (value: any) {
        if(value.min < -2){
          let nb = Math.ceil(Math.abs(value.min)) / 2;
          return Math.round(nb) * -2;
        }
        else{
         return -2;
        }
      };
      yAxis.max = function (value) {
        if(value.max > 5){
          let nb = Math.ceil(value.max) / 5;
          return Math.ceil(nb) * 5;
        }
        else{
          return 5;
        }
      };
    }

    if(this.rawWeightDisplay){
      yAxis.min = function (value: any) {
        if(value.min < -2){
          let nb = Math.ceil(Math.abs(value.min)) / 2;
          return Math.round(nb) * -2;
        }
        else{
          return 0;
        }
      };
      yAxis.max = function (value) {
        if(value.max > 5){
          let nb = Math.ceil(value.max) / 5;
          return Math.ceil(nb) * 5;
        }
        else{
          return 40;
        }
      };
    }

    if(this.normWeightDisplay){
      yAxis.min = function (value: any) {
        if(value.min < -5){
          let nb = Math.ceil(Math.abs(value.min)) / 5;
          return Math.ceil(nb) * -5;
        }
        else{
          return -5;
        }
      };
      yAxis.max = function (value) {
        if(value.max > 10){
          let nb = Math.ceil(value.max) / 5;
          return Math.ceil(nb) * 5;
        }
        else{
          return 10;
        }
      };
    }
    this.option.baseOption.yAxis.push(yAxis);

    // Add Options to EChart graph
    this.stackService.getWeightChartInstance().setOption(this.option);
  }

  onResize(event: any) {
    this.stackService.getWeightChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  /**
   *
   * @param markerSerie
   * @param date
   * @param series
   */
  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '<B>{D}</B> <br/>';
    let templateValue = '{*} {n}: <B>{v} {u}</B>';
    let tooltipGlobal;
    if(date === 'Invalid date'){
      tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, this.unitService.getDailyDate(this.ref_Date) );
    }
    else{
      tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, date);
      tooltipGlobal += series.map(_serie => {
        // ADAPT GRAPH POPUP TO WEIGHT TYPE DISPLAY
        if(_serie.name === null){ // MARKLINE TOOLTIP
          return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, '').replace(/{v}/g, '').replace(/{u}/g, '').replace(/{R}/g, '');
        }
        else{ // SERIES TOOLTIP
          if(this.normWeightDisplay){
            if(_serie.value >= 0){
              return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, '+' +_serie.value+'%').replace(/{u}/g, '').replace(/{R}/g, '');
            }
            return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value+'%').replace(/{u}/g, '').replace(/{R}/g, '');
          }
          else if(this.gainWeightDisplay){
            if(_serie.value >= 0){
              return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, '+'+_serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, '');
            }
            else{
              return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, '');
            }
          }
          else{
            return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, '');
          }
        }
      }).join('');
    }
    return tooltipGlobal;
  }

  loadAllHiveAfterRangeChange(next: Function): void {

    let obs, rawWeight, weight;

    // GET WEIGHT FROM GIVEN DATE
    if(this.ref_Date !== undefined && this.ref_Date !== null){ // IF REF DATE IS NOT UNDEFINED, FIND REF_WEIGHT
      this.melliDateService.setRefDayRangeForRequest( [this.ref_Date, this.ref_Date] );
      if(this.gainWeightDisplay){
        obs = this.stackService.getHiveSelect().map(_hive => {
          return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, this.melliDateService.getRefDayRangeForRequest()) }
        });
      }
      else{
        obs = this.stackService.getHiveSelect().map(_hive => {
          return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightMinByHive(_hive._id, this.melliDateService.getRefDayRangeForRequest()) }
        });
      }
      Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
        _ref_weight => {
          //console.log(_ref_weight);
          this.ref_Values = [];
          //console.log(_ref_weight);
          _ref_weight.forEach((_elt, index) => { // ITERATE THROUGH REF WEIGHT ARRAY
            if(_elt[0] != undefined &&_elt[0].value != undefined){
              this.ref_Values.push(_elt[0].value);
            }
            else{
              console.log('No ref Value for' + obs[index].hive.name + ' at date ' + this.ref_Date);
              this.ref_Values.push(null);
            }
          })
        },
        () => {},
        () => { // WHEN REF_VALUES ARE PUSHED TO ARRAY
            // GET DAILY WEIGHT BETWEEN DATES IN NAVBAR
            if(this.gainWeightDisplay){
              if(this.ref_Date == undefined || this.ref_Date == null){ // IF REF_DATE IS UNDEFINED OR REF_DATE BEFORE START IN CALENDAR RANGE
                obs = this.stackService.getHiveSelect().map(_hive => {
                  return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
                });
              }
              else{ // IF REF_DATE AFTER REF_DATE AFTER START IN CALENDAR RANGE
                obs = this.stackService.getHiveSelect().map(_hive => {
                  return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, [this.ref_Date, this.melliDateService.end]) }
                });
              }

            }
            else{
              obs = this.stackService.getHiveSelect().map(_hive => {
                return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightMinByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
              });
            }
            Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
              _weight => {
                if(this.ref_Date !== undefined && this.ref_Values !== undefined){ // TEST DATE IS NOT UNDEFINED
                  this.ref_Values.forEach((e,i) => {
                    if(e != null){ // TEST IF HIVE HAS REF_VALUE FOR GIVEN DATE
                      //console.log("Date = "+ this.ref_Date + "\nHive name = " + obs[i].hive.name + "\nref_Value = " + e);
                    }
                    else{
                      console.log('No ref Value for' + obs[i].hive.name + ' at date ' + this.ref_Date);
                    }
                  });
                }
                else{
                  if(this.normWeightDisplay){ // CONSOLE THING FOR NORMALIZED AND GAIN DISPLAY
                    console.log('Please enter a reference Date');
                  }
                }
                if(this.normWeightDisplay){ // NEW VALUES FOR NORMALIZED DISPLAY
                  _weight.forEach((w_array: any[],index) => {
                    let t = [...w_array];
                    t.forEach((_elt, i) => {
                      if(this.ref_Values != undefined){
                        if(this.ref_Values[index] != undefined){ // TEST IF HIVE HAS REF_VALUE
                          let value: any = this.ref_Values[index];
                          _elt.value = (((_elt.value / value) - 1) * 100).toFixed(2);
                        }
                        else{ // DEFAULT VALUE IF NO REF VALUE
                          _elt.value = 0.0;
                        }
                      }
                      else{ // DEFAULT VALUE IF NO REF DATE
                          _elt.value = 0.0;
                      }
                    });
                  });
                  weight = [..._weight];
                }
                this.option.baseOption.series = [];
                _weight.forEach((_elt: any[], index) => { // ITERATE THROUGH WEIGHT ARRAY
                  this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
                    serieComplete.itemStyle = {
                      color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
                    };
                    // ADD DATA TO GRAPH
                    let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
                    if(this.gainWeightDisplay){
                      serieComplete.type = 'bar';
                    }
                    else{
                      serieComplete.showSymbol = true;
                      serieComplete.symbol = 'emptyCircle';
                      serieComplete.type = 'line';
                      serieComplete.lineStyle = {
                        width: 2,
                        shadowColor: 'rgba(255,255,255,1.0)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                      }
                    }
                    if (indexSerie !== -1) {
                      this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
                    } else {
                      this.option.baseOption.series.push(Object.assign({}, serieComplete));
                    }
                  });
                  if(this.gainWeightDisplay){ // IF GAIN WEIGHT DISPLAY THEN TRANSFORM DATA AND ADD ANOTHER DATA SERIES
                    let cumul = 0.0;
                    let lastIndex = _elt.length-1;
                    for(let i=lastIndex; i > -1; i--){
                      if( i !== lastIndex ){ // i > 0
                        cumul += _elt[i].value;
                        _elt[i].value = cumul;
                      }
                      else{ // i = 0
                        _elt[i].value = 0.0;
                      }
                    }
                    this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
                      serieComplete.itemStyle = {
                        color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
                      };
                      // ADD ANOTHER DATA SERIES TO GRAPH
                      let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
                      serieComplete.showSymbol = true;
                      serieComplete.symbol = 'emptyCircle';
                      serieComplete.type = 'line';
                      serieComplete.lineStyle = {
                        width: 2,
                        shadowColor: 'rgba(255,255,255,1.0)',
                        shadowBlur: 10,
                        shadowOffsetY: 0
                      }
                      if (indexSerie !== -1) {
                        this.option.baseOption.series.splice(indexSerie+1,0,Object.assign({}, serieComplete));
                      }
                      else {
                        this.option.baseOption.series.push(Object.assign({}, serieComplete));
                      }
                    });
                  }
                  // ADD MARKLINE
                  if(this.ref_Date !== undefined && this.ref_Date !== null && this.option.baseOption.series[0] !== undefined){
                    this.ref_Date.setHours(1);

                      this.option.baseOption.series[0].markLine =
                      {
                        data: [ {name: "", xAxis: this.ref_Date} ],
                        lineStyle: {normal: { type:'dashed',color: 'red', width: 2} },
                        label:{normal:{show:false } },
                        symbol: ['circle', 'none']
                      }
                  }
                  if(!this.normWeightDisplay){
                    this.updateTableData(_weight, obs);
                  }
                })
              },
              () => {},
              () => {
                if(this.normWeightDisplay){
                  this.updateNormTableData(weight, obs);
                }
                next(this.option);
                this.stackService.getWeightChartInstance().hideLoading();
              }
            )
        }
      );
    }
    else{ // IF DAILY DATE IS UNDEFINED
      // GET DAILY WEIGHT BETWEEN DATES IN NAVBAR
      if(this.gainWeightDisplay){
        if(this.ref_Date == undefined || this.ref_Date == null){ // IF REF_DATE IS UNDEFINED OR REF_DATE BEFORE START IN CALENDAR RANGE
          obs = this.stackService.getHiveSelect().map(_hive => {
            return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
          });
        }
        else{ // IF REF_DATE AFTER REF_DATE AFTER START IN CALENDAR RANGE
          obs = this.stackService.getHiveSelect().map(_hive => {
            return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, [this.ref_Date, this.melliDateService.end]) }
          });
        }

      }
      else{
        obs = this.stackService.getHiveSelect().map(_hive => {
          return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightMinByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
        });
      }
      Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
        _weight => {
          if(this.ref_Date !== undefined && this.ref_Values !== undefined){ // TEST DATE IS NOT UNDEFINED
            this.ref_Values.forEach((e,i) => {
              if(e != null){ // TEST IF HIVE HAS REF_VALUE FOR GIVEN DATE
                //console.log("Date = "+ this.ref_Date + "\nHive name = " + obs[i].hive.name + "\nref_Value = " + e);
              }
              else{
                console.log('No ref Value for' + obs[i].hive.name + ' at date ' + this.ref_Date);
              }
            });
          }
          else{
            if(this.normWeightDisplay){ // CONSOLE THING FOR NORMALIZED AND GAIN DISPLAY
              console.log('Please enter a reference Date');
            }
          }
          if(this.normWeightDisplay){ // NEW VALUES FOR NORMALIZED DISPLAY
            _weight.forEach((w_array: any[],index) => {
              w_array.forEach((_elt, i) => {
                _elt.value = 0.0;
              });
            });
            weight = [..._weight];
          }
          this.option.baseOption.series = [];
          _weight.forEach((_elt: any[], index) => { // ITERATE THROUGH WEIGHT ARRAY
            this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
              };
              // ADD DATA TO GRAPH
              let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
              if(this.gainWeightDisplay){
                serieComplete.type = 'bar';
              }
              else{
                serieComplete.showSymbol = true;
                serieComplete.symbol = 'emptyCircle';
                serieComplete.type = 'line';
                serieComplete.lineStyle = {
                  width: 2,
                  shadowColor: 'rgba(255,255,255,1.0)',
                  shadowBlur: 10,
                  shadowOffsetY: 0
                }

              }
              if (indexSerie !== -1) {
                this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
              } else {
                this.option.baseOption.series.push(Object.assign({}, serieComplete));
              }
            });
            if(this.gainWeightDisplay){ // IF GAIN WEIGHT DISPLAY THEN TRANSFORM DATA AND ADD ANOTHER DATA SERIES
              let cumul = 0.0;
              let lastIndex = _elt.length-1;
              for(let i=lastIndex; i > -1; i--){
                if( i !== lastIndex ){ // i > 0
                  cumul += _elt[i].value;
                  _elt[i].value = cumul;
                }
                else{ // i = 0
                  _elt[i].value = 0.0;
                }
              }
              this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
                serieComplete.itemStyle = {
                  color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
                };
                // ADD ANOTHER DATA SERIES TO GRAPH
                let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
                serieComplete.showSymbol = true;
                serieComplete.symbol = 'emptyCircle';
                serieComplete.type = 'line';
                serieComplete.lineStyle = {
                  width: 2,
                  shadowColor: 'rgba(255,255,255,1.0)',
                  shadowBlur: 10,
                  shadowOffsetY: 0
                }
                if (indexSerie !== -1) {
                  this.option.baseOption.series.splice(indexSerie+1,0,Object.assign({}, serieComplete));
                }
                else {
                  this.option.baseOption.series.push(Object.assign({}, serieComplete));
                }
              });
            }
            // ADD MARKLINE
            if(this.ref_Date !== undefined && this.ref_Date !== null && this.option.baseOption.series[0] !== undefined){
              this.ref_Date.setHours(1);

                this.option.baseOption.series[0].markLine =
                {
                  data: [ {name: "", xAxis: this.ref_Date} ],
                  lineStyle: {normal: { type:'dashed',color: 'red', width: 2} },
                  label:{normal:{show:false } },
                  symbol: ['circle', 'none']
                }
            }
            if(!this.normWeightDisplay){
              this.updateTableData(_weight, obs);
            }
          })
        },
        () => {},
        () => {
          if(this.normWeightDisplay){
            this.updateNormTableData(weight, obs);
          }
          next(this.option);
          this.stackService.getWeightChartInstance().hideLoading();
        }
      )
    }
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
        serieTmp.name = nameSerie;
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          let newDate = new Date(_map.date);
          newDate.setHours(1);
          if(newDate > this.melliDateService.start && newDate < this.melliDateService.end){
            return { name: newDate.toISOString(), value: [newDate.toISOString(), _map.value, _map.sensorRef] };
          }
        });
        next(serieTmp);
      }
    });
  }

  removeHiveSerie(hive: RucheInterface): void {
    const series = this.option.baseOption.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    let indexSerie;
    let nb = series.length;
    if (series.length > 0) {
      series.forEach(element => {
        indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
      });
      if(indexSerie === 0 && this.option.baseOption.series.length > 0){
        this.option.baseOption.series[0].markLine =
        {
          data: [ {name: "", xAxis: this.ref_Date} ],
          lineStyle: {normal: { type:'dashed',color: 'red', width: 2} },
          label:{normal:{show:false } },
          symbol: ['circle', 'none']
        }
      }
    }
    this.stackService.getWeightChartInstance().setOption(this.option, true);
    this.removeDataFromTable(hive.name);
  }

  // RELOAD GRAPH WHEN ADDING NEW HIVE
  loadDataByHive(hive: RucheInterface): void {
    this.stackService.getWeightChartInstance().showLoading();
    let ref_val;
    if(this.gainWeightDisplay){ // GAIN WEIGHT DISPLAY
      if(this.ref_Date != undefined && this.ref_Date != null ){
        this.dailyWService.getWeightIncomeGainByHive(hive._id, this.melliDateService.getRefDayRangeForRequest()).subscribe(
          _ref_weight => {
            if(_ref_weight.length > 0){
              this.ref_Values.push(_ref_weight[0].value);
              ref_val = _ref_weight[0].value;
            }
            else{
              this.ref_Values.push(null);
              ref_val = null;
            }
          },
          () => {},
          () => {
            this.dailyWService.getWeightIncomeGainByHive(hive._id, [this.ref_Date, this.melliDateService.end]).subscribe(
              _weight => {
                this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
                  serieComplete.itemStyle = {
                    color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
                  };
                  serieComplete.type = 'bar';
                  if(this.option.baseOption.series.length === 0){
                    serieComplete.markLine =
                    {
                      data: [ {name: "", xAxis: this.ref_Date} ],
                      lineStyle: {normal: { type:'dashed',color: 'red', width: 2} },
                      label:{normal:{show:false } },
                      symbol: ['circle', 'none']
                    }
                  }
                  this.option.baseOption.series.push(serieComplete);
                  this.stackService.getWeightChartInstance().setOption(this.option);
                });
                let cumul = 0.0;
                let lastIndex = _weight.length-1;
                for(let i=lastIndex; i > -1; i--){
                  if( i !== lastIndex ){ // i > 0
                    cumul += _weight[i].value;
                    _weight[i].value = cumul;
                  }
                  else{ // i = 0
                    _weight[i].value = 0.0;
                  }
                }
                this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
                  serieComplete.itemStyle = {
                    color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
                  };
                  serieComplete.showSymbol = true;
                  serieComplete.symbol = 'emptyCircle';
                  serieComplete.type = 'line';
                  serieComplete.lineStyle = {
                    width: 2,
                    shadowColor: 'rgba(255,255,255,1.0)',
                    shadowBlur: 10,
                    shadowOffsetY: 0
                  }
                  this.option.baseOption.series.push(serieComplete);
                  this.stackService.getWeightChartInstance().setOption(this.option);
                  this.addDataToTable(_weight, ref_val, hive.name);
                });
              },
              () => {},
              () => {
                this.stackService.getWeightChartInstance().hideLoading();
              }
            )
          }
        )
      }
      else{
        this.dailyWService.getWeightIncomeGainByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
          _weight => {
            this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
              };
              serieComplete.type = 'bar';
              this.option.baseOption.series.push(serieComplete);
              this.stackService.getWeightChartInstance().setOption(this.option);
            });
            let cumul = 0.0;
            let lastIndex = _weight.length-1;
            for(let i=lastIndex; i > -1; i--){
              if( i !== lastIndex ){ // i > 0
                cumul += _weight[i].value;
                _weight[i].value = cumul;
              }
              else{ // i = 0
                _weight[i].value = 0.0;
              }
            }
            this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
              };
              serieComplete.showSymbol = true;
              serieComplete.symbol = 'emptyCircle';
              serieComplete.type = 'line';
              serieComplete.lineStyle = {
                width: 2,
              }
              this.option.baseOption.series.push(serieComplete);
              this.stackService.getWeightChartInstance().setOption(this.option);
              this.addDataToTable(_weight, null, hive.name);
            });
          },
          () => {},
          () => {
            this.stackService.getWeightChartInstance().hideLoading();
          }
        )
      }
    }
    if(this.normWeightDisplay){ // NORM WEIGHT DISPLAY
      if(this.ref_Date != undefined && this.ref_Date != null){
        this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRefDayRangeForRequest()).subscribe(
          _ref_weight => {
            console.log(_ref_weight);
            if(_ref_weight.length > 0){
              this.ref_Values.push(_ref_weight[0].value);
              ref_val = _ref_weight[0].value;
            }
            else{
              this.ref_Values.push(null);
              ref_val = null;
            }
          },
          () => {},
          () => {
            this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
              _weight => {
                _weight.forEach( e => {
                  if(ref_val != null){
                    e.value = ((e.value / ref_val) - 1)*100;
                  }
                  else{
                    e.value = 0.0;
                  }
                });
                this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
                  serieComplete.itemStyle = {
                    color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
                  };
                  serieComplete.showSymbol = true;
                  serieComplete.symbol = 'emptyCircle';
                  serieComplete.type = 'line';
                  serieComplete.lineStyle = {
                    width: 2,
                  }
                  if(this.option.baseOption.series.length === 0){
                    serieComplete.markLine =
                    {
                      data: [ {name: "", xAxis: this.ref_Date} ],
                      lineStyle: {normal: { type:'dashed',color: 'red', width: 2} },
                      label:{normal:{show:false } },
                      symbol: ['circle', 'none']
                    }
                  }
                  this.option.baseOption.series.push(serieComplete);
                  this.stackService.getWeightChartInstance().setOption(this.option);
                  this.addDataToNormTable(_weight, ref_val, hive);
                });
              },
              () => {},
              () => {
                this.stackService.getWeightChartInstance().hideLoading();
              }
            )
          }
        );
      }
      else{
        this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
          _weight => {
            _weight.forEach(e => {
              e.value = 0.0;
            })
            this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
              };
              serieComplete.showSymbol = true;
              serieComplete.symbol = 'emptyCircle';
              serieComplete.type = 'line';
              serieComplete.lineStyle = {
                width: 2,
                shadowColor: 'rgba(255,255,255,1.0)',
                shadowBlur: 10,
                shadowOffsetY: 0
              }
              this.option.baseOption.series.push(serieComplete);
              this.stackService.getWeightChartInstance().setOption(this.option);
              this.addDataToNormTable(_weight, null, hive);
            });
          },
          () => {},
          () => {
            this.stackService.getWeightChartInstance().hideLoading();
          }
        )
      }

    }
    if(this.rawWeightDisplay){
      if(this.ref_Date != undefined && this.ref_Date != null){ // REF DATE DEFINED
        this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRefDayRangeForRequest()).subscribe(
          _ref_weight => {
            if(_ref_weight.length > 0){
              this.ref_Values.push(_ref_weight[0].value);
              ref_val = _ref_weight[0].value;
            }
            else{
              this.ref_Values.push( null );
              ref_val = null;
            }
          },
          () => {},
          () => {
            this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
              _weight => {
                this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
                  serieComplete.itemStyle = {
                    color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
                  };
                  serieComplete.showSymbol = true;
                  serieComplete.symbol = 'emptyCircle';
                  serieComplete.type = 'line';
                  serieComplete.lineStyle = {
                    width: 2,
                    shadowColor: 'rgba(255,255,255,1.0)',
                    shadowBlur: 10,
                    shadowOffsetY: 0
                  }
                  if(this.option.baseOption.series.length === 0){
                    serieComplete.markLine =
                    {
                      data: [ {name: "", xAxis: this.ref_Date} ],
                      lineStyle: {normal: { type:'dashed',color: 'red', width: 2} },
                      label:{normal:{show:false } },
                      symbol: ['circle', 'none']
                    }
                  }
                  this.option.baseOption.series.push(serieComplete);
                  this.stackService.getWeightChartInstance().setOption(this.option);
                  this.addDataToTable(_weight, ref_val, hive.name);
                });
              },
              () => {},
              () => {
                this.stackService.getWeightChartInstance().hideLoading();
              }
            )
          }
        )
      }
      else{ // NO REF DATE
        this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
          _weight => {
            this.getSerieByData(_weight, hive.name, (serieComplete: any) => {
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
              };
              serieComplete.showSymbol = true;
              serieComplete.symbol = 'emptyCircle';
              serieComplete.type = 'line';
              serieComplete.lineStyle = {
                width: 2,
                shadowColor: 'rgba(255,255,255,1.0)',
                shadowBlur: 10,
                shadowOffsetY: 0
              }
              this.option.baseOption.series.push(serieComplete);
              this.stackService.getWeightChartInstance().setOption(this.option);
              this.addDataToTable(_weight, null, hive.name);
            });
          },
          () => {},
          () => {
            this.stackService.getWeightChartInstance().hideLoading();
          }
        )
      }
    }
  }


  // SET DISPLAY RAW WEIGHT DATA
  changeRawWeight(bool :boolean){
    if(bool){
      this.rawWeightDisplay = true;
      document.getElementById("raw-weight-title").style.display = "block";
      (<HTMLInputElement> document.getElementById("raw-check")).disabled = true;
      (<HTMLInputElement> document.getElementById("raw-check")).checked = true;
      document.getElementById("ref_date").style.display = "flex";
      (<HTMLInputElement> document.getElementById("raw-check-title")).classList.add('title-active');
      (<HTMLInputElement> document.getElementById("norm-check-title")).classList.remove('title-active');
      (<HTMLInputElement> document.getElementById("gain-check-title")).classList.remove('title-active');
    }
    else{
      this.rawWeightDisplay = false;
      document.getElementById("raw-weight-title").style.display = "none";
      (<HTMLInputElement> document.getElementById("raw-check")).disabled = false;
      (<HTMLInputElement> document.getElementById("raw-check")).checked = false;
      (<HTMLInputElement> document.getElementById("raw-check-title")).classList.remove('title-active');
    }
  }

  // SET DISPLAY NORMALIZED WEIGHT DATA
  changeNormWeight(bool :boolean){
    if(bool){
      this.normWeightDisplay = true;
      document.getElementById("norm-weight-title").style.display = "block";
      (<HTMLInputElement> document.getElementById("norm-check")).disabled = true;
      (<HTMLInputElement> document.getElementById("norm-check")).checked = true;
      document.getElementById("ref_date").style.display = "flex";
      (<HTMLInputElement> document.getElementById("norm-check-title")).classList.add('title-active');
      (<HTMLInputElement> document.getElementById("raw-check-title")).classList.remove('title-active');
      (<HTMLInputElement> document.getElementById("gain-check-title")).classList.remove('title-active');
    }
    else{
      this.normWeightDisplay = false;
      document.getElementById("norm-weight-title").style.display = "none";
      (<HTMLInputElement> document.getElementById("norm-check")).disabled = false;
      (<HTMLInputElement> document.getElementById("norm-check")).checked = false;
      (<HTMLInputElement> document.getElementById("norm-check-title")).classList.remove('title-active');
    }
  }

  // SET DISPLAY GAIN WEIGHT DATA
  changeGainWeight(bool :boolean){
    if(bool){
      this.gainWeightDisplay = true;
      document.getElementById("gain-weight-title").style.display = "block";
      (<HTMLInputElement> document.getElementById("gain-check")).disabled = true;
      (<HTMLInputElement> document.getElementById("gain-check")).checked = true;
      document.getElementById("ref_date").style.display = "flex";
      (<HTMLInputElement> document.getElementById("gain-check-title")).classList.add('title-active');
      (<HTMLInputElement> document.getElementById("raw-check-title")).classList.remove('title-active');
      (<HTMLInputElement> document.getElementById("norm-check-title")).classList.remove('title-active');
    }
    else{
      this.gainWeightDisplay = false;
      document.getElementById("gain-weight-title").style.display = "none";
      (<HTMLInputElement> document.getElementById("gain-check")).disabled = false;
      (<HTMLInputElement> document.getElementById("gain-check")).checked = false;
      (<HTMLInputElement> document.getElementById("gain-check-title")).classList.remove('title-active');
    }
  }

  showGraph(name:string){ // CHANGE GRAPH ON BUTTON CLICK
    switch(name){
      case 'raw-weight': // SHOW RAW WEIGHT GRAPH
        this.changeRawWeight(true);
        this.changeNormWeight(false);
        this.changeGainWeight(false);
        this.disposeGraph();
        this.initGraph();
        break;
      case 'norm-weight': // SHOW NORMALIZED WEIGHT GRAPH
        this.changeRawWeight(false);
        this.changeNormWeight(true);
        this.changeGainWeight(false);
        this.disposeGraph();
        this.initGraph();
        break;
      case 'gain-weight': // SHOW WEIGHT GAIN GRAPH
        this.changeRawWeight(false);
        this.changeNormWeight(false);
        this.changeGainWeight(true);
        this.disposeGraph();
        this.initGraph();
        break;
      default:
        break;
    }
  }

  // FUNCTION TRIGGERED WHEN REF DATE IS CHOSEN
  refDate(){
    (<HTMLInputElement>document.getElementsByClassName('weight_ref_date')[0]).value = this.unitService.getDailyDate(this.ref_Date);
    this.user_pref.dateRef = this.ref_Date;
    this.userPrefsService.setRefDate(this.ref_Date).subscribe(
      () => { }, () => { }, () => { }
    );
    this.disposeGraph();
    this.initGraph();
  }

  changeDateTest(){
    (<HTMLInputElement>document.getElementsByClassName('weight_ref_date')[0]).value = moment(this.ref_Date).format(this.user_pref.timeFormat.split(' ')[0]);
  }

  deleteDate(){
    (<HTMLInputElement>document.getElementsByClassName('weight_ref_date')[0]).value = "";
    this.ref_Date = null;
    this.user_pref.dateRef = this.ref_Date;
    this.userPrefsService.setRefDate(this.ref_Date).subscribe(
      () => { }, () => { }, () => { }
    );
    this.disposeGraph();
    this.initGraph();
  }

  updateTableData(weight_income_array: any[], obs: any){
    let table = document.getElementById("weight-table").getElementsByTagName("table")[0];
    let dateCells = document.getElementsByClassName('date-head');
    let dateJ7 = document.getElementsByClassName('date-j-7');
    let dateJ15 = document.getElementsByClassName('date-j-15');
    let j7: Date = new Date(this.melliDateService.end);
    j7.setDate(j7.getDate() - 7);
    let j15: Date = new Date(this.melliDateService.end);
    j15.setDate(j15.getDate() - 15);
    if(this.ref_Date !== undefined && this.ref_Date !== null){
      Array.from(dateCells).forEach(e => {
        e.textContent = this.unitService.getDailyDate(this.ref_Date);
      });
    }
    else{
      Array.from(dateCells).forEach(e => {
        if(this.gainWeightDisplay){
          e.textContent = this.unitService.getDailyDate(this.melliDateService.start);
          return;
        }
        if(!this.gainWeightDisplay){
          e.textContent = "Date";
          return;
        }

      });
    }

    Array.from(dateJ7).forEach(e => {
      e.textContent = this.unitService.getDailyDate(j7);
    })
    Array.from(dateJ15).forEach(e => {
      e.textContent = this.unitService.getDailyDate(j15);
    })

    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    /**
     * GET DATE FROM REF_DATE TO END DATE IN CALENDAR
    */
    weight_income_array.forEach((e, index) => {
          let row = tbody.insertRow();
          let cell1 = row.insertCell(); // HIVE CELL
          cell1.innerHTML = obs[index].hive.name;
          let cell2 = row.insertCell(); // T0 CELL
          let cell3 = row.insertCell(); // 7DAYS CELL
          let cell4 = row.insertCell(); // 15DAYS CELL
          if(this.gainWeightDisplay){
            if(e.length > 0){
              if(e.length >= 7){
                cell3.innerHTML = (e[0].value - e[6].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
                if(e.length >= 15){
                  cell4.innerHTML = (e[0].value - e[14].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
                }
              }
              if( this.ref_Values != undefined && this.ref_Values[index] != undefined && this.ref_Values[index] != null ){
                cell2.innerHTML = (e[0].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              }
              else{
                cell2.innerHTML = "No Value";
              }
            }
            else{
              cell2.innerHTML = "No Value";
            }
          }
          else{
            if( this.ref_Values !== undefined && this.ref_Values[index] !== undefined && this.ref_Values[index] !== null){
              cell2.innerHTML = this.ref_Values[index].toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
            }
            else{
              if(this.ref_Date === null || this.ref_Date === undefined){
                cell2.innerHTML = "";
              }
              else{
                cell2.innerHTML = "No value";
              }
            }
            if(e.length >= 7){
              cell3.innerHTML = parseFloat(e[6].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              if(this.normWeightDisplay){
                cell3.innerHTML = 'x' + parseFloat(e[6].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              }
              if(e.length >= 15){
                cell4.innerHTML = parseFloat(e[14].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
                if(this.normWeightDisplay){
                  cell4.innerHTML = 'x' + parseFloat(e[14].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
                }
              }
            }
          }
    });
  }

  addDataToTable(_weight: any[], ref_val: number | null, name: string): void{
    let table = document.getElementById("weight-table").getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    let row = tbody.insertRow();
    let cell1 = row.insertCell(); // HIVE CELL
    cell1.innerHTML = name;
    let cell2 = row.insertCell(); // T0 CELL
    if(ref_val == null){
      cell2.innerHTML = "No Value";
    }
    else{
      if(this.gainWeightDisplay){
        cell2.innerHTML = _weight[0].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
      else{
        cell2.innerHTML = ref_val.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }
    let cell3 = row.insertCell(); // 7DAYS CELL
    if(this.gainWeightDisplay){
      if(_weight.length >= 7){
        cell3.innerHTML = (_weight[0].value - _weight[6].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }
    if(this.normWeightDisplay){
      if(_weight.length >= 7){
        cell3.innerHTML = 'x' + _weight[6].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }
    if(this.rawWeightDisplay){
      if(_weight.length >= 7){
        cell3.innerHTML =  _weight[6].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }
    let cell4 = row.insertCell(); // 15DAYS CELL
    if(this.gainWeightDisplay){
      if(_weight.length >= 15){
        cell4.innerHTML = (_weight[0].value - _weight[14].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }
    if(this.normWeightDisplay){
      if(_weight.length >= 15){
        cell4.innerHTML = 'x' + _weight[14].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }
    if(this.rawWeightDisplay){
      if(_weight.length >= 15){
        cell4.innerHTML =  _weight[14].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
      }
    }

  }

  removeDataFromTable(name: string): void{
    let table = document.getElementById("weight-table").getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    let tr = tbody.getElementsByTagName('tr');
    let index = Array.from(tr).findIndex(e => e.cells[0].innerHTML === name);
    tbody.deleteRow(index);
  }

  updateNormTableData(normWeight: any[], obs:any){
    let rawWeight;
    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _weight => {
        rawWeight = [..._weight];
      },
      () => {},
      () => {
        let table = document.getElementById("weight-table").getElementsByTagName("table")[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        let dateCells = document.getElementsByClassName('date-head');
        let dateCurrent = document.getElementsByClassName('date-current')[0];
        console.log(dateCurrent);
        let dateJ7 = document.getElementsByClassName('date-j-7-norm')[0];
        let dateJ15 = document.getElementsByClassName('date-j-15-norm')[0];
        Array.from(dateCells).forEach(e => {
          if(this.ref_Date != undefined && this.ref_Date != null){
            e.textContent = this.unitService.getDailyDate(this.ref_Date);
          }
          else e.textContent = "No Ref Date";
        });
        let date = new Date(rawWeight[0][0].date);
        let date7 = new Date(date);
        date7.setDate(date.getDate() - 7);
        let date15 = new Date(date);
        date15.setDate(date.getDate() - 15);
        dateCurrent.textContent = this.unitService.getDailyDate(date);
        dateJ7.textContent = this.unitService.getDailyDate(date7);
        dateJ15.textContent = this.unitService.getDailyDate(date15);
        rawWeight.forEach((e,i) => {
          let aux = new Date(e[0].date);
          if(date.getTime() < aux.getTime()){
            date = new Date(e[0].date);
            dateCurrent.textContent = this.unitService.getDailyDate(date);
            date7.setDate(date.getDate() - 7);
            dateJ7.textContent = this.unitService.getDailyDate(date7);
            date7.setDate(date.getDate() - 15);
            dateJ15.textContent = this.unitService.getDailyDate(date15);
          }
          let row = tbody.insertRow();
          let cell1 = row.insertCell();
          cell1.innerHTML = obs[i].hive.name;
          let cell2 = row.insertCell();
          if(this.ref_Values != undefined && this.ref_Values[i] != undefined && this.ref_Values[i] != null && this.ref_Date != null){
            cell2.innerHTML = this.ref_Values[i].toFixed(2)+ ' ' + this.graphGlobal.weight.unitW;
          }
          else{
            cell2.innerHTML = "No Ref Value";
          }
          let cell3 = row.insertCell();
          if(e.length > 0 && new Date(e[0].date).getTime() === date.getTime()){
            cell3.innerHTML = e[0].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
          }
          let cell4 = row.insertCell();
          if(normWeight[i].length > 0){
            if((normWeight[i][0].value) >= 0) cell4.innerHTML = '+ ' + parseFloat(normWeight[i][0].value).toFixed(2) + ' %';
            else cell4.innerHTML = '- ' + Math.abs(normWeight[i][0].value).toFixed(2) + ' %';
          }
          let cell5 = row.insertCell();
          if(e.length >= 7 && this.ref_Date != null){
            if(( (e[0].value / e[7].value) - 1) >= 0) cell5.innerHTML = '+ ' +(( (e[0].value / e[7].value) - 1) * 100).toFixed(2) + ' %';
            else cell5.innerHTML = '- ' + Math.abs(( (e[0].value / e[7].value) - 1) * 100).toFixed(2) + ' %';
          }
          let cell6 = row.insertCell();
          if(e.length >= 15 && this.ref_Date != null){
            if(( (e[0].value / e[15].value) - 1) >= 0) cell6.innerHTML = '+ ' +(( (e[0].value / e[15].value) - 1) * 100).toFixed(2) + ' %';
            else cell6.innerHTML = '- ' + Math.abs(( (e[0].value / e[15].value) - 1) * 100).toFixed(2) + ' %';
          }
        });
      }
    );
  }

  addDataToNormTable(normWeight: any[], ref_val: number | null, hive: RucheInterface){
    let rawWeight;
    this.dailyWService.getWeightMinByHive(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _weight => {
        rawWeight = [..._weight];
      },
      () => {},
      () => {
        let table = document.getElementById("weight-table").getElementsByTagName("table")[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        let row = tbody.insertRow();
        let cell1 = row.insertCell();
        cell1.innerHTML = hive.name;
        let cell2 = row.insertCell();
        if(ref_val != null && this.ref_Date != null){
          cell2.innerHTML = ref_val.toFixed(2)+ ' ' + this.graphGlobal.weight.unitW;
        }
        else{
          cell2.innerHTML = "No Ref Value";
        }
        let cell3 = row.insertCell();
        let string = this.unitService.getDailyDate(new Date(rawWeight[0].date));
        if(rawWeight.length > 0){
          cell3.innerHTML = rawWeight[0].value.toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
        }
        let cell4 = row.insertCell();
        if(normWeight.length > 0){
          if((normWeight[0].value) >= 0) cell4.innerHTML = '+ ' + (normWeight[0].value).toFixed(2) + ' %';
          else cell4.innerHTML = '- ' + Math.abs(normWeight[0].value).toFixed(2) + ' %';
        }
        let cell5 = row.insertCell();
        if(rawWeight.length >= 7 && this.ref_Date != null){
          if(( (rawWeight[0].value / rawWeight[7].value)*100 - 100) >= 0) cell5.innerHTML = '+ ' +(( (rawWeight[0].value / rawWeight[7].value)*100 - 100)).toFixed(2) + ' %';
          else cell5.innerHTML = '- ' + Math.abs(( (rawWeight[0].value / rawWeight[7].value)*100 - 100)).toFixed(2) + ' %';
        }
        let cell6 = row.insertCell();
        if(rawWeight.length >= 15 && this.ref_Date != null){
          if(( (rawWeight[0].value / rawWeight[15].value)*100 - 100) >= 0) cell6.innerHTML = '+ ' +(( (rawWeight[0].value / rawWeight[15].value)*100 - 100)).toFixed(2) + ' %';
          else cell6.innerHTML = '- ' + Math.abs(( (rawWeight[0].value / rawWeight[15].value)*100 - 100)).toFixed(2) + ' %';
        }
      }
    )

  }

  ngOnDestroy(): void {
  }



}
