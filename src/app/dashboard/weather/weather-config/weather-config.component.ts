import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { WeatherOptionService } from '../service/weather-option.service';

@Component({
  selector: 'app-weather-config',
  templateUrl: './weather-config.component.html',
  styleUrls: ['./weather-config.component.css']
})
export class WeatherConfigComponent implements OnInit {

  constructor(
    public w_o_service: WeatherOptionService
  ) { }

  ngOnInit() {
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-weather-records')) {
      elt.classList.remove('apiary-group-weather-records');
    } 
    elt.classList.add('apiary-group-weather-config');
  }

  changeApiary(apiary: RucherModel){}

}
