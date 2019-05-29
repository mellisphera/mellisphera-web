/* import { ConfirmationPopoverModule } from 'angular-confirmation-popover'; */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule } from 'angular-file';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared.module';


@NgModule({
    imports: [
        RouterModule,
       // BrowserModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        ngfModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })
    ],
    providers: [],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
