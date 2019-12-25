import { Component, OnInit, Input } from '@angular/core';
import { AlertUser } from '../../../_model/alertUser';
import { AlertsService } from '../../service/api/alerts.service';

@Component({
  selector: 'app-alerts-conf-submit',
  templateUrl: './alerts-conf-submit.component.html',
  styleUrls: ['./alerts-conf-submit.component.css']
})
export class AlertsConfSubmitComponent implements OnInit {

  public alertUser: AlertUser;
  constructor(private alertService: AlertsService) {
    console.log(this.alertService.alertUser);
    this.alertUser = this.alertService.alertUser;
  }

  ngOnInit() {
  }

  onEnable() {}
  onDisable() {}
}
