import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { TestComponent } from './test/test.component';
import { RucheRucherComponent } from './accueil/ruche-rucher/ruche.rucher.component';
import { MeteoComponent } from './accueil/meteo/meteo.component';

import { TablesComponent } from './tables/tables.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { CapteurComponent } from './accueil/capteur/capteur.component';
import { GraphComponent } from './accueil/graph/graph.component';
import { NouveauCapteurComponent } from './accueil/capteur/nouveau-capteur/nouveau-capteur.component';
import { RucheDetailComponent } from './accueil/ruche-rucher/ruche-detail/ruche.detail.component';
import { RapportComponent } from './accueil/rapport/rapport.component';
import { FleursFloraisonComponent } from './accueil/fleurs-floraison/fleurs.floraison.component';

const routes: Routes =[
   /* { path: '',             component: LoginComponent },  
    { path: 'login',          component: LoginComponent },
    { path: 'dashboard',      component: HomeComponent },
  //{ path: 'dashboard',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TablesComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }*/
    { path: '',                 component: LoginComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'test',             component: TestComponent },
    { path: 'dashboard',        component: HomeComponent },
    { path: 'accueil',          component: AccueilComponent },
    { path: 'ruche-et-rucher',  component: RucheRucherComponent },
    { path: 'capteurs',         component: CapteurComponent },
    { path: 'meteo',            component: MeteoComponent },
    { path: 'graphiques',       component: GraphComponent },
    { path: 'ruche-detail',     component: RucheDetailComponent},
    { path: 'rapport',          component: RapportComponent},
    { path: 'fleurs-floraison', component: FleursFloraisonComponent }
    
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
