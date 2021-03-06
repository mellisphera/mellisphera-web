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
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate, UrlSegment } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { Erreur404ComponentComponent } from './erreur404-component/erreur404-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export function urlLogin(url: UrlSegment[]) {
  console.log(url[0]);
  return {consumed: url};
}


const routes: Routes = [

  { path: '', loadChildren: './auth-bm/auth-bm.module#AuthBmModule'},
  { path: 'login', loadChildren: './auth-bm/auth-bm.module#AuthBmModule'},
/*   { matcher: urlLogin , loadChildren: './auth-bm/auth-bm.module#AuthBmModule'},
 */
  {
    path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuardService], canLoad: [AuthGuardService]
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },

  { path: 'home', redirectTo: '', pathMatch: 'full',  },
  { path: '**', component: Erreur404ComponentComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
