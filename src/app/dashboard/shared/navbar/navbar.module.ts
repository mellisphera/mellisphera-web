/* import { ConfirmationPopoverModule } from 'angular-confirmation-popover'; */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule } from 'angular-file';
import { DragAndCheckModule } from 'ng2-drag-and-check';
import { DialogApiaryComponent } from './dialog-apiary/dialog-apiary.component';
import { MatDialogModule } from '@angular/material';
import { MaterialModule } from '../../../material.module';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

@NgModule({
    imports: [
        RouterModule,
       // BrowserModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule,
        FormsModule,
        ngfModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })
    ],
    declarations: [ NavbarComponent, DialogApiaryComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
