import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../service/api/alerts.service';
import { UserloggedService } from '../../userlogged.service';
import { AlertUser } from '../../_model/alertUser';

@Component({
  selector: 'app-alert-configuration',
  templateUrl: './alert-configuration.component.html',
  styleUrls: ['./alert-configuration.component.css']
})
export class AlertConfigurationComponent implements OnInit {

  constructor(private alertService: AlertsService, private userServuce: UserloggedService) { }

  public alertType: {
    _id: string,
    type: string
  }[];

  public alertUser: AlertUser;
  ngOnInit() {
    this.alertService.getAllTypeAlerts().subscribe(
      _alerts => {
        this.alertType = _alerts;
      }
    );
    this.alertService.getAlertConfByUser(this.userServuce.getIdUserLoged()).subscribe(
      _alertConf => {
        this.alertUser = _alertConf;
        console.log(this.alertUser);
      }
    );
  }

  isEnable(alertId: string): boolean {
    try {
      return this.alertUser.alertConf[alertId].enable;
    } catch {}
  }

/*   sorByStatus(status: boolean) {
    this.alertType.sort((a, b) => {

    })
  } */
  onEnable(alertId: string): void {
    console.log(alertId);
    if (!this.alertUser.alertConf[alertId].enable) {
      this.alertUser.alertConf[alertId].enable = true;
    }
    console.log(this.alertUser.alertConf[alertId]);
  }

  onDisable(alertId: string): void {
    console.log(alertId);
    if (this.alertUser.alertConf[alertId].enable) {
      this.alertUser.alertConf[alertId].enable = false;
    }
    console.log(this.alertUser.alertConf[alertId]);
  }
}
