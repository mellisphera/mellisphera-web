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
import { AuthGuardService } from '../../auth/auth-guard.service';
import { Erreur404ComponentComponent } from '../../erreur404-component/erreur404-component.component';
import { HomeComponent } from './home.component';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { InfoApiaryComponent } from './info-apiary/info-apiary.component';

const routes: Routes = [
    {
        path: '', component: HomeComponent, children: [
            { path: 'info-hives', component: InfoHivesComponent, canActivate: [AuthGuardService]},
            { path: 'info-apiary', component: InfoApiaryComponent, canActivate: [AuthGuardService]}
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

export class HomeRoutingModule { }