import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NOTIF_MSG, NotifList } from '../../../constants/notify';

const SUCCESS = 'success';
const WARNING = 'warning';
const DANGER = 'danger';

@Injectable({
  providedIn: 'root'
})
export class MyNotifierService {

  /**
   *
   *
   * @private
   * @type {NotifierService}
   * @memberof MyNotifierService
   */
  private notif: NotifierService;
  private currentLang: string;
  /**
   *Creates an instance of MyNotifierService.
   * @param {NotifierService} notiferService
   * @memberof MyNotifierService
   */
  constructor(private notiferService: NotifierService) {
    this.notif = notiferService;
  }

  /**
   *
   *
   * @param {string} currentLang
   * @memberof MyNotifierService
   */
  setLang(currentLang: string): void {
    this.currentLang = currentLang;
  }

  /**
   *
   *
   * @param {NotifList} msg
   * @memberof MyNotifierService
   */
  sendWarningNotif(msg: NotifList): void {
    console.log(msg);
    this.notif.notify(WARNING, NOTIF_MSG.FAIL[this.currentLang][msg]);
  }

  /**
   *
   *
   * @param {NotifList} msg
   * @memberof MyNotifierService
   */
  sendDangerNotif(msg: NotifList): void {
    this.notif.notify(DANGER, NOTIF_MSG.FAIL[this.currentLang][msg]);
  }

  /**
   *
   *
   * @param {NotifList} msg
   * @memberof MyNotifierService
   */
  sendSuccessNotif(msg: NotifList) {
    this.notif.notify(SUCCESS, NOTIF_MSG.SUCCESS[this.currentLang][msg]);
  }
}
