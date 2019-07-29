import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { MeteoComponent } from './meteo/meteo.component';
import { AdminComponent } from './admin/admin.component';
import { StackApiaryComponent } from './apiary/stack-apiary/stack-apiary.component';
import { MelliChartsComponent } from './melli-charts/melli-charts.component';
import { Erreur404ComponentComponent } from '../erreur404-component/erreur404-component.component';
import { PreferenceConfigComponent } from './preference-config/preference-config.component';
import { ManageHivesComponent } from './manage/manage-hives/manage-hives.component';
import { ManageApiarysComponent } from './manage/manage-apiarys/manage-apiarys.component';
import { ManageSensorsComponent } from './manage/manage-sensors/manage-sensors.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            { path: 'home', loadChildren : './home/home.module#HomeModule', canLoad: [AuthGuardService]},
            { path: 'fleurs-floraison', component: FleursFloraisonComponent, canLoad: [AuthGuardService]},
            { path: 'admin', loadChildren : './admin/admin.module#AdminModule', canLoad: [AuthGuardService]},
            { path: 'stack-apiary', component: StackApiaryComponent, canActivate: [AuthGuardService]},
            { path: 'preferences', component: PreferenceConfigComponent, canActivate: [AuthGuardService]},
            { path: 'melli-charts', loadChildren: './melli-charts/melli-charts.module#MelliChartsModule', canLoad: [AuthGuardService]},
            { path: 'manage-hives', component: ManageHivesComponent, canActivate: [AuthGuardService]},
            { path: 'manage-apiarys', component: ManageApiarysComponent, canActivate: [AuthGuardService]},
            { path: 'manage-sensors', component: ManageSensorsComponent, canActivate: [AuthGuardService]},
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