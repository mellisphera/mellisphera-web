import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { AdminComponent } from './admin.component';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { KpisynclogComponent } from './kpisynclog/kpisynclog.component';

const routes: Routes = [
    {
      path: '', component: AdminComponent, canActivate: [AuthGuardService], children: [
        { path: 'kpisynclog', component: KpisynclogComponent, canActivate: [AuthGuardService]}
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
