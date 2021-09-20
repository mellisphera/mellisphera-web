import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../../service/api/alerts.service';
import { AlertCat } from '../../../_model/alertCat';
import { AlertUser } from '../../../_model/alertUser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hive-alert',
  templateUrl: './hive-alert.component.html',
  styleUrls: ['./hive-alert.component.css']
})
export class HiveAlertComponent implements OnInit {

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
