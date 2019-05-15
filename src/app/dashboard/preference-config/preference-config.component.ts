import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from './service/user-params.service';
import { Subscription } from 'rxjs';
import { UserPref } from '../../_model/user-pref';
import { AuthService } from '../../auth/Service/auth.service';

@Component({
  selector: 'app-preference-config',
  templateUrl: './preference-config.component.html',
  styleUrls: ['./preference-config.component.css']
})
export class PreferenceConfigComponent implements OnInit, OnDestroy {


  public formatDt: number;
  public unitSys: string;
  public suscribPref: Subscription;
  private userPref: UserPref;
  constructor(public userConfig: UserParamsService, private authService: AuthService) { }
  ngOnInit() {
    this.suscribPref = this.userConfig.getSubject().subscribe(
      data => {
        this.userPref = data;
        this.formatDt = this.userConfig.dtFormat.indexOf(this.userPref.timeFormat);
        this.unitSys = this.userPref.unitSystem;
      }
    )
  }

  saveFormat(): void {
    this.userConfig.setFormatDt(this.formatDt);
    this.saveUserPref();
  }

  saveUnit(): void {
    this.userPref.unitSystem = this.unitSys;
    this.userConfig.setUnit(this.unitSys);
    this.saveUserPref();
  }
  ngOnDestroy(): void {
    this.suscribPref.unsubscribe();
  }

  saveUserPref(): void {
    this.userConfig.setUserPref().subscribe(
      () => {}, () => {}, () => {
        if (this.authService.jwtReponse === undefined) {
          this.authService.jwtReponse = JSON.parse(window.sessionStorage.getItem('jwtReponse'));
        }
        this.authService.jwtReponse.userPref = this.userPref;
        this.userConfig.emitPrefSubject();
        window.sessionStorage.removeItem('jwtReponse');
        window.sessionStorage.setItem('jwtReponse', JSON.stringify(this.authService.jwtReponse));
      }
    );
  }
}
