import { Component, OnInit, Renderer2 } from '@angular/core';
import { RucheService } from '../service/api/ruche.service';
import { RucherService } from '../service/api/rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { RucherModel } from '../../_model/rucher-model';
import { Router } from '@angular/router';
import { WeatherRecordsComponent } from './weather-records/weather-records.component';
import { WeatherConfigComponent } from './weather-config/weather-config.component';
import { WeatherOptionService } from './service/weather-option.service';
import { WeatherDateService } from './service/weather-date.service';
import { DataRange } from '../../_model/data-range';
import { TranslateService } from '@ngx-translate/core';
import { UnitService } from '../service/unit.service';
import { WeatherService } from '../service/api/weather.service';

const PREFIX_PATH = '/dashboard/weather/';
const colors: string[] = ['rgb(20,150,255)', 'green', 'yellow', 'purple', 'orange', 'cyan', 'magenta', 'brown', 'grey'];

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  public user_apiaries: RucherModel[];
  private recordsComponent: WeatherRecordsComponent;
  private configComponent: WeatherConfigComponent;
  private eltOnClick: EventTarget;
  private dateDropdown: HTMLElement;

  constructor(
    public rucheService: RucheService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    private router: Router,
    private w_o_service: WeatherOptionService,
    public w_d_service: WeatherDateService,
    private renderer: Renderer2,
    private translateService: TranslateService,
    private unitService: UnitService
  ) { }

  ngOnInit() {
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries].sort(this.compare);
      },
      () => {},
      () => {
        this.w_o_service.addApiary(this.user_apiaries[0]);
      }
    );
  }

  ngAfterViewInit(): void{
    if(this.router.url === PREFIX_PATH + 'records'){
      this.eltOnClick = document.getElementById('weather-records');
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    if(this.router.url === PREFIX_PATH + 'config'){
      this.eltOnClick = document.getElementById('weather-config');
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    this.dateDropdown = document.getElementById('date-dropdown');
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

  checkApiaryIfActive(apiaryId: string): string{
    switch(this.router.url){
      case PREFIX_PATH + 'records':
        if(this.w_o_service.getApiariesSelected().findIndex(_a => _a._id === apiaryId) !== -1 ){
          return 'apiary-active';
        } else{
          return 'not-active';
        }
        break;
     
      case PREFIX_PATH + 'config':
        if(this.w_o_service.getApiaryConfig()._id === apiaryId ){
          return 'apiary-active';
        } else{
          return 'not-active';
        }
        break;
    }
  }

  apiaryClick(apiary: RucherModel): void{
    switch(this.router.url){
      case PREFIX_PATH + 'records':
        if(!this.w_o_service.isApiarySelected(apiary)){
          this.w_o_service.addApiary(apiary);
          this.recordsComponent.loadRecords(apiary);
        }
        else{
          this.w_o_service.removeApiary(apiary);
          this.recordsComponent.removeRecords(apiary);
        }
        break;
      case PREFIX_PATH + 'config':
        this.w_o_service.setApiaryConfig(apiary);
        this.configComponent.changeApiary(apiary);
        break;
    }
  }

  onActivate(componentRef: Component) {
    if (componentRef instanceof WeatherRecordsComponent) {
      this.recordsComponent = componentRef;
    } else if (componentRef instanceof WeatherConfigComponent) {
      this.configComponent = componentRef;
    }
  }

  setButtonActive(_id: string): void{
    if (this.eltOnClick === null) {
      this.eltOnClick = document.getElementById(_id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    } else {
      this.renderer.removeClass(this.eltOnClick, 'nav-active');
      this.eltOnClick = document.getElementById(_id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
  }

  previousDate(){
     const start: Date = new Date(this.w_d_service.start);
     const end: Date = new Date(this.w_d_service.end);
     this.w_d_service.start = new Date(start.getTime() - (end.getTime() - start.getTime()));
     this.w_d_service.end = new Date(start.getTime());
     this.setDateFromInput();
  }

  nextDate(){
    const start: Date = new Date(this.w_d_service.start);
    const end: Date = new Date(this.w_d_service.end);
    this.w_d_service.start = new Date(end.getTime());
    this.w_d_service.end = new Date(end.getTime() + (this.w_d_service.end.getTime() - start.getTime()));
    this.setDateFromInput();
  }

  onCloseDatePicker(): void {
    (<HTMLInputElement>document.getElementById('calendar-begin')).value = this.unitService.getDailyDate(this.w_d_service.start);
    (<HTMLInputElement>document.getElementById('calendar-end')).value = this.unitService.getDailyDate(this.w_d_service.end);
    this.dateDropdown.classList.add('open');
  }

  /**
   *
   *
   * @param {DataRange} range
   * @returns {DataRange}
   * @memberof MelliChartsComponent
   */
   getRangeBYLang(range: DataRange): string {
    if (this.translateService.currentLang === 'fr') {
      return this.w_d_service.ranges.filter(_range => _range.type === range.type)[0].typeFr;
    } else if (this.translateService.currentLang === 'es') {
      return this.w_d_service.ranges.filter(_range => _range.type === range.type)[0].typeEs;
    } else {
      return range.type;
    }
  }

   /**
   *
   *
   * @param {string} type
   * @returns {Array<DataRange>}
   * @memberof MelliChartsComponent
   */
    getRangeByType(type: string): Array<DataRange> {
      let arg: DataRange;
      const ranges: Array<DataRange> = this.w_d_service.ranges.filter(elt => elt.type === type || elt.type === type + 'S');
      if (type === 'YEAR') {
        arg = this.w_d_service.ranges[10];
        ranges.unshift(arg);
        arg = this.w_d_service.ranges[9];
        ranges.unshift(arg);
      } else if (type === 'MONTH') {
        let index = ranges.findIndex(_range => _range.type === 'MONTHS' && _range.scale === 9);
        ranges.splice(index, 1);
        index = ranges.findIndex(_range => _range.type === 'MONTHS' && _range.scale === 6);
        ranges.splice(index, 1);
      }
      return ranges;
    }

    setDateFromInput(): void {
      const start = this.w_d_service.start;
      const end = this.w_d_service.end;
      this.w_d_service.setRangeForRequest([start, end]);
      if (this.router.url === PREFIX_PATH + 'records') {
        this.recordsComponent.loadAllRecords((options: any) => {
          this.w_o_service.getRecordsChartInstance().setOption(options, true);
          this.w_o_service.getRecordsChartInstance().hideLoading();
        });
      } 
    }

    /**
   *
   *
   * @param {DataRange} rangeSelect
   * @memberof MelliChartsComponent
   */
  setRangeSelect(rangeSelect: DataRange): void {
    this.w_d_service.setRange(rangeSelect);
    if (this.router.url === PREFIX_PATH + 'records' ) {
      this.recordsComponent.loadAllRecords((options: any) => {
        options.baseOption.xAxis[0].min = this.w_d_service.getRangeForRequest()[0];
        options.baseOption.xAxis[0].max = this.w_d_service.getRangeForRequest()[1];
        this.w_o_service.getRecordsChartInstance().setOption(options, true);
        this.w_o_service.getRecordsChartInstance().hideLoading();
      });
    }
  }

  getColor(apiary: RucherModel): string{
    switch(this.router.url){
      case PREFIX_PATH + 'records':
        if(this.w_o_service.getApiariesSelected().findIndex(_a => _a._id === apiary._id) !== -1){
          let index = this.user_apiaries.findIndex(_a => _a._id === apiary._id);
          return colors[index];
        }
        else{
          return 'white';
        }
        break;
      case PREFIX_PATH + 'config':
        if(this.w_o_service.getApiaryConfig()._id === apiary._id){
          let index = this.user_apiaries.findIndex(_a => _a._id === apiary._id);
          return colors[index];
        }
        else{
          return 'white';
        }
        break;
    }
    
  }

}

