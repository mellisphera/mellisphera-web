import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DasboardRoutingModule } from './dashboard.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { ngfModule } from 'angular-file';
import { DragAndCheckModule } from 'ng2-drag-and-check';
import { WizardComponent } from './wizard/wizard.component';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RucherService } from './apiary/ruche-rucher/rucher.service';
import { RucheService } from './service/ruche.service';
import { MeteoService } from './meteo/Service/MeteoService';
import { DailyRecordService } from './service/dailyRecordService';
import { FleursFloraisonService } from './fleurs-floraison/service/fleurs.floraison.service';
import { CapteurService } from './capteur/capteur.service';
import { RucheRucherComponent } from './apiary/ruche-rucher/ruche.rucher.component';
import { MeteoComponent } from './meteo/meteo.component';
import { StackApiaryComponent } from './apiary/stack-apiary/stack-apiary.component';
import { ApiaryNotesComponent } from './apiary/apiary-notes/apiary-notes.component';
import { RapportComponent } from './rapport/rapport.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { CapteurComponent } from './capteur/capteur.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SearchCapteur } from './capteur/capteur.pipe';
import { PipeCapteur } from './capteur/capteur.pipe';
import { SearchFleurPipe, searchFleurByDate, searchFleurByType } from './fleurs-floraison/service/search-fleur.pipe';
import { RapportService } from './rapport/rapport.service';
import { DialogApiaryComponent } from './shared/navbar/dialog-apiary/dialog-apiary.component';
import { MatDialogModule } from '@angular/material';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    DasboardRoutingModule,
    NavbarModule,
    SidebarModule,
    MaterialModule,
    RouterModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ngfModule,
    DragAndCheckModule,
    NgxEchartsModule,
    ArchwizardModule,
    SharedModule,
  ],
  providers: [
    RucherService,
    MeteoService,
    RucheService,
    RapportService,
    DailyRecordService,
    FleursFloraisonService,
    CapteurService
  ],
  declarations: [
    DashboardComponent,
    HomeComponent,
    RucheRucherComponent,
    FeedbackComponent,
    MeteoComponent,
    PipeCapteur,
    SearchCapteur,
    SearchFleurPipe,
    searchFleurByDate,
    searchFleurByType,
    CapteurComponent,
    StackApiaryComponent,
    RapportComponent,
    ApiaryNotesComponent,
    FleursFloraisonComponent,
    WizardComponent
  ],
  entryComponents: [
    DialogApiaryComponent
  ]
})
export class DashboardModule { }
