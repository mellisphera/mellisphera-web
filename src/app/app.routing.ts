import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RucheRucherComponent } from './accueil/ruche-rucher/ruche.rucher.component';
import { MeteoComponent } from './accueil/meteo/meteo.component';

import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { CapteurComponent } from './accueil/capteur/capteur.component';
import { RapportComponent } from './accueil/rapport/rapport.component';
import { FleursFloraisonComponent } from './accueil/fleurs-floraison/fleurs.floraison.component';
import { DispositionRucheComponent } from './accueil/disposition-ruche/disposition-ruche.component';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { RucheDetailComponent } from './accueil/ruche-rucher/ruche-detail/ruche.detail.component';

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
    { path: 'dashboard',        component: HomeComponent },
    { path: 'accueil',          canActivate : [AuthGuard], component: AccueilComponent},
    { path: 'ruche-et-rucher',  canActivate : [AuthGuard], component: RucheRucherComponent },
    { path: 'capteurs',         canActivate : [AuthGuard], component: CapteurComponent },
    { path: 'meteo',            canActivate : [AuthGuard], component: MeteoComponent },
    { path: 'ruche-detail/:id/:name', canActivate : [AuthGuard], component : RucheDetailComponent},
    { path: 'rapport',          canActivate : [AuthGuard], component: RapportComponent},
    { path: 'fleurs-floraison', canActivate : [AuthGuard], component: FleursFloraisonComponent },
    { path: 'position-Ruche', canActivate : [AuthGuard], component: DispositionRucheComponent},
    { path: 'admin', canActivate : [AuthGuard], component : AdminComponent},
    { path : 'demo', component : DemoComponent}
    
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
