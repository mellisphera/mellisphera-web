import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { RucheRucherComponent } from './apiary/ruche-rucher/ruche.rucher.component';
import { RapportComponent } from './rapport/rapport.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { MeteoComponent } from './meteo/meteo.component';
import { AdminComponent } from './admin/admin.component';
import { StackApiaryComponent } from './apiary/stack-apiary/stack-apiary.component';
import { ApiaryNotesComponent } from './apiary/apiary-notes/apiary-notes.component';
import { CapteurComponent } from './capteur/capteur.component';
import { MelliChartsComponent } from './melli-charts/melli-charts.component';
import { Erreur404ComponentComponent } from '../erreur404-component/erreur404-component.component';
import { PreferenceConfigComponent } from './preference-config/preference-config.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
            { path: 'ruche-et-rucher', component: RucheRucherComponent, canActivate: [AuthGuardService]},
            { path: 'ruche-detail', loadChildren: './apiary/ruche-rucher/ruche-detail/ruche.module#RucheModule'},
            { path: 'rapport', component: RapportComponent, canActivate: [AuthGuardService]},
            { path: 'fleurs-floraison', component: FleursFloraisonComponent, canLoad: [AuthGuardService]},
            { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
            { path: 'admin', loadChildren : './admin/admin.module#AdminModule', canLoad: [AuthGuardService]},
            { path: 'stack-apiary', component: StackApiaryComponent, canActivate: [AuthGuardService]},
            { path: 'capteurs', component: CapteurComponent},
            { path: 'apiary-notes', component: ApiaryNotesComponent, canActivate: [AuthGuardService]},
            { path: 'melli-charts', component: MelliChartsComponent, canActivate: [AuthGuardService]},
            { path: 'preferences', component: PreferenceConfigComponent, canActivate: [AuthGuardService]}


        ]
    }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class DasboardRoutingModule { }

/*
    { path: 'ruche-et-rucher',  canActivate : [AuthGuard], component: RucheRucherComponent },
    { path: 'capteurs',         canActivate : [AuthGuard], component: CapteurComponent },
    { path: 'meteo',            canActivate : [AuthGuard], component: MeteoComponent },
    { path: 'ruche-detail', canActivate : [AuthGuard], component : RucheDetailComponent},
    { path: 'rapport',          canActivate : [AuthGuard], component: RapportComponent},
    { path: 'fleurs-floraison', canActivate : [AuthGuard], component: FleursFloraisonComponent },
    { path: 'home', canActivate : [AuthGuard], component: HomeComponent},
    { path: 'admin', canActivate : [AuthGuard], component : AdminComponent},
    { path: 'stack-apiary', canActivate : [AuthGuard], component : StackApiaryComponent},
    { path: 'fstl', component : DemoComponent},
    { path: 'apiary-notes', canActivate: [AuthGuard], component : ApiaryNotesComponent},
*/