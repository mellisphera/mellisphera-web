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
import { HomeComponent } from './accueil/home/home.component';

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
import { SearchFleurPipe, searchFleurByType,searchFleurByDate } from './fleurs-floraison/service/search-fleur.pipe';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { SignupService } from './admin/service/signup.service';
import { AuthInterceptorService } from './auth/Service/auth-interceptor.service';

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
    HomeComponent,
    PipeCapteur,
    SearchCapteur,
    SearchFleurPipe,
    searchFleurByType,
    searchFleurByDate,
    DemoComponent,
    AdminComponent
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
    SharedModule
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  exports:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
