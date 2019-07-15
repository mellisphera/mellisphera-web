import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { StatesComponent } from './states/states.component';
import { AlertsComponent } from './alerts/alerts.component';
import { NotesComponent } from './notes/notes.component';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { ngfModule } from 'angular-file';
import { AngularDraggableModule } from 'angular2-draggable';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NotesHivesComponent } from './info-hives/notes-hives/notes-hives.component';
import { WeightHivesComponent } from './info-hives/weight-hives/weight-hives.component';
import { HealthHiveComponent } from './info-hives/health-hive/health-hive.component';
import { SensorsHiveComponent } from './info-hives/sensors-hive/sensors-hive.component';
import { AlertsHiveComponent } from './info-hives/alerts-hive/alerts-hive.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ngfModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularDraggableModule
  ],
  providers: [
  ],
  declarations: [
    HomeComponent,
    StatesComponent,
    AlertsComponent,
    NotesComponent,
    InfoHivesComponent,
    NotesHivesComponent,
    WeightHivesComponent,
    HealthHiveComponent,
    SensorsHiveComponent,
    AlertsHiveComponent
  ]
})
export class HomeModule { }