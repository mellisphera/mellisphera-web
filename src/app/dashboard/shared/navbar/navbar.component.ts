import { RucherModel } from '../../../_model/rucher-model';
import { CONFIG } from '../../../../constants/config';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserloggedService } from '../../../userlogged.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/Service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RucherService } from '../../service/rucher.service';
import { RucheService } from '../../service/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { ObservationService } from '../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../service/dailyRecordService';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { CapteurService } from '../../capteur/capteur.service';
import { ngf } from 'angular-file';
import { SidebarService } from '../../service/sidebar.service';
import { AdminService } from '../../admin/service/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { NOTIF } from '../../../../constants/notify';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    message: string;
    username: string;
    
    photoApiary: File;
    private listTitles: any[];

    private apiaryUpdate: RucherModel;
    private indexApiaryUpdate: number;

    location: Location;
    file: File;
    public editPhotoApiary: string;
    hasBaseDropZoneOver: Boolean = false;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public updateStatus: boolean;
    public newApiary: RucherModel;
    public colorSidebar: Array<any>;
    public currentColor: any;
    baseDropValid: string;
    public lastConnexion: string;
    private readonly notifier: NotifierService;
    public rucherForm: FormGroup;
    constructor(location: Location,
        private element: ElementRef,
        public userService: UserloggedService,
        private authService: AuthService,
        public rucherService: RucherService,
        private adminService: AdminService,
        private rucheService: RucheService,
        private fleursFloraisonService: FleursFloraisonService,
        private observationService: ObservationService,
        private capteurService: CapteurService,
        private formBuilder: FormBuilder,
        public tokenService: AtokenStorageService,
        private dailyRecordService: DailyRecordService,
        public sidebarService: SidebarService,
        public notifierService: NotifierService,
        public translateService: TranslateService) {
        this.location = location;
        this.notifier = this.notifierService;
        this.sidebarVisible = false;
        this.username = userService.getUser();
        if(this.userService.getJwtReponse().country === "FR"){
            this.translateService.use("fr");
        }else{
            this.translateService.use("en");
        }
        this.initForm();
        this.editPhotoApiary = null;
        this.apiaryUpdate = this.newApiary = {
            id: null,
            latitude: '',
            longitude: '',
            name: '',
            idUsername : '',
            description: '',
            createdAt: null,
            photo: 'void',
            username: '',
            codePostal: '',
            ville: ''
        };


    }

    initForm() {
        this.rucherForm = this.formBuilder.group({
            'name': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
            'description': [null, Validators.compose([Validators.maxLength(40)])],
            'ville': [null, Validators.compose([Validators.required])],
            'codePostal': [null, Validators.compose([Validators.required])],
            'validate': ``,
        });
    }
    logout() {
        this.rucherService.rucherSubject.unsubscribe();
        this.rucheService.hiveSubject.unsubscribe();
        this.observationService.obsHiveSubject.unsubscribe();
        this.authService.isAuthenticated = false;
        this.capteurService.sensorSubject.unsubscribe();
        this.tokenService.signOut();
        // this.authService.connexionStatus.next(false);
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
        this.userService.currentMessage.subscribe(message => this.message = message);
        this.initForm();
    }
    onSelectRucher() {
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
        const location = this.location['_platformStrategy']._platformLocation.location.pathname;
        this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
        this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
        switch (location) {
            case '/dashboard/ruche-et-rucher':
                break;
            case '/dashboard/home':
                this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/dashboard/fleurs-floraison':
                this.fleursFloraisonService.getUserFleur(this.rucherService.getCurrentApiary());
                break;
            /*             case '/meteo':
                            this.meteoService.getWeather(this.rucherService.rucher.codePostal);
                            break; */
            case '/dashboard/ruche-detail':
                this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/dashboard/stack-apiary':
                // this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/dashboard/apiary-notes':
                this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
                break;
            default:
        }
    }
    //Editer Rucher
    onEditerRucher() {
        if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
            const formValue = this.rucherForm.value;
            const index = this.rucherService.ruchers.indexOf(this.rucherService.rucher);
            this.apiaryUpdate = formValue;
            this.apiaryUpdate.id = this.rucherService.rucher.id;
            if (this.photoApiary === null || this.photoApiary === undefined) {
                this.apiaryUpdate.photo = this.rucherService.rucher.photo
            } else {
                this.apiaryUpdate.photo = this.editPhotoApiary;
            }
            this.apiaryUpdate.username = this.rucherService.rucher.username;
            this.rucherService.updateRucher(this.rucherService.rucher.id, this.apiaryUpdate).subscribe(
                () => { }, () => { }, () => {
                    this.rucherService.ruchers[index] = this.apiaryUpdate;
                    this.rucherService.emitApiarySubject();
                    this.photoApiary = null;
                    this.editPhotoApiary = null;
                    this.rucherService.rucher = this.apiaryUpdate;
                    if(this.userService.getJwtReponse().country === "FR"){
                        this.notifier.notify('success', 'Rucher mis à jour');
                    }else{
                        this.notifier.notify('success', 'Updated Apiary');
                    }
                    this.initForm();
                }
            );
        } else {
        }
    }

    deleteRucher() {
        if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
            this.rucherService.deleteRucher().subscribe(() => { }, () => { }, () => {
                const index = this.rucherService.ruchers.indexOf(this.rucherService.rucher);
                this.rucherService.ruchers.splice(index, 1);
                this.rucherService.emitApiarySubject();
                if(this.userService.getJwtReponse().country === "FR"){
                    this.notifier.notify('success', 'Rucher supprimé');
                }else{
                    this.notifier.notify('success', 'Deleted Apaiary');
                }
                if (this.rucherService.ruchers.length > 0) {
                    this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
                    this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
                }
                if (this.rucherService.ruchers.length < 1) {
                    this.rucherService.initRucher();
                }
                this.rucheService.getRucheByApiary(this.rucherService.rucher.id);
            });
        }
    }


    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
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
            validate: ''
        };
        this.rucherForm.setValue(donnée);
    }

    setColor(color: any) {
        this.sidebarService.setCurrentColor(color);
    }

    getTitle() {
        let title = this.location.prepareExternalUrl(this.location.path());
        title = title.split('/').pop();
        for (let item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === title) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    apiarySubmit() {
        const formValue = this.rucherForm.value;
        if (this.photoApiary == null) {
            this.newApiary.photo = './assets/imageClient/testAccount.png';
        }
        this.newApiary.id = null;
        this.newApiary.idUsername = this.userService.getIdUserLoged();
        this.newApiary.description = formValue.description;
        this.newApiary.name = formValue.name;
        this.newApiary.ville = formValue.ville;
        this.newApiary.codePostal = formValue.codePostal;
        this.newApiary.createdAt = new Date();
        this.newApiary.username = this.username;
        this.initForm();
        this.rucherService.createRucher(this.newApiary).subscribe((apiary) => {
            if (this.rucherService.ruchers != null) {
                this.rucherService.ruchers.push(apiary);
            } else {
                this.rucherService.ruchers = new Array(apiary);
            }
            this.rucherService.saveCurrentApiaryId(apiary.id);
        }, () => { }, () => {
            this.rucherService.emitApiarySubject();
            this.rucheService.getRucheByApiary(this.rucherService.getCurrentApiary());
            this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
            if(this.userService.getJwtReponse().country === "FR"){
                this.notifier.notify('success', 'Rucher créé');
            }else{
                this.notifier.notify('success', 'Created Apaiary');
            }
            this.photoApiary = null;
        });
    }
}
