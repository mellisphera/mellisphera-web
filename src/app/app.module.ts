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
import { RapportService } from './dashboard/rapport/rapport.service';
import { FleursFloraisonService } from './dashboard/fleurs-floraison/service/fleurs.floraison.service';
import { RucheDetailService } from './dashboard/apiary/ruche-rucher/ruche-detail/ruche.detail.service';

import { DailyRecordService } from './dashboard/service/dailyRecordService';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { MeteoService } from './dashboard/meteo/Service/MeteoService';
import { RucheService } from './dashboard/service/ruche.service';

import { NgxEchartsModule } from 'ngx-echarts';
import { CalendrierService } from './dashboard/meteo/Service/calendrier.service';
import { GraphMeteoService } from './dashboard/meteo/Service/graph-meteo.service';
import { ObservationService } from './dashboard/apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from './dashboard/shared/shared.module';
import { PipeCapteur, SearchCapteur } from './dashboard/capteur/capteur.pipe';
import { SearchFleurPipe, searchFleurByType, searchFleurByDate } from './dashboard/fleurs-floraison/service/search-fleur.pipe';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { SignupService } from './admin/service/signup.service';
import { AuthInterceptorService } from './auth/Service/auth-interceptor.service';
import { ngfModule } from 'angular-file';
import { NotifierModule } from 'angular-notifier';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';
import { StackApiaryComponent } from './dashboard/apiary/stack-apiary/stack-apiary.component';
import { ApiaryNotesComponent } from './dashboard/apiary/apiary-notes/apiary-notes.component';
import { WizardComponent } from './dashboard/wizard/wizard.component';
import { ArchwizardModule } from 'angular-archwizard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedbackComponent } from './feedback/feedback.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
   return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    NouveauCapteurComponent,
    CapteurComponent,
    AppComponent,
    LoginComponent,
    RucheRucherComponent,
    MeteoComponent,
    RapportComponent,
    FleursFloraisonComponent,
    PipeCapteur,
    SearchCapteur,
    SearchFleurPipe,
    searchFleurByType,
    searchFleurByDate,
    AdminComponent,
    HomeComponent,
    Erreur404ComponentComponent,
    StackApiaryComponent,
    ApiaryNotesComponent,
    WizardComponent,
    FeedbackComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    FooterModule,
    SidebarModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragAndCheckModule,
    NgxEchartsModule,
    ngfModule,
    SharedModule,
    ArchwizardModule,
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
    })
  ],
  providers: [
    CapteurService,
    UserloggedService,
    AuthService,
    AuthGuardService,
    JwtHelperService,
    RucherService,
    RapportService,
    FleursFloraisonService,
    RucheDetailService,
    MeteoService,
    DailyRecordService,
    RucheService,
    CalendrierService,
    GraphMeteoService,
    ObservationService,
    SignupService,
    GraphStackService,
    ConnectionsMapService,
    ConnectionService,
    CalendrierFSTLervice,
    GraphHoneyService,
    GraphFlowerService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  exports:[
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
