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

import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotifList } from '../../../constants/notify';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(private notiferService: NotifierService,
    private translateService: TranslateService,) {
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
    this.notif.notify(WARNING, this.translateService.instant('NOTIFY.FAIL.' + msg));
  }

  /**
   *
   *
   * @param {NotifList} msg
   * @memberof MyNotifierService
   */
  sendDangerNotif(msg: NotifList): void {
    this.notif.notify(DANGER, this.translateService.instant('NOTIFY.FAIL.' + msg));
  }

  /**
   *
   *
   * @param {NotifList} msg
   * @memberof MyNotifierService
   */
  sendSuccessNotif(msg: NotifList) {
    this.notif.notify(SUCCESS, this.translateService.instant('NOTIFY.SUCCESS.' + msg));
  }
}
