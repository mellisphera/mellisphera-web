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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';

import { LoginComponent } from './auth/login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { UserloggedService } from './userlogged.service';
import { AuthService } from './auth/Service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { SignupService } from './auth/Service/signup.service';
import { AuthInterceptorService } from './auth/Service/auth-interceptor.service';
import { NotifierModule } from 'angular-notifier';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MyDatePipe } from './pipe/my-date.pipe';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './dashboard/service/socket.service';
import { AuthGuardService } from './auth/auth-guard.service';

const config: SocketIoConfig = { url: 'https://t1.mellisphera.com:3000', options: {} };
export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
   return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    Erreur404ComponentComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'middle'
        },
        vertical: {
          position: 'top',
        }
      }
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgxLoadingModule.forRoot({}),
  ],
  providers: [
    UserloggedService,
    AuthService,
    SocketService,
    JwtHelperService,
    AuthGuardService,
    SignupService,
    // MeteoService,
    // GraphFlowerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  exports:[
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
