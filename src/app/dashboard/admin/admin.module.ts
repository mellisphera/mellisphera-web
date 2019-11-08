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
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ConnectionService } from './service/connection.service';
import { ConnectionsMapService } from './service/connections-map.service';
import { AdminRoutingModule } from './admin.routing';
import { KpisynclogComponent } from './kpisynclog/kpisynclog.component';
import { RouterModule } from '@angular/router';
import { KpisynclogService } from './service/kpisynclog.service';
import { GlobalStatusComponent } from './global-status/global-status.component';
import { SensorsManagerComponent } from './sensors-manager/sensors-manager.component';
import { DemoApiaryComponent } from './demo-apiary/demo-apiary.component';
import { UserComponent } from './user/user.component';
import { AdminService } from './service/admin.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    //    AngularDraggableModule,
    AdminRoutingModule,
    SharedModule,
  ],
  providers: [
    ConnectionService,
    AdminService,
    KpisynclogService
  ],
  declarations: [
    AdminComponent,
    KpisynclogComponent,
    UserComponent,
    GlobalStatusComponent,
    SensorsManagerComponent,
    DemoApiaryComponent,
    UserComponent
  ]
})
export class AdminModule { }
