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

import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ExploreComponent } from "./explore.component";
import { NgModule } from "@angular/core";
import { HiveComponent } from "./hive/hive.component";
import { AuthGuardService } from "../../auth/auth-guard.service";
import { MapComponent } from "./map/map.component";
import { BroodComponent } from "./brood/brood.component";
import { StackComponent } from "./stack/stack.component";
import { WeightComponent } from './weight/weight.component';
import { EventsComponent } from "./events/events.component";

const routes: Routes = [
    {
        path: '', component: ExploreComponent, children: [
            { path: 'hive', component: HiveComponent, canActivate: [AuthGuardService]},
            { path: 'map', component: MapComponent, canActivate: [AuthGuardService]},
            { path: 'brood', component: BroodComponent, canActivate: [AuthGuardService]},
            { path: 'stack', component: StackComponent, canActivate: [AuthGuardService]},
            { path: 'weight', component: WeightComponent, canActivate: [AuthGuardService]},
            { path: 'events', component: EventsComponent, canActivate: [AuthGuardService]},
            { path: '', redirectTo: 'hive', pathMatch: 'full', canActivate: [AuthGuardService]}
            //{ path: '', redirectTo: 'hive', pathMatch: 'full', canActivate: [AuthGuardService]}
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
export class MelliChartsRouting { }
