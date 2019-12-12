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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/Service/auth.service';
import { Login } from '../../_model/login';
import { EULA } from '../../EULA';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bm-login',
  templateUrl: './bm-login.component.html',
  styleUrls: ['./bm-login.component.css']
})
export class BmLoginComponent implements OnInit, OnDestroy {

  public email: string;
  public password: string;
  public eulaRead: boolean;
  public eula = EULA;
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private translateService: TranslateService,
    private router: Router) {
      this.eulaRead = false;
      this.translateService.use(this.translateService.getBrowserLang());
    }

  ngOnInit() {
    document.querySelector('body').classList.add('login-bm');
    this.email = this.route.snapshot.params.email;

  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('login-bm');
  }

  login(): void {
    this.authService.login = {
      email: this.email,
      password: this.password
    };
    this.authService.signIn('LOGIN_BM');
  }

}
