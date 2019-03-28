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
import { AdminComponent } from '../admin/admin.component';
import { StackApiaryComponent } from './apiary/stack-apiary/stack-apiary.component';
import { ApiaryNotesComponent } from './apiary/apiary-notes/apiary-notes.component';
import { CapteurComponent } from './capteur/capteur.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            { path: 'home', component: HomeComponent, canLoad: [AuthGuardService]},
            { path: 'ruche-et-rucher', component: RucheRucherComponent, canLoad: [AuthGuardService]},
            // { path: 'ruche-detail', loadChildren: './dashboard/dashboard.module#DashboardModule'},
            { path: 'rapport', component: RapportComponent, canLoad: [AuthGuardService]},
            { path: 'fleurs-floraison', component: FleursFloraisonComponent, canLoad: [AuthGuardService]},
            { path: 'home', component: HomeComponent, canLoad: [AuthGuardService]},
/*             { path: 'admin', component: AdminComponent, canLoad: [AuthGuardService]},*/
            { path: 'stack-apiary', component: StackApiaryComponent, canLoad: [AuthGuardService]},
            { path: 'capteurs', component: CapteurComponent, canLoad: [AuthGuardService]},
            { path: 'apiary-notes', component: ApiaryNotesComponent, canLoad: [AuthGuardService]}


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
    { path: '***REMOVED***', component : DemoComponent},
    { path: 'apiary-notes', canActivate: [AuthGuard], component : ApiaryNotesComponent},
*/