import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { LbdModule } from './lbd/lbd.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MeteoComponent } from './accueil/meteo/meteo.component';
import { UserComponent } from './user/user.component';
import { RucheRucherComponent } from './accueil/ruche-rucher/ruche.rucher.component';
import { CapteurComponent } from './accueil/capteur/capteur.component';
import { NouveauCapteurComponent } from './accueil/capteur/nouveau-capteur/nouveau-capteur.component';
import { FleursFloraisonComponent } from './accueil/fleurs-floraison/fleurs.floraison.component';

import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { LoginComponent } from './login/login.component';
import { ControldashboardComponent } from './controldashboard/controldashboard.component';
import { AccueilComponent } from './accueil/accueil.component';
import { RapportComponent } from './accueil/rapport/rapport.component';

import { ReactiveFormsModule } from '@angular/forms';

import { CapteurService } from './accueil/capteur/capteur.service';
import { RucherService } from './accueil/ruche-rucher/rucher.service';
import { UserloggedService } from './userlogged.service';
import { selectedRucherService } from './accueil/_shared-services/selected-rucher.service';
import { AuthService } from './auth/Service/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RapportService } from './accueil/rapport/rapport.service';
import { FleursFloraisonService } from './accueil/fleurs-floraison/service/fleurs.floraison.service';
import { RucheDetailService } from './accueil/ruche-rucher/ruche-detail/ruche.detail.service';
import { DispositionRucheComponent } from './accueil/disposition-ruche/disposition-ruche.component';

import { DailyRecordService } from './accueil/disposition-ruche/Service/dailyRecordService';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { MeteoService } from './accueil/meteo/Service/MeteoService';
import { RucheService } from './accueil/disposition-ruche/Service/ruche.service';

import { NgxEchartsModule } from 'ngx-echarts';
import { CalendrierService } from './accueil/meteo/Service/calendrier.service';
import { GraphMeteoService } from './accueil/meteo/Service/graph-meteo.service';
import { ObservationService } from './accueil/ruche-rucher/ruche-detail/observation/service/observation.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { PipeCapteur, SearchCapteur } from './accueil/capteur/capteur.pipe';
import { SearchFleurPipe, searchFleurByType,searchFleurByDate } from './accueil/fleurs-floraison/service/search-fleur.pipe';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { SignupService } from './admin/service/signup.service';
import { AuthInterceptorService } from './auth/Service/auth-interceptor.service';

@NgModule({
  declarations: [
    NouveauCapteurComponent,
    CapteurComponent,
    AppComponent,
    HomeComponent,
    UserComponent,
    IconsComponent,
    NotificationsComponent,
    LoginComponent,
    //ashboardComponent,
    ControldashboardComponent,
    AccueilComponent,
    RucheRucherComponent,
    MeteoComponent,
    RapportComponent,
    FleursFloraisonComponent,
    DispositionRucheComponent,
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
    LbdModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragAndCheckModule,
    NgxEchartsModule,
    SharedModule,
    
    
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
    AuthInterceptorService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  exports:[
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
