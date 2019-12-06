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



  import { Component, OnInit, OnDestroy } from '@angular/core';
  import { AlertsService } from '../service/api/alerts.service';
  import { UserloggedService } from '../../userlogged.service';
  import { AlertUser } from '../../_model/alertUser';
  import { AlertCat } from '../../_model/alertCat';
  import { UserParamsService } from '../preference-config/service/user-params.service';
  import { MyNotifierService } from '../service/my-notifier.service';
  import { NotifList } from '../../../constants/notify';
  import { NOTIF_DESCRIPTION5 } from '../../../constants/notif_description';
import { TranslateService } from '@ngx-translate/core';

  @Component({
    selector: 'app-alert-configuration',
    templateUrl: './alert-configuration.component.html',
    styleUrls: ['./alert-configuration.component.css']
  })
  export class AlertConfigurationComponent implements OnInit, OnDestroy {

    constructor(
      public alertService: AlertsService,
      private userServuce: UserloggedService,
      private translateService: TranslateService,
      private notifService: MyNotifierService,
      private userPrefService: UserParamsService) { }


    ngOnInit() {
    }

    isEnable(alertId: string): boolean {
      try {
        return this.alertService.alertUser.alertConf[alertId].enable;
      } catch { }
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
          return this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0].rangeValueMet;
        } else {
          return this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0].rangeValueImp;
        }
      } catch { }
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
        const alert = this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0];
        if (this.isMetric()) {
          return alert.stepMet;
        } else {
          return alert.stepImp;
        }
      } catch { }
    }
    isAlterable(alertId: string): boolean {
      try {
        return this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0].alterable;
      } catch { }
    }

    getNameByLang(alertId: string) {
      if (this.translateService.currentLang === 'fr') {
        return this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0].nameFr;
      } else if (this.translateService.currentLang === 'es') {
        return this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0].nameEs;
      } else {
        return this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0].nameEn;
      }
    }

    getUserValue(alertId: string): number {
      let currentAlaert = this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0];
      try {
        if (this.isMetric()) {
          return this.alertService.alertUser.alertConf[alertId].valueMet;
        } else {
          return this.alertService.alertUser.alertConf[alertId].valueImp;
        }
      } catch { }
    }

    getUnit(alertId: string) {
      let currentAlaert = this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0];
      try {
        if (this.isMetric()) {
          return currentAlaert.unitMet;
        } else {
          return currentAlaert.unitImp;
        }
      } catch { }
    }

      getPeriod(alertId: string) {
        const alert = this.alertService.alertTypes.filter(_alert => _alert._id === alertId)[0];
        if (alert.period !== '') {
          return '/' + this.getPeriodByLang(alert.period, this.translateService.currentLang);
        } else {
          return '';
        }
      }

      userHaveWeatherStation(): boolean {
        return this.userPrefService.getUserPref().weatherStation;
      }

      getPeriodByLang(period: string, lang: string) {
        if (lang === 'fr') {
          if (period === 'week') {
            return 'semaine';
          } else if (period === 'day') {
            return 'jour';
          }
        } else if (lang === 'es') {
          if (period === 'week') {
            return 'semana';
          } else if (period === 'day') {
            return 'día';
          }
        } else {
          return period;
        }
      }
    /**
     *
     *
     * @param {string} _alertName
     * @returns {string}
     * @memberof AlertConfigurationComponent
     */
    getNotifDescriptionFromLangage(_alertName: string): string {
/*       if (this.translateService.currentLang === 'fr') {
        return NOTIF_DESCRIPTION5.FR[_alertName];
      } else {
        return NOTIF_DESCRIPTION5.EN[_alertName];
      }*/
      const lang = this.translateService.currentLang.toUpperCase();
      return NOTIF_DESCRIPTION5[lang][_alertName];
    }

    onEnable(alertId: string): void {
      if (!this.alertService.alertUser.alertConf[alertId].enable) {
        this.alertService.alertUser.alertConf[alertId].enable = true;
      }
    }

    getLabelDay(): string {
      if (this.translateService.currentLang === 'fr') {
        return 'jours';
      } else {
        return 'days';
      }
    }


    onDisable(alertId: string): void {
      if (this.alertService.alertUser.alertConf[alertId].enable) {
        this.alertService.alertUser.alertConf[alertId].enable = false;
      }
    }

    onChageValue(value: number, alertId: string) {
      if (this.isMetric()) {
        this.alertService.alertUser.alertConf[alertId].valueMet = value;
      } else {
        this.alertService.alertUser.alertConf[alertId].valueImp = value;
      }
    }

    onSave() {
      this.alertService.updateAlertConf(this.alertService.alertUser).subscribe(
        _res => {
          this.notifService.sendSuccessNotif(NotifList.SAVE_ALERT_CONF);
        }
      );
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

    ngOnDestroy(): void {
      this.alertService.updateAlertConf(this.alertService.alertUser).subscribe(
        _res => {
          this.notifService.sendSuccessNotif(NotifList.SAVE_ALERT_CONF);
        }
      );

    }
  }


