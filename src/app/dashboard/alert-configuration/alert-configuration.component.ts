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

  const PREFIX_PATH = '/dashboard/alert-configuration/';


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
import { Router } from '@angular/router';

  @Component({
    selector: 'app-alert-configuration',
    templateUrl: './alert-configuration.component.html',
    styleUrls: ['./alert-configuration.component.css']
  })
  export class AlertConfigurationComponent implements OnInit, OnDestroy {

    constructor(
      public alertService: AlertsService,
      private router: Router,
      private notifService: MyNotifierService) { }


    ngOnInit() {
    }


    navigate(path: string): void {
      this.router.navigateByUrl(PREFIX_PATH + path);
    }

    ngOnDestroy(): void {
      this.alertService.updateAlertConf(this.alertService.alertUser).subscribe(
        _res => {
          this.notifService.sendSuccessNotif(NotifList.SAVE_ALERT_CONF);
        }
      );

    }
  }


