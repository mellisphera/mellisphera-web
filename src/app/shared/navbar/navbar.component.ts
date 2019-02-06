import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { UserloggedService } from '../../userlogged.service';
import {Router} from "@angular/router";
import { AuthService } from '../../auth/Service/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RucherService } from '../../accueil/ruche-rucher/rucher.service';
import { RucheService } from '../../accueil/Service/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { ObservationService } from '../../accueil/ruche-rucher/ruche-detail/observation/service/observation.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../accueil/Service/dailyRecordService';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls : ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{
    message : string;
    username : string;
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;eza
    public lastConnexion : string;
    public rucherForm : FormGroup;
    constructor(location: Location,  
        private element: ElementRef, 
        private data : UserloggedService,
        private router: Router, 
        private authService : AuthService,
        public rucherService : RucherService,
        private rucheService : RucheService,
        private meteoService : MeteoService,
        private fleursFloraisonService : FleursFloraisonService,
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
        this.username= data.currentUser().username;

    }

    initForm(){
        this.rucherForm=this.formBuilder.group({
            'nom': [null,Validators.compose([Validators.required])],
            'description': [null],
            'ville': [null,Validators.compose([Validators.required])],
            'codePostal': [null,Validators.compose([Validators.required])],
            'validate' : ``
          })
      }
    logout(){
        this.authService.isAuthenticated = false;
        this.tokenService.signOut();
        this.authService.connexionStatus.next(false);
        this.router.navigate(['/login']);
    }

    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
      this.data.currentMessage.subscribe(message=>this.message=message);
      this.initForm();
    }
    onSelectRucher(){
        this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher);
        //console.log(this.rucheService.ruches);
        //ruchesObs
        this.rucherService.getRucherDetails();
        this.fleursFloraisonService.getUserFleur(this.rucherService.rucher.id);
        this.meteoService.getWeather(this.rucherService.rucher.ville);
        this.observationService.getObservationByIdApiary(this.rucherService.rucher.id);
        this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id);
        this.dailyRecordService.getDailyRecThByApiary(this.rucherService.rucher.id);
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
      }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
         const toggleButton = this.toggleButton;
         const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.split('/').pop();
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
  
    createRucher(){
        const formValue = this.rucherForm.value;
        this.rucherService.rucher = {
          id : null,
          latitude: '',
          longitude: '',
          name: '',
          description : '',
          createdAt : null,
          urlPhoto : '',
          username : '',
          codePostal : '',
          ville : ''
       };
        this.rucherService.rucher.id=null;
        this.rucherService.rucher.description = formValue.description;
        this.rucherService.rucher.name = formValue.nom;
        this.rucherService.rucher.ville = formValue.ville;
        this.rucherService.rucher.codePostal = formValue.codePostal;
        this.rucherService.rucher.createdAt = new Date();
        this.rucherService.rucher.urlPhoto = "void";
        this.rucherService.rucher.username = this.username;
        this.initForm();
        this.rucherService.createRucher();
      } 
      
}
