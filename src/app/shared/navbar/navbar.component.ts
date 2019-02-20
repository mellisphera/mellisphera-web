import { CONFIG } from './../../../config';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { UserloggedService } from '../../userlogged.service';
import {Router} from '@angular/router';
import { AuthService } from '../../auth/Service/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { RucheService } from '../../accueil/Service/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { ObservationService } from '../../ruche-rucher/ruche-detail/observation/service/observation.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../accueil/Service/dailyRecordService';
import { Subscription } from 'rxjs';



@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls : ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{
    message : string;
    username : string;
    photoApiary: File ;
    private listTitles: any[];
    location: Location;
    file: File;
    httpEmitter:Subscription;
    hasBaseDropZoneOver: boolean = false;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public updateStatus : boolean;
    baseDropValid: string;
    public lastConnexion : string;
    public rucherForm : FormGroup;
    constructor(location: Location,  
        private element: ElementRef, 
        private userService: UserloggedService,
        private router: Router, 
        private authService: AuthService,
        public rucherService : RucherService,
        private rucheService : RucheService,
        private meteoService : MeteoService,
       /* private fleursFloraisonService : FleursFloraisonService,*/
        private observationService : ObservationService,
        private formBuilder : FormBuilder,
        private tokenService : AtokenStorageService,
        private dailyRecordService : DailyRecordService ) {
        try{
            this.lastConnexion = this.authService.lastConnection.toDateString();
        }
        catch(e){}  
      this.location = location;
      this.sidebarVisible = false;
        this.username = userService.getUser();

    }

    initForm(){
        this.rucherForm = this.formBuilder.group({
            'nom': [null, Validators.compose([Validators.required])],
            'description': [null],
            'ville': [null, Validators.compose([Validators.required])],
            'codePostal': [null, Validators.compose([Validators.required])],
            'validate' : ``,
          });
      }
    logout() {
        this.authService.isAuthenticated = false;
        this.tokenService.signOut();
        this.authService.connexionStatus.next(false);
        this.router.navigate(['/login']);
    }
    onPictureLoad(next) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.rucherService.rucher.photo = fileReader.result;
        };
        fileReader.onloadend = () => {
            next();
        };
        fileReader.readAsDataURL(this.photoApiary);
        console.log(this.rucherService.rucher);
    }

    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
      console.log(this.toggleButton);
      this.userService.currentMessage.subscribe(message => this.message = message);
      this.initForm();
    }
    onSelectRucher() {
        console.log(this.rucherService.rucher);
        this.rucheService.getRucheByApiary(this.username, this.rucherService.rucher);
        this.rucherService.getRucherDetails();
      //  this.fleursFloraisonService.getUserFleur(this.rucherService.rucher.id);
        this.meteoService.getWeather(this.rucherService.rucher.ville);
        this.observationService.getObservationByIdApiary(this.rucherService.rucher.id);
        this.rucheService.getRucheByApiary(this.username, this.rucherService.rucher.id);
        this.dailyRecordService.getDailyRecThByApiary(this.rucherService.rucher.id);
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
      }
      //Editer Rucher
    onEditerRucher() {
        const formValue = this.rucherForm.value;
        this.rucherService.detailsRucher.description = formValue.description;
        this.rucherService.detailsRucher.name = formValue.nom;
        this.rucherService.detailsRucher.ville = formValue.ville;
        this.rucherService.detailsRucher.codePostal = formValue.codePostal;
        console.log(this.rucherService.detailsRucher);
        this.initForm();
        this.rucherService.updateRucher();
    }

    //delete rucher
    deleteRucher(){
        this.rucherService.deleteRucher();
    }
  

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    }
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle() {
         const toggleButton = this.toggleButton;
         const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }
    editRucherClicked(){
        var donnée = {
          nom:this.rucherService.rucher.name,
          description: this.rucherService.rucher.description,
          ville: this.rucherService.rucher.ville,
          codePostal: this.rucherService.rucher.codePostal,
          validate : ''
        };
        this.rucherForm.setValue(donnée);
      }

    getTitle(){
      var title = this.location.prepareExternalUrl(this.location.path());
      title = title.split('/').pop();
      for ( let item = 0; item < this.listTitles.length; item++) {
          if (this.listTitles[item].path === title) {
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
  
    apiarySubmit() {
        const formValue = this.rucherForm.value;
        if (this.photoApiary == null) {
            this.rucherService.rucher.photo = CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png';
        }
        console.log(this.rucherService.rucher.photo);
        this.rucherService.rucher.id = null;
        this.rucherService.rucher.description = formValue.description;
        this.rucherService.rucher.name = formValue.nom;
        this.rucherService.rucher.ville = formValue.ville;
        this.rucherService.rucher.codePostal = formValue.codePostal;
        this.rucherService.rucher.createdAt = new Date();
        this.rucherService.rucher.username = this.username;
        console.log(this.rucherService.rucher);
        this.initForm();
        this.rucherService.createRucher();
        }
}
