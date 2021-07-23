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
import { SharedModule } from '../shared/shared.module';

import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';
import { FilterPipe } from './inspect-new/filter.pipe';

const MY_CUSTOM_FORMATS = {
  fullPickerInput: UserParamsService.getUPref().timeFormat.split(' ')[0],
  parseInput: UserParamsService.getUPref().timeFormat.split(' ')[0],
  datePickerInput: UserParamsService.getUPref().timeFormat.split(' ')[0],
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    InspectRouting,
  ],
  providers: [
    RucherService,
    RucheService,
    UnitService,
    AuthGuardService,
    UserParamsService,
    FilterPipe,
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ],
  declarations: [
    InspectComponent,
    InspectNewComponent,
    InspectHistoryComponent,
    InspectParamsComponent,
    FilterPipe
  ]
})
export class InspectModule { }
