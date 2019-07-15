import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RucheDetailComponent } from '../apiary/ruche-rucher/ruche-detail/ruche.detail.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { NavbarModule } from './navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MyDatePipe } from '../../pipe/my-date.pipe';
import { ngfModule } from 'angular-file';


@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    NavbarModule,
    RouterModule,
    // BrowserModule,
    FormsModule,
  ],
  exports: [
    TranslateModule,
    NgxEchartsModule,
    MyDatePipe,
  ],
  declarations: [
    MyDatePipe

  ],
  providers: [
  ]
})
export class SharedModule { }
