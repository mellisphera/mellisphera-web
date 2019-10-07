import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmLoginComponent } from './bm-login/bm-login.component';
import { AuthBmRoutingModule } from './auth-bm-routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BmLoginComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AuthBmRoutingModule
  ]
})
export class AuthBmModule { }
