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
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

declare var $:any;

@Component({
    selector: 'footer-cmp',
    styleUrls: ['footer.component.css'],
    templateUrl: 'footer.component.html'
})

export class FooterComponent implements OnInit {
    urlHelp: String;
    pageHeight: number;
    routerSubscribe : Subscription;
    constructor(
        private translate: TranslateService,
        private router: Router
        ) {
        this.urlHelp = "";
    }
    ngOnInit(){
        this.changeHelpUrl(this.router.url);
        this.routerSubscribe = this.router.events.subscribe((val) => {
            if(val instanceof NavigationStart) {
                this.changeHelpUrl(val.url);
            }
        });
    }
    changeHelpUrl(url: String){
        switch(url) { 
            case '/dashboard/home/info-apiary': { 
                this.urlHelp = this.translate.instant('HELP_LINK.MY_APIARY.APIARY');
                break;
            }
            case '/dashboard/home/info-hives': { 
                this.urlHelp = this.translate.instant('HELP_LINK.MY_APIARY.HIVE');
                break;
            }
            case '/dashboard/explore/hive': { 
                this.urlHelp = this.translate.instant('HELP_LINK.EXPLORE.HIVE');
                break;
            }
            case '/dashboard/explore/brood': { 
                this.urlHelp = this.translate.instant('HELP_LINK.EXPLORE.BROOD');
                break;
            }
            case '/dashboard/explore/weight': { 
                this.urlHelp = this.translate.instant('HELP_LINK.EXPLORE.WEIGHT');
                break;
            }
            case '/dashboard/explore/events': { 
                this.urlHelp = this.translate.instant('HELP_LINK.EXPLORE.EVENTS');
                break;
            }
            case '/dashboard/explore/stack': { 
                this.urlHelp = this.translate.instant('HELP_LINK.EXPLORE.DATA');
                break;
            }
            case '/dashboard/inspect/new': { 
                this.urlHelp = this.translate.instant('HELP_LINK.INSPECT.NEW');
                break;
            }
            case '/dashboard/inspect/history': { 
                this.urlHelp = this.translate.instant('HELP_LINK.INSPECT.HISTORY');
                break;
            }
            case '/dashboard/inspect/params': { 
                this.urlHelp = this.translate.instant('HELP_LINK.INSPECT.PARAMS');
                break;
            }
            case '/dashboard/alert-configuration/hive-alert': { 
                this.urlHelp = this.translate.instant('HELP_LINK.ALERTS.HIVE');
                break;
            }
            case '/dashboard/alert-configuration/weather-alert': { 
                this.urlHelp = this.translate.instant('HELP_LINK.ALERTS.WEATHER');
                break;
            }
            case '/dashboard/alert-configuration/sensor-alert': { 
                this.urlHelp = this.translate.instant('HELP_LINK.ALERTS.SENSOR');
                break;
            }
            case '/dashboard/alert-configuration/alert-submit': { 
                this.urlHelp = this.translate.instant('HELP_LINK.ALERTS.PARAMS');
                break;
            }
            case '/dashboard/weather/records': { 
                this.urlHelp = this.translate.instant('HELP_LINK.WEATHER.RECORDS');
                break;
            }
            case '/dashboard/weather/config': { 
                this.urlHelp = this.translate.instant('HELP_LINK.WEATHER.CONFIG');
                break;
            }
            default: {
                break;
            }
        }
        this.pageHeight = document.body.scrollHeight;
        console.log(this.pageHeight);
    }
    ngOnDestroy(){
        this.routerSubscribe.unsubscribe();
    }
}
