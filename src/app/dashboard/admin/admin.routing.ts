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
import { AdminComponent } from './admin.component';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { KpisynclogComponent } from './kpisynclog/kpisynclog.component';
import { GlobalStatusComponent } from './global-status/global-status.component';
import { SensorsManagerComponent } from './sensors-manager/sensors-manager.component';
import { DemoApiaryComponent } from './demo-apiary/demo-apiary.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
    {
      path: '', component: AdminComponent, canActivate: [AuthGuardService], children: [
        { path: '', redirectTo: 'user', pathMatch: 'full', canActivate: [AuthGuardService]},
        { path: 'kpisynclog', component: KpisynclogComponent, canActivate: [AuthGuardService]},
        { path: 'status', component: GlobalStatusComponent, canActivate: [AuthGuardService]},
        { path: 'sensor-manager', component: SensorsManagerComponent, canActivate: [AuthGuardService]},
        { path: 'user', component: UserComponent, canActivate: [AuthGuardService]},
        { path: 'demo-apiary', component: DemoApiaryComponent, canActivate: [AuthGuardService]}
      ]
    }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class AdminRoutingModule { }
