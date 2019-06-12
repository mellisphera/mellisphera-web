import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { AdminComponent } from './admin.component';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { KpisynclogComponent } from './kpisynclog/kpisynclog.component';
import { GlobalStatusComponent } from './global-status/global-status.component';
import { SensorsManagerComponent } from './sensors-manager/sensors-manager.component';

const routes: Routes = [
    {
      path: '', component: AdminComponent, canActivate: [AuthGuardService], children: [
        { path: 'kpisynclog', component: KpisynclogComponent, canActivate: [AuthGuardService]},
        { path: 'status', component: GlobalStatusComponent, canActivate: [AuthGuardService]},
        { path: 'sensor-manager', component: SensorsManagerComponent, canActivate: [AuthGuardService]}
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
