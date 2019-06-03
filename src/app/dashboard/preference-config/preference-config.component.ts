import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from './service/user-params.service';
import { Subscription } from 'rxjs';
import { UserPref } from '../../_model/user-pref';
import { AuthService } from '../../auth/Service/auth.service';
import { NotifierService } from 'angular-notifier';
import { UserloggedService } from '../../userlogged.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-preference-config',
  templateUrl: './preference-config.component.html',
  styleUrls: ['./preference-config.component.css']
})
export class PreferenceConfigComponent implements OnInit, OnDestroy {


  public formatDt: number;
  public unitSys: string;
  public suscribPref: Subscription;
  private notifyService: NotifierService;
  private userPref: UserPref;
  public passwordForm: FormGroup;
  constructor(public userConfig: UserParamsService, private authService: AuthService,
    private notifier: NotifierService, private loginService: UserloggedService,
    private formBuilder: FormBuilder) {
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

  saveFormat(): void {
    this.userConfig.setFormatDt(this.formatDt);
    this.saveUserPref();
  }

  getConfirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  saveUnit(): void {
    this.userPref.unitSystem = this.unitSys;
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
      () => {}, () => {}, () => {
        this.notifier.notify('success', 'Password saved');
      }
    )
  }

  test(event: any) {
    console.log(event);
  }
  saveUserPref(): void {
    this.userConfig.setUserPref().subscribe(
      () => {}, () => {}, () => {
        if (this.authService.jwtReponse === undefined) {
          this.authService.jwtReponse = JSON.parse(window.sessionStorage.getItem('jwtReponse'));
        }
        this.authService.jwtReponse.userPref = this.userPref;
        this.userConfig.emitPrefSubject();
        this.notifyService.notify('success', 'Settings saved');
        window.sessionStorage.removeItem('jwtReponse');
        window.sessionStorage.setItem('jwtReponse', JSON.stringify(this.authService.jwtReponse));
      }
    );
  }
}
