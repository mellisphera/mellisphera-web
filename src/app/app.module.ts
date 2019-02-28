import { GraphFlowerService } from './demo/graph/graph-flower.service';
import { GraphHoneyService } from './demo/graph/graph-honey.service';
import { CalendrierFSTLervice } from './demo/graph/calendrierFSTL';
import { HomeComponent } from './accueil/home/home.component';
import { ConnectionService } from './admin/service/connection.service';
import { ConnectionsMapService } from './admin/service/connections-map.service';
import { GraphStackService } from './ruche-rucher/ruche-detail/stack/service/graph-stack.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AppComponent } from './app.component';
import { MeteoComponent } from './meteo/meteo.component';
import { RucheRucherComponent } from './ruche-rucher/ruche.rucher.component';
import { CapteurComponent } from './capteur/capteur.component';
import { NouveauCapteurComponent } from './capteur/nouveau-capteur/nouveau-capteur.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';

import { LoginComponent } from './auth/login/login.component';
import { ControldashboardComponent } from './controldashboard/controldashboard.component';
import { AccueilComponent } from './accueil/accueil.component';
import { RapportComponent } from './rapport/rapport.component';

import { ReactiveFormsModule } from '@angular/forms';

import { CapteurService } from './capteur/capteur.service';
import { RucherService } from './ruche-rucher/rucher.service';
import { UserloggedService } from './userlogged.service';
import { selectedRucherService } from './accueil/_shared-services/selected-rucher.service';
import { AuthService } from './auth/Service/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RapportService } from './rapport/rapport.service';
import { FleursFloraisonService } from './fleurs-floraison/service/fleurs.floraison.service';
import { RucheDetailService } from './ruche-rucher/ruche-detail/ruche.detail.service';

import { DailyRecordService } from './accueil/Service/dailyRecordService';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { MeteoService } from './meteo/Service/MeteoService';
import { RucheService } from './accueil/Service/ruche.service';

import { NgxEchartsModule } from 'ngx-echarts';
import { CalendrierService } from './meteo/Service/calendrier.service';
import { GraphMeteoService } from './meteo/Service/graph-meteo.service';
import { ObservationService } from './ruche-rucher/ruche-detail/observation/service/observation.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { PipeCapteur, SearchCapteur } from './capteur/capteur.pipe';
import { SearchFleurPipe, searchFleurByType, searchFleurByDate } from './fleurs-floraison/service/search-fleur.pipe';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { SignupService } from './admin/service/signup.service';
import { AuthInterceptorService } from './auth/Service/auth-interceptor.service';
import { ngfModule } from 'angular-file';
import { NotifierModule } from 'angular-notifier';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';




@NgModule({
  declarations: [
    NouveauCapteurComponent,
    CapteurComponent,
    AppComponent,
    LoginComponent,
    ControldashboardComponent,
    AccueilComponent,
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
    selectedRucherService,
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
