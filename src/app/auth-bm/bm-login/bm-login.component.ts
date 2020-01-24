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



import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/Service/auth.service';
import { Login } from '../../_model/login';
import { EULA } from '../../EULA';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { MESSAGES, MessagesList } from '../../../constants/messages';

@Component({
  selector: 'app-bm-login',
  templateUrl: './bm-login.component.html',
  styleUrls: ['./bm-login.component.css']
})
export class BmLoginComponent implements OnInit, OnDestroy, AfterViewInit {

  public email: string;
  public messageList: any;
  public password: string;
  public newUser: boolean;
  public readMore: boolean;
  public eula = EULA;
  public eulaCheck: boolean;
  private urlYtb: string;
  public safeSrc: SafeResourceUrl;
  constructor(private route: ActivatedRoute,
    public authService: AuthService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {
      this.newUser, this.readMore = false;
      this.messageList = MessagesList;
      this.urlYtb = 'https://www.youtube.com/embed/pbCqpf8EY0s';
      this.translateService.use(this.translateService.getBrowserLang());
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlYtb);

    }

  ngOnInit() {
    //document.querySelector('body').classList.add('login-bm');
    this.route.queryParams.subscribe(
      _res => {
        this.email = _res.email;
        this.newUser = _res.new == 'true';
        this.eulaCheck = !this.newUser;
      }
    );

  }

  ngAfterViewInit(): void {
/*     console.log(document.querySelector(".eulaMobile input[type=checkbox]"));
    if (!this.eulaCheck && window.innerWidth <= 990) {
      document.querySelector(".eulaMobile input[type=checkbox]").scrollIntoView();
    } */
    
  }

  checkButtonIsDisabled() {
    return (document.querySelector('#btnLoginDesktop') as any).disabled;
  }


  getMessageTraduction(msg: MessagesList) : string{
    let language : string = this.translateService.currentLang.toUpperCase();
    return(MESSAGES[language][msg]);
  }
  
  agreeEula(event : any) /* event checkbox */{
    this.eulaCheck = event.target.checked;
  }
  login(): void {
    if (this.eulaCheck) {
      this.authService.login = {
        email: this.email,
        password: this.password
      };
      this.authService.signIn('LOGIN_BM');
    }
  }

  ngOnDestroy(): void {
    //document.querySelector('body').classList.remove('login-bm');
  }

}
