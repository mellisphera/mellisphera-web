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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
  ],
  providers: [
    ConnectionService,
    KpisynclogService
  ],
  declarations: [
    AdminComponent,
    KpisynclogComponent
  ]
})
export class AdminModule { }
