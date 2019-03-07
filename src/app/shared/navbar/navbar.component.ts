import { RucherModel } from './../../_model/rucher-model';
import { CONFIG } from './../../../config';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { UserloggedService } from '../../userlogged.service';
import {Router} from '@angular/router';
import { AuthService } from '../../auth/Service/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RucherService } from '../../apiary/ruche-rucher/rucher.service';
import { RucheService } from '../../accueil/Service/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { ObservationService } from '../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { AtokenStorageService } from '../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../accueil/Service/dailyRecordService';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';



@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls : ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{
    message: string;
    username: string;

    photoApiary: File ;
    private listTitles: any[];

    private apiaryUpdate: RucherModel;
    private indexApiaryUpdate: number;

    location: Location;
    file: File;
    hasBaseDropZoneOver: Boolean = false;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public updateStatus: boolean;
    public newApiary: RucherModel;
    baseDropValid: string;
    public lastConnexion: string;
    private readonly notifier: NotifierService;
    public rucherForm: FormGroup;
    constructor(location: Location,
        private element: ElementRef,
        private userService: UserloggedService,
        private router: Router,
        private authService: AuthService,
        public rucherService: RucherService,
        private rucheService: RucheService,
        private meteoService: MeteoService,
        private fleursFloraisonService : FleursFloraisonService,
        private observationService : ObservationService,
        private formBuilder: FormBuilder,
        private tokenService: AtokenStorageService,
        private dailyRecordService: DailyRecordService,
        public notifierService: NotifierService) {
      this.location = location;
      this.notifier = this.notifierService;
      this.sidebarVisible = false;
        this.username = userService.getUser();
        this.initForm();
        this.newApiary = {
            id : null,
            latitude: '',
            longitude: '',
            name: '',
            description : '',
            createdAt : null,
            photo : 'void',
            username : '',
            codePostal : '',
            ville : ''
         };

    }

    initForm() {
        this.rucherForm = this.formBuilder.group({
            'name': [null, Validators.compose([Validators.required])],
            'description': [null],
            'ville': [null, Validators.compose([Validators.required])],
            'codePostal': [null, Validators.compose([Validators.required])],
            'validate' : ``,
          });
    }
    logout() {
        this.rucherService.rucherSubject.unsubscribe();
        this.rucheService.hiveSubject.unsubscribe();
        this.observationService.obsApiarySubject.unsubscribe();
        this.observationService.obsHiveSubject.unsubscribe();
        this.authService.isAuthenticated = false;
        this.tokenService.signOut();
        this.authService.connexionStatus.next(false);
        this.router.navigate(['/login']);
    }
    onPictureLoad(next) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.newApiary.photo = <string>fileReader.result;
        };
        fileReader.onloadend = () => {
            next();
        };
        fileReader.readAsDataURL(this.photoApiary);
    }

    ngOnInit() {
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
      console.log(this.toggleButton);
      this.userService.currentMessage.subscribe(message => this.message = message);
      this.initForm();
    }
    onSelectRucher() {
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
        const location = this.location['_platformStrategy']._platformLocation.location.pathname;
        console.log(location);
        switch (location) {
            case '/ruche-et-rucher':
                this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/home':
                this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/fleurs-floraison':
                this.fleursFloraisonService.getUserFleur(this.rucherService.getCurrentApiary());
                break;
            case '/meteo':
                this.meteoService.getWeather(this.rucherService.rucher.codePostal);
                break;
            case '/ruche-detail':
                this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/stack-apiary':
                this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/apiary-notes':
                this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
                break;
            default:
        }
      }
      //Editer Rucher
    onEditerRucher() {
        const formValue = this.rucherForm.value;
        const index = this.rucherService.ruchers.indexOf(this.rucherService.rucher);
        this.apiaryUpdate = formValue;
        this.apiaryUpdate.id = this.rucherService.rucher.id;
        this.apiaryUpdate.photo = this.rucherService.rucher.photo;
        this.apiaryUpdate.username = this.rucherService.rucher.username;
        console.log(this.apiaryUpdate);
        this.rucherService.updateRucher(this.rucherService.rucher.id, this.apiaryUpdate).subscribe(
            () => {}, () => {} , () => {
                this.rucherService.ruchers[index] = this.apiaryUpdate;
                this.rucherService.emitApiarySubject();
                this.rucherService.rucher = this.apiaryUpdate;
                this.notifier.notify('success', 'Updated Apiary');
                this.initForm();
            }
        );
    }

    //delete rucher
    deleteRucher() {
        this.rucherService.deleteRucher().subscribe( () => {}, () => {} , () => {
            const index = this.rucherService.ruchers.indexOf(this.rucherService.rucher);
            this.rucherService.ruchers.splice(index, 1);
            this.rucherService.emitApiarySubject();
            this.notifier.notify('success', 'Deleted Apaiary');
            console.log(this.rucherService.ruchers);
            if (this.rucherService.ruchers.length > 0) {
                this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
                this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
            }
            if (this.rucherService.ruchers.length < 1) {
                this.rucherService.initRucher();
            }
        });
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
    editRucherClicked() {
        const donnée = {
          name: this.rucherService.rucher.name,
          description: this.rucherService.rucher.description,
          ville: this.rucherService.rucher.ville,
          codePostal: this.rucherService.rucher.codePostal,
          validate : ''
        };
        this.rucherForm.setValue(donnée);
    }

    getTitle(){
      let title = this.location.prepareExternalUrl(this.location.path());
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
            this.newApiary.photo = CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png';
        }
        this.newApiary.id = null;
        this.newApiary.description = formValue.description;
        this.newApiary.name = formValue.name;
        this.newApiary.ville = formValue.ville;
        this.newApiary.codePostal = formValue.codePostal;
        this.newApiary.createdAt = new Date();
        this.newApiary.username = this.username;
        this.initForm();
        this.rucherService.createRucher(this.newApiary).subscribe( (apiary) => {
            if (this.rucherService.ruchers != null) {
                this.rucherService.ruchers.push(apiary);
            } else {
                this.rucherService.ruchers = new Array(apiary);
            }
        }, () => {}, () => {
            console.log(this.rucherService.ruchers);
            this.rucherService.emitApiarySubject();
            this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
            this.notifier.notify('success', 'Created Apiary');
            this.initForm();
        });
    }
}
