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
import { UserParamsService } from './service/user-params.service';
import { Subscription } from 'rxjs';
import { UserPref } from '../../_model/user-pref';
import { AuthService } from '../../auth/Service/auth.service';
import { NotifierService } from 'angular-notifier';
import { UserloggedService } from '../../userlogged.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { GraphGlobal } from '../graph-echarts/GlobalGraph';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-preference-config',
  templateUrl: './preference-config.component.html',
  styleUrls: ['./preference-config.component.css']
})
export class PreferenceConfigComponent implements OnInit, OnDestroy {


  public formatDt: number;
  public unitSys: string;
  public suscribPref: Subscription;
  public notifConfig: {
    name: string,
    icon: string,
    enable: boolean,
    value: number[]
  }[];
  private notifyService: NotifierService;
  private userPref: UserPref;
  public passwordForm: FormGroup;
  constructor(public userConfig: UserParamsService, private authService: AuthService,
    private notifier: NotifierService,
    private graphGlobalService: GraphGlobal,
    private userService: UserloggedService,
    public translateService: TranslateService,
    private formBuilder: FormBuilder) {
    this.notifConfig = [
      { name: 'Rain', icon: './assets/pictos_alerts/newIcones/Rain_1.svg', enable: true, value: [0, 10]},
      { name: 'Snow', icon: './assets/pictos_alerts/newIcones/Snow_1.svg', enable: true, value: [0, 10]},
      { name: 'Hmin', icon: './assets/pictos_alerts/newIcones/Hmin_1.svg', enable: true, value: [0, 10]},
      { name: 'Hmin', icon: './assets/pictos_alerts/newIcones/Hmin_1.svg', enable: true, value: [0, 10]},
      { name: 'Hmin', icon: './assets/pictos_alerts/newIcones/Hmin_1.svg', enable: true, value: [0, 10]}

    ];
    this.notifyService = notifier;
  }
  ngOnInit() {
    this.suscribPref = this.userConfig.getSubject().subscribe(
      data => {
        this.userPref = data;
        this.formatDt = this.userConfig.dtFormat.indexOf(this.userPref.timeFormat);
        this.unitSys = this.userPref.unitSystem;
      }
    );
    this.passwordForm = this.formBuilder.group({
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'confirmPassword': ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  changeLangToggle() {
    if (this.translateService.currentLang === 'fr') {
      this.translateService.use('en');
      this.userService.setCountry('en');
    } else {
      this.translateService.use('fr');
      this.userService.setCountry('fr');
    }
    this.userConfig.emitPrefSubject();
    // translateService.use('en')
    // translateService.use('fr')
  }
  saveFormat(): void {
    this.userConfig.setFormatDt(this.formatDt);
    this.saveUserPref();
  }

  getConfirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  saveUnit(): void {
    this.userPref.unitSystem = this.unitSys;
    if (this.unitSys === 'IMPERIAL') {
      this.graphGlobalService.setImperial();
    } else {
      this.graphGlobalService.setMetric();
    }
    this.userConfig.setUnit(this.unitSys);
    this.saveUserPref();
  }
  ngOnDestroy(): void {
    this.suscribPref.unsubscribe();
  }

  checkPassword(): string {
    return this.passwordForm.get('confirmPassword').value === this.passwordForm.get('password').value ? 'checkOk' : 'checkError';
  }

  setNewPassword() {
    this.userConfig.updatePassword(this.passwordForm.get('confirmPassword').value).subscribe(
      () => { }, () => { }, () => {
        if (this.userService.getJwtReponse().country === "FR") {
          this.notifier.notify('success', 'Mot de passe sauvegardé');
        } else {
          this.notifier.notify('success', 'Password saved');
        }
      }
    )
  }

  test(event: any) {
    console.log(event);
  }
  saveUserPref(): void {
    this.userConfig.setUserPref().subscribe(
      () => { }, () => { }, () => {
        if (this.authService.jwtReponse === undefined) {
          this.authService.jwtReponse = JSON.parse(window.sessionStorage.getItem('jwtReponse'));
        }
        this.authService.jwtReponse.userPref = this.userPref;
        this.userConfig.emitPrefSubject();
        if (this.userService.getJwtReponse().country === "FR") {
          this.notifier.notify('success', 'Paramètres sauvegardés');
        } else {
          this.notifier.notify('success', 'Settings saved');
        }
        window.sessionStorage.removeItem('jwtReponse');
        window.sessionStorage.setItem('jwtReponse', JSON.stringify(this.authService.jwtReponse));
      }
    );
  }
}
