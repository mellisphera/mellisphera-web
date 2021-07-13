/** Copyright 2018-present Mellisphera
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
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AtokenStorageService } from './auth/Service/atoken-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from './dashboard/service/loading.service';
import { AuthService } from './auth/Service/auth.service';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour}


     constructor(public location: Location,
      public router: Router,
      public tokenService: AtokenStorageService,
      private authService: AuthService,
      private translateService: TranslateService,
      public loadingService: LoadingService) {
       translateService.addLangs(['en', 'fr']);
       translateService.setDefaultLang('en');
       this.primaryColour = PrimaryRed;
       this.secondaryColour = SecondaryBlue;
       this.checkLogin();
     }

    ngOnInit(){
    }

    checkLogin() {
      this.authService.authState.subscribe(
        (_status: boolean) => {
          if (!_status) {
            if (this.location.path().indexOf('login?email=') === -1) {
              this.router.navigateByUrl('login');
            }
          } else {
            if (this.location.path() === '' || this.location.path().indexOf('login?email=') !== -1) {
              this.router.navigateByUrl('dashboard/home/info-apiary');
            }
          }
        }
      )
    }

    isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }
}
