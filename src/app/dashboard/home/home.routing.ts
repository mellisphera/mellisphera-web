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