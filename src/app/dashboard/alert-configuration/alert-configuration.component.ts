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
import { UserParamsService } from '../preference-config/service/user-params.service';
import { MyNotifierService } from '../service/my-notifier.service';
import { NotifList } from '../../../constants/notify';
import { NOTIF_DESCRIPTION5 } from '../../../constants/notif_description';

@Component({
  selector: 'app-alert-configuration',
  templateUrl: './alert-configuration.component.html',
  styleUrls: ['./alert-configuration.component.css']
})
export class AlertConfigurationComponent implements OnInit {

  constructor(
    private alertService: AlertsService,
    private userServuce: UserloggedService,
    private notifService: MyNotifierService,
    private userPrefService: UserParamsService) { }

  public alertType: AlertCat[];

  public alertUser: AlertUser;
  ngOnInit() {
    this.alertService.getAllTypeAlerts().subscribe(
      _alerts => {
        this.alertType = _alerts;
        console.log(this.alertType);
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

  /**
   *
   *
   * @param {string} alertId
   * @returns {number[]}
   * @memberof AlertConfigurationComponent
   */
  getRangeValue(alertId: string): number[] {
    try {
      if (this.isMetric()) {
        return this.alertType.filter(_alert => _alert._id === alertId)[0].rangeValueMet;
      } else {
        return this.alertType.filter(_alert => _alert._id === alertId)[0].rangeValueImp;
      }
    } catch {}
  }

  /**
   *
   *
   * @param {string} alertId
   * @returns {number}
   * @memberof AlertConfigurationComponent
   */
  getStep(alertId: string): number {
    try {
      if (this.isMetric()) {
        return this.alertType.filter(_alert => _alert._id === alertId)[0].stepMet;
      } else {
        return this.alertType.filter(_alert => _alert._id === alertId)[0].stepImp;
      }
    } catch {}
  }
  isAlterable(alertId: string): boolean {
    try {
      return this.alertType.filter(_alert => _alert._id === alertId)[0].alterable;
    } catch {}
  }

  getUserValue(alertId: string): number {
    try {
      if (this.isMetric()) {
      return  this.alertUser.alertConf[alertId].valueMet;
      } else {
      return  this.alertUser.alertConf[alertId].valueImp;
      }
    } catch {}
  }

/*   sorByStatus(status: boolean) {
    this.alertType.sort((a, b) => {

    })
  } */
  
  /**
   *
   *
   * @param {string} _alertName
   * @returns {string}
   * @memberof AlertConfigurationComponent
   */
  getNotifDescriptionFromLangage(_alertName: string): string {
    if (this.userPrefService.getUserPref().lang.toUpperCase().indexOf('FR') !== -1) {
      return NOTIF_DESCRIPTION5.FR[_alertName];
    } else {
      return NOTIF_DESCRIPTION5.EN[_alertName];
    }
  }

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
    if (this.isMetric()) {
      this.alertUser.alertConf[alertId].valueMet = value;
    } else {
      this.alertUser.alertConf[alertId].valueImp = value;
    }
  }

  onSave() {
    this.alertService.updateAlertConf(this.alertUser).subscribe(
      _res => {
        this.notifService.sendSuccessNotif(NotifList.SAVE_ALERT_CONF);
      }
    )
  }

/**
 *
 *
 * @returns {boolean}
 * @memberof AlertConfigurationComponent
 */
isMetric(): boolean {
    return this.userPrefService.getUserPref().unitSystem === 'METRIC';
  }
}

