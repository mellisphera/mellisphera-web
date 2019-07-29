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
import { AlertsService } from './service/api/alerts.service';
import { FleursFloraisonService } from './fleurs-floraison/service/fleurs.floraison.service';
import { CapteurService } from './service/api/capteur.service';
import { StackApiaryComponent } from './apiary/stack-apiary/stack-apiary.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { SearchFleurPipe, searchFleurByDate, searchFleurByType } from './fleurs-floraison/service/search-fleur.pipe';
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
    // AngularDraggableModule,
    ngfModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
   //  DragAndCheckModule,
    ArchwizardModule,
  ],
  providers: [
    RucherService,
    RucheService,
    AlertsService,
    DailyRecordService,
    FleursFloraisonService,
    AdminService,
    UnitService,
    GraphGlobal,
    CapteurService,
    SidebarService,
    ObservationService,
    MyNotifierService,
    MessagesService,
    UserParamsService
  ],
  declarations: [
    DashboardComponent,
    FeedbackComponent,
    SearchFleurPipe,
    searchFleurByDate,
    searchFleurByType,
    StackApiaryComponent,
    FleursFloraisonComponent,
    WizardComponent,
    PreferenceConfigComponent,
    ManageHivesComponent,
    ManageApiarysComponent,
    ManageSensorsComponent,
  ]
})
export class DashboardModule { }
