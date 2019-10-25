/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */ 



import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../service/api/alerts.service';
import { UserloggedService } from '../../userlogged.service';
import { AlertUser } from '../../_model/alertUser';
import { AlertCat } from '../../_model/alertCat';

@Component({
  selector: 'app-alert-configuration',
  templateUrl: './alert-configuration.component.html',
  styleUrls: ['./alert-configuration.component.css']
})
export class AlertConfigurationComponent implements OnInit {

  constructor(private alertService: AlertsService, private userServuce: UserloggedService) { }

  public alertType: AlertCat[];

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

  isAlterable(alertId: string): boolean {
    try {
      return this.alertType.filter(_alert => _alert._id === alertId)[0].alterable;
    } catch {}
  }

  getUserValue(alertId: string): number {
    try {
      return this.alertUser.alertConf[alertId].value;
    } catch {}
  }

/*   sorByStatus(status: boolean) {
    this.alertType.sort((a, b) => {

    })
  } */
  onEnable(alertId: string): void {
    if (!this.alertUser.alertConf[alertId].enable) {
      this.alertUser.alertConf[alertId].enable = true;
    }
  }

  onDisable(alertId: string): void {
    if (this.alertUser.alertConf[alertId].enable) {
      this.alertUser.alertConf[alertId].enable = false;
    }
  }

  onChageValue(value: number, alertId: string) {
    this.alertUser.alertConf[alertId].value = value;
    console.log(this.alertUser.alertConf[alertId]);
  }
}
