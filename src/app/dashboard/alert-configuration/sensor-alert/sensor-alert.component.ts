import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../../service/api/alerts.service';
import { AlertCat } from '../../../_model/alertCat';
import { AlertUser } from '../../../_model/alertUser';

@Component({
  selector: 'app-sensor-alert',
  templateUrl: './sensor-alert.component.html',
  styleUrls: ['./sensor-alert.component.css']
})
export class SensorAlertComponent implements OnInit {

  constructor(private alertService: AlertsService) { }

  ngOnInit() {
  }

  getAlertTypeByCategory(category: string): AlertCat[] {
    try{
      return this.alertService.alertTypes.filter(_altType => _altType.category === category);
    } catch {}
  }

  getAlertConf(): AlertUser {
    return this.alertService.alertUser;
  }

  

}
