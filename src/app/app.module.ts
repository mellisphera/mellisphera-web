import { GraphFlowerService } from './demo/graph/graph-flower.service';
import { GraphHoneyService } from './demo/graph/graph-honey.service';
import { CalendrierFSTLervice } from './demo/graph/calendrierFSTL';
import { HomeComponent } from './dashboard/home/home.component';
import { ConnectionService } from './admin/service/connection.service';
import { ConnectionsMapService } from './admin/service/connections-map.service';
import { GraphStackService } from './dashboard/apiary/ruche-rucher/ruche-detail/stack/service/graph-stack.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { FooterModule } from './dashboard/shared/footer/footer.module';
import { SidebarModule } from './dashboard/sidebar/sidebar.module';

import { AppComponent } from './app.component';
import { MeteoComponent } from './dashboard/meteo/meteo.component';
import { RucheRucherComponent } from './dashboard/apiary/ruche-rucher/ruche.rucher.component';
import { CapteurComponent } from './dashboard/capteur/capteur.component';
import { NouveauCapteurComponent } from './dashboard/capteur/nouveau-capteur/nouveau-capteur.component';
import { FleursFloraisonComponent } from './dashboard/fleurs-floraison/fleurs.floraison.component';

import { LoginComponent } from './auth/login/login.component';
import { RapportComponent } from './dashboard/rapport/rapport.component';

import { ReactiveFormsModule } from '@angular/forms';

import { CapteurService } from './dashboard/capteur/capteur.service';
import { RucherService } from './dashboard/apiary/ruche-rucher/rucher.service';
import { UserloggedService } from './userlogged.service';
import { AuthService } from './auth/Service/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { SignupService } from './admin/service/signup.service';
import { AuthInterceptorService } from './auth/Service/auth-interceptor.service';
import { NotifierModule } from 'angular-notifier';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
   return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    Erreur404ComponentComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
/*     DragAndCheckModule,
    NgxEchartsModule,
    ngfModule, */
/*     ArchwizardModule,
 */    BrowserAnimationsModule,
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
    })
  ],
  providers: [
    UserloggedService,
    AuthService,
    AuthGuardService,
    JwtHelperService,
    SignupService,
    GraphFlowerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  exports:[
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
