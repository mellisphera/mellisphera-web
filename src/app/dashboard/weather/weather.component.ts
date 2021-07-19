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

const PREFIX_PATH = '/dashboard/weather/';

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

  constructor(
    public rucheService: RucheService,
    public rucherService: RucherService,
    private userService: UserloggedService,
    private router: Router,
    private w_o_service: WeatherOptionService,
    public w_d_service: WeatherDateService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => {
        this.user_apiaries = [..._apiaries];
      },
      () => {},
      () => {}
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

  previousDate(){}

  nextDate(){}

}

