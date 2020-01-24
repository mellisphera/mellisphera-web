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
import { SidebarModule } from '../sidebar/sidebar.module';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MyDatePipe } from '../../pipe/my-date.pipe';
import { SearchCapteur } from '../../pipe/capteur.pipe';
import { PipeCapteur } from '../../pipe/capteur.pipe';
import { PipeObservation } from '../../pipe/observation.pipe';
import { ngfModule } from 'angular-file';
import {PopoverModule} from "ngx-smart-popover";




@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    RouterModule,
    // BrowserModule,
    FormsModule,
  ],
  exports: [
    TranslateModule,
    NgxEchartsModule,
    PipeCapteur,
    PipeObservation,
    PopoverModule,
    MyDatePipe,
    SearchCapteur,
  ],
  declarations: [
    MyDatePipe,
    PipeCapteur,
    PipeObservation,
    SearchCapteur

  ],
  providers: [
  ]
})
export class SharedModule { }
