import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { WeatherOptionService } from '../service/weather-option.service';

@Component({
  selector: 'app-weather-records',
  templateUrl: './weather-records.component.html',
  styleUrls: ['./weather-records.component.css']
})
export class WeatherRecordsComponent implements OnInit {

  constructor(
    public w_o_service: WeatherOptionService
  ) { }

  ngOnInit() {
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-weather-config')) {
      elt.classList.remove('apiary-group-weather-config');
    } 
    elt.classList.add('apiary-group-weather-records');
  }

  loadRecords(apiary: RucherModel){}

  removeRecords(apiary: RucherModel){}

}
