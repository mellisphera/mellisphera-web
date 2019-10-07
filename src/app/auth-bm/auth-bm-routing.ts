import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { BmLoginComponent } from './bm-login/bm-login.component';


const routes: Routes = [
    {path : '', component: BmLoginComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class AuthBmRoutingModule { }
