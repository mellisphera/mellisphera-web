import { Component, OnInit, Input } from '@angular/core';
import { AlertCat } from '../../../_model/alertCat';
import { AlertUser } from '../../../_model/alertUser';
import { TranslateService } from '@ngx-translate/core';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { NotifList } from '../../../../constants/notify';
import { NOTIF_DESCRIPTION5 } from '../../../../constants/notif_description';

@Component({
  selector: 'app-settings-view-template',
  templateUrl: './settings-view-template.component.html',
  styleUrls: ['./settings-view-template.component.css']
})
export class SettingsViewTemplateComponent implements OnInit {

  @Input() alertTypes: AlertCat[];
  @Input() alertUser: AlertUser;

  constructor(private translateService: TranslateService, 
              private userPrefService: UserParamsService) { }

  ngOnInit() {
  }


  isEnable(alertId: string): boolean {
    try {
      if (!this.alertUser.emailEnable) {
        return false;
      } else {
        return this.alertUser.alertConf[alertId].enable;
      }
    } catch { }
  }

  
  emailIsEnable(): boolean {
    try{
      return this.alertUser.emailEnable
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
        return this.alertTypes.filter(_alert => _alert._id === alertId)[0].rangeValueMet;
      } else {
        return this.alertTypes.filter(_alert => _alert._id === alertId)[0].rangeValueImp;
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
      const alert = this.alertTypes.filter(_alert => _alert._id === alertId)[0];
      if (this.isMetric()) {
        return alert.stepMet;
      } else {
        return alert.stepImp;
      }
    } catch { }
  }
  isAlterable(alertId: string): boolean {
    try {
      return this.alertTypes.filter(_alert => _alert._id === alertId)[0].alterable;
    } catch { }
  }

  getNameByLang(alertId: string) {
    if (this.translateService.currentLang === 'fr') {
      return this.alertTypes.filter(_alert => _alert._id === alertId)[0].nameFr;
    } else if (this.translateService.currentLang === 'es') {
      return this.alertTypes.filter(_alert => _alert._id === alertId)[0].nameEs;
    } else {
      return this.alertTypes.filter(_alert => _alert._id === alertId)[0].nameEn;
    }
  }

  getUserValue(alertId: string): number {
    let currentAlaert = this.alertTypes.filter(_alert => _alert._id === alertId)[0];
    try {
      if (this.isMetric()) {
        return this.alertUser.alertConf[alertId].valueMet;
      } else {
        return this.alertUser.alertConf[alertId].valueImp;
      }
    } catch { }
  }

  getUnit(alertId: string) {
    let currentAlaert = this.alertTypes.filter(_alert => _alert._id === alertId)[0];
    try {
      if (this.isMetric()) {
        return currentAlaert.unitMet;
      } else {
        return currentAlaert.unitImp;
      }
    } catch { }
  }

    getPeriod(alertId: string) {
      const alert = this.alertTypes.filter(_alert => _alert._id === alertId)[0];
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
    if (!this.alertUser.alertConf[alertId].enable) {
      this.alertUser.alertConf[alertId].enable = true;
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

/*   onSave() {
    this.updateAlertConf(this.alertUser).subscribe(
      _res => {
        this.notifService.sendSuccessNotif(NotifList.SAVE_ALERT_CONF);
      }
    );
  } */

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
