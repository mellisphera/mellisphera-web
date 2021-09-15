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
import { DashboardComponent } from './dashboard.component';
import { DasboardRoutingModule } from './dashboard.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { ngfModule } from 'angular-file';
import { WizardComponent } from './wizard/wizard.component';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapteurService } from './service/api/capteur.service';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SidebarService } from './service/sidebar.service';
import { AdminService } from './admin/service/admin.service';
import { UserParamsService } from './preference-config/service/user-params.service';
import { PreferenceConfigComponent } from './preference-config/preference-config.component';
import { MelliChartsComponent } from './melli-charts/melli-charts.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { UnitService } from './service/unit.service';
import { GraphGlobal } from './graph-echarts/GlobalGraph';
import { AngularDraggableModule } from 'angular2-draggable';
import { ObservationService } from './service/api/observation.service';
import { MyNotifierService } from './service/my-notifier.service';
import { MessagesService } from './service/messages.service';
import { MyDatePipe } from '../pipe/my-date.pipe';
// import { AngularDraggableModule } from 'angular2-draggable';
import { ManageHivesComponent } from './manage/manage-hives/manage-hives.component';
import { ManageApiarysComponent } from './manage/manage-apiarys/manage-apiarys.component';
import { ManageSensorsComponent } from './manage/manage-sensors/manage-sensors.component';
import { RucherService } from './service/api/rucher.service';
import { RucheService } from './service/api/ruche.service';
import { DailyRecordService } from './service/api/dailyRecordService';
import { ManageNotesComponent } from './manage/manage-notes/manage-notes.component';


import { SocketService } from './service/socket.service';
import { AlertConfigurationComponent } from './alert-configuration/alert-configuration.component';
import { AlertsService } from './service/api/alerts.service';
import { AuthGuardService } from '../auth/auth-guard.service';
import { AuthInterceptorService } from '../auth/Service/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FeedbackComponent } from '../feedback/feedback.component';
import { InspectComponent } from './inspect/inspect.component';
import { MatStepperModule } from '@angular/material/stepper';
import { InspectNewComponent } from './inspect/inspect-new/inspect-new.component';
import { InspectHistoryComponent } from './inspect/inspect-history/inspect-history.component';
import { InspectParamsComponent } from './inspect/inspect-params/inspect-params.component';


import { HomeModule } from './home/home.module';
import { MelliChartsModule } from './melli-charts/melli-charts.module';
import { WeatherComponent } from './weather/weather.component';
import { FooterComponent } from './shared/footer/footer.component';


@NgModule({
  imports: [
    CommonModule,
    DasboardRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NavbarModule,
    SidebarModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatStepperModule,
    // AngularDraggableModule,
    ngfModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
   //  DragAndCheckModule,
    ArchwizardModule,
    HomeModule,
    MelliChartsModule,
  ],
  providers: [
    RucherService,
    AlertsService,
    RucheService,
    DailyRecordService,
    AdminService,
    UnitService,
    GraphGlobal,
    AlertsService,
    SocketService,
    CapteurService,
    SidebarService,
    ObservationService,
    MyNotifierService,
    AuthGuardService,
    MessagesService,
    UserParamsService,
    //{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  declarations: [
    DashboardComponent,
    WizardComponent,
    PreferenceConfigComponent,
    ManageHivesComponent,
    ManageApiarysComponent,
    FeedbackComponent,
    FooterComponent,
    ManageSensorsComponent,
    ManageNotesComponent,
  ]
})
export class DashboardModule { }
