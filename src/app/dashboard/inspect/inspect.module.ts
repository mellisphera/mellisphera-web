import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime/date-time';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { UserParamsService } from '../preference-config/service/user-params.service';
import { RucheService } from '../service/api/ruche.service';
import { RucherService } from '../service/api/rucher.service';
import { UnitService } from '../service/unit.service';
import { InspectHistoryComponent } from './inspect-history/inspect-history.component';
import { InspectNewComponent } from './inspect-new/inspect-new.component';
import { InspectParamsComponent } from './inspect-params/inspect-params.component';
import { InspectComponent } from './inspect.component';
import { InspectRouting } from './inspect.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    InspectRouting
  ],
  providers: [
    RucherService,
    RucheService,
    UnitService,
    AuthGuardService,
    UserParamsService,
  ],
  declarations: [
    InspectComponent,
    InspectNewComponent,
    InspectHistoryComponent,
    InspectParamsComponent,
  ]
})
export class InspectModule { }
