import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { Erreur404ComponentComponent } from '../../erreur404-component/erreur404-component.component';
import { HomeComponent } from './home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { NotesComponent } from './notes/notes.component';
import { StatesComponent } from './states/states.component';

const routes: Routes = [
    {
        path: '', component: HomeComponent, children: [
            { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuardService]},
            { path: 'info-hives', component: InfoHivesComponent, canActivate: [AuthGuardService]},
            { path: 'notes', component: NotesComponent, canActivate: [AuthGuardService]},
            { path: 'states', component: StatesComponent, canActivate: [AuthGuardService]}
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