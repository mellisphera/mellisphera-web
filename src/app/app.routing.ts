import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { RucheRucherComponent } from './apiary/ruche-rucher/ruche.rucher.component';
import { MeteoComponent } from './meteo/meteo.component';

import { LoginComponent } from './auth/login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { CapteurComponent } from './capteur/capteur.component';
import { RapportComponent } from './rapport/rapport.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { HomeComponent } from './accueil/home/home.component';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { RucheDetailComponent } from './apiary/ruche-rucher/ruche-detail/ruche.detail.component';

const routes: Routes = [
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
    { path: 'accueil',          canActivate : [AuthGuard], component: AccueilComponent},
    { path: 'ruche-et-rucher',  canActivate : [AuthGuard], component: RucheRucherComponent },
    { path: 'capteurs',         canActivate : [AuthGuard], component: CapteurComponent },
    { path: 'meteo',            canActivate : [AuthGuard], component: MeteoComponent },
    { path: 'ruche-detail', canActivate : [AuthGuard], component : RucheDetailComponent},
    { path: 'rapport',          canActivate : [AuthGuard], component: RapportComponent},
    { path: 'fleurs-floraison', canActivate : [AuthGuard], component: FleursFloraisonComponent },
    { path: 'home', canActivate : [AuthGuard], component: HomeComponent},
    { path: 'admin', canActivate : [AuthGuard], component : AdminComponent},
    { path : 'fstl', component : DemoComponent},
    { path: '**', component: Erreur404ComponentComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
