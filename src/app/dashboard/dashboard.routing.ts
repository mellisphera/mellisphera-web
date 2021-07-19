import { InspectComponent } from './inspect/inspect.component';
/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { MelliChartsComponent } from './melli-charts/melli-charts.component';
import { Erreur404ComponentComponent } from '../erreur404-component/erreur404-component.component';
import { PreferenceConfigComponent } from './preference-config/preference-config.component';
import { ManageHivesComponent } from './manage/manage-hives/manage-hives.component';
import { ManageApiarysComponent } from './manage/manage-apiarys/manage-apiarys.component';
import { ManageSensorsComponent } from './manage/manage-sensors/manage-sensors.component';
import { ManageNotesComponent } from './manage/manage-notes/manage-notes.component';
import { AlertConfigurationComponent } from './alert-configuration/alert-configuration.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            { path: 'home', loadChildren : './home/home.module#HomeModule', canLoad: [AuthGuardService]},
            { path: 'admin', loadChildren : './admin/admin.module#AdminModule', canLoad: [AuthGuardService]},
            //{ path: 'stack-apiary', component: StackApiaryComponent, canActivate: [AuthGuardService]},
            { path: 'preferences', component: PreferenceConfigComponent, canActivate: [AuthGuardService]},
            { path: 'explore', loadChildren: './melli-charts/melli-charts.module#MelliChartsModule', canLoad: [AuthGuardService]},
            { path: 'inspect', loadChildren: './inspect/inspect.module#InspectModule', canLoad: [AuthGuardService]},
            { path: 'weather', loadChildren: './weather/weather.module#WeatherModule', canLoad: [AuthGuardService]},
            { path: 'manage-hives', component: ManageHivesComponent, canActivate: [AuthGuardService]},
            { path: 'manage-apiarys', component: ManageApiarysComponent, canActivate: [AuthGuardService]},
            { path: 'manage-notes', component: ManageNotesComponent, canActivate: [AuthGuardService]},
            { path: 'manage-sensors', component: ManageSensorsComponent, canActivate: [AuthGuardService]},
            { path: 'alert-configuration', canLoad: [AuthGuardService], canActivate: [AuthGuardService], loadChildren: './alert-configuration/alert-configuration.module#AlertConfigurationModule'},
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
