import { ApiaryNotesComponent } from './dashboard/apiary/apiary-notes/apiary-notes.component';
import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { RucheRucherComponent } from './dashboard/apiary/ruche-rucher/ruche.rucher.component';
import { MeteoComponent } from './dashboard/meteo/meteo.component';

import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { CapteurComponent } from './dashboard/capteur/capteur.component';
import { RapportComponent } from './dashboard/rapport/rapport.component';
import { FleursFloraisonComponent } from './dashboard/fleurs-floraison/fleurs.floraison.component';
import { HomeComponent } from './dashboard/home/home.component';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { RucheDetailComponent } from './dashboard/apiary/ruche-rucher/ruche-detail/ruche.detail.component';
import { StackApiaryComponent } from './dashboard/apiary/stack-apiary/stack-apiary.component';

const routes: Routes = [
    { path: '',                 component: LoginComponent },
    { path: 'login',            component: LoginComponent },
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
