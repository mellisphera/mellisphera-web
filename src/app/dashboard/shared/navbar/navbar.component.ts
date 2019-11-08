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

import { RucherModel } from '../../../_model/rucher-model';
import { CONFIG } from '../../../../constants/config';
import { Component, OnInit, ElementRef, Renderer2, Output } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserloggedService } from '../../../userlogged.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/Service/auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RucherService } from '../../service/api/rucher.service';
import { RucheService } from '../../service/api/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { ObservationService } from '../../service/api/observation.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { CapteurService } from '../../service/api/capteur.service';
import { ngf } from 'angular-file';
import { SidebarService } from '../../service/sidebar.service';
import { AdminService } from '../../admin/service/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';
import { RucheInterface } from '../../../_model/ruche';
import { Observable } from 'rxjs';
import { AlertsService } from '../../service/api/alerts.service';
import { MessagesService } from '../../service/messages.service';
import { MessagesList } from '../../../../constants/messages';
import { CapteurInterface } from '../../../_model/capteur';
import { Observation } from '../../../_model/observation';
import { InfoApiaryComponent } from '../../home/info-apiary/info-apiary.component';
import { EventEmitter } from '@angular/core';
import { Binary } from '@angular/compiler';
import { GeonamesService } from '../../service/geonames.service';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    @Output() apiaryChange = new EventEmitter<string>();  // <!-- Voici l'output

    editCapteurCheckbox: boolean;
    paternRef: RegExp;
    editSensorForm: FormGroup;
    newSensorForm: FormGroup;
    hiveSensorSelect: RucheInterface;
    hivesSensorForm: RucheInterface[];
    hivesEditSensorFormOne: RucheInterface[];
    sensorsEditSensorForm: CapteurInterface[];
    sensorSelectUpdate: CapteurInterface;
    apiaryEditSensorFormOnes: RucherModel[];
    hideEditSensorForm: boolean;
    apiarySensorSelect: RucherModel;
    hivesEditSensorForm: RucheInterface[];

    message: string;
    username: string;
    photoApiary: File;
    private listTitles: any[];
    private eltOnClickId: EventTarget;
    private eltOnClickClass: HTMLCollectionOf<Element>;
    public maxSizePicture: number;
    private apiaryUpdate: RucherModel;
    private indexApiaryUpdate: number;
    private selectHive: RucheInterface;
    newRucheForm: FormGroup;
    private hiveIndex: number;
    hiveSelectUpdate: RucheInterface;
    ruchesEditHiveForm: RucheInterface[];
    apiaryUpdateHive: RucherModel;

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
    public messageOrphanHives: string;

    NavbarNoteForm: FormGroup;
    hivesNavbarNoteForm: RucheInterface[];
    public cityByZipCode: string[];
    hiveNoteSelect: RucheInterface;
    newNoteCheckbox: boolean;
    newObs: Observation
    public lastInvalids: any;
    private infoApiaryComponent: any;

    constructor(location: Location,
        private element: ElementRef,
        public userService: UserloggedService,
        private authService: AuthService,
        public rucherService: RucherService,
        private adminService: AdminService,
        private rucheService: RucheService,
        public router: Router,
        private fleursFloraisonService: FleursFloraisonService,
        private observationService: ObservationService,
        private myNotifer: MyNotifierService,
        public capteurService: CapteurService,
        private formBuilder: FormBuilder,
        public tokenService: AtokenStorageService,
        private dailyRecordService: DailyRecordService,
        public sidebarService: SidebarService,
        public geonamesService: GeonamesService,
        public notifierService: NotifierService,
        public translateService: TranslateService,
        private alertsService: AlertsService,
        private renderer: Renderer2,
        private messagesService: MessagesService) {
        this.location = location;
        this.notifier = this.notifierService;
        this.sidebarVisible = false;
        this.maxSizePicture = 10048576;
        this.cityByZipCode = [];
        this.username = userService.getUser();
        if (this.userService.getJwtReponse().lang.indexOf('fr') !== -1) {
            this.translateService.use('fr');
        } else {
            this.translateService.use('en');
        }
        this.editPhotoApiary = null;
        this.apiaryUpdate = this.newApiary = {
            _id: null,
            userId: '',
            name: '',
            description: '',
            createDate: null,
            photo: '',
            username: '',
            zipCode: '',
            city: '',
            countryCode: '',
            privateApiary: false,
            dataLastReceived: null
        };
        this.selectHive = {
            _id: '',
            name: '',
            description: '',
            userId: '',
            username: '',
            apiaryId: '',
            dataLastReceived: null,
            hidden: false,
            createDate: null,
            apiaryName: '',
            hivePosX: '',
            hivePosY: '',
            sharingUser: []
        };

        this.eltOnClickId = null;
        this.eltOnClickClass = null;

        this.paternRef = /[4][0-3]\:([a-z]|[A-Z]|[0-9])([A-Z]|[0-9]|[a-z])\:([A-Z]|[a-z]|[0-9])([a-z]|[A-Z]|[0-9])$/;


    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.userService.currentMessage.subscribe(message => this.message = message);
        this.capteurService.getUserCapteurs();
        this.initForm();
        this.initHiveForm();
        this.initSensorForm();
        this.initNavbarNoteForm();
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

    // Desactive the 'active' class from buttons in homePage
    desactiveButtonHomePage() {
        this.eltOnClickId = document.getElementById('name');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('brood');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('weight');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('sensors');
        this.renderer.removeClass(this.eltOnClickId, 'active');

        // Desactive alerts buttons
        this.eltOnClickId = document.getElementById('infoApiaryButton');
        this.renderer.removeClass(this.eltOnClickId, 'active0');
    }

    // Desactive the 'active' class from buttons in homePage, Active the name one
    desactiveButtonHomePageActiveName() {
        this.eltOnClickId = document.getElementById('name');
        this.renderer.addClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('brood');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('weight');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('sensors');
        this.renderer.removeClass(this.eltOnClickId, 'active');

        // Desactive alerts
        this.eltOnClickId = document.getElementById('infoApiaryButton');
        this.renderer.removeClass(this.eltOnClickId, 'active0');
    }

    // Desactive the 'active' class from buttons in homePage, Active the name one
    desactiveButtonHomePageActiveNameAndAlerts() {
        this.eltOnClickId = document.getElementById('name');
        this.renderer.addClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('brood');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('weight');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('sensors');
        this.renderer.removeClass(this.eltOnClickId, 'active');

        // active alerts
        this.eltOnClickId = document.getElementById('infoApiaryButton');
        this.renderer.addClass(this.eltOnClickId, 'active0');
    }

    // Desactive the 'in' class from info under hives in home page
    desactiveCollapsesInfoHivesHomePage() {
        this.eltOnClickClass = document.getElementsByClassName('name');
        for (let i = 0; i < this.eltOnClickClass.length; i++) {
            this.eltOnClickClass[i].classList.remove('in');
        }

        this.eltOnClickClass = document.getElementsByClassName('brood');
        for (let i = 0; i < this.eltOnClickClass.length; i++) {
            this.eltOnClickClass[i].classList.remove('in');
        }

        this.eltOnClickClass = document.getElementsByClassName('weight');
        for (let i = 0; i < this.eltOnClickClass.length; i++) {
            this.eltOnClickClass[i].classList.remove('in');
        }

        this.eltOnClickClass = document.getElementsByClassName('sensors');
        for (let i = 0; i < this.eltOnClickClass.length; i++) {
            this.eltOnClickClass[i].classList.remove('in');
        }

    }

    // setRouterPage(event) {
    //     if (event instanceof InfoApiaryComponent) {
    //       this.infoApiaryComponent = event;
    //     }
    //   }

    // checkIfInfoApiaryComponent(): Promise<Boolean> {
    //     return new Promise((resolve, reject) => {
    //       if (this.infoApiaryComponent instanceof InfoApiaryComponent) {
    //         resolve(true);
    //       } else {
    //         reject(false);
    //       }
    //     })
    //   }

    onSelectRucher() {
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher._id);
        const location = this.location['_platformStrategy']._platformLocation.location.pathname;
        // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
        this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
        switch (location) {
            case '/dashboard/ruche-et-rucher':
                break;
            case '/dashboard/home':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePageActiveName();
                //this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/dashboard/home/info-hives':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePageActiveName();
                //this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                this.router.navigate(['dashboard/home/info-apiary']);
                break;
            case '/dashboard/home/info-apiary':
                this.apiaryChange.emit(this.rucherService.getCurrentApiary());
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                //this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
                this.dailyRecordService.getRecThByApiaryByDateD3D7(this.rucherService.getCurrentApiary(), (new Date()));
                // this.checkIfInfoApiaryComponent().then(status => {
                //     console.log("OK");
                //     this.infoApiaryComponent.alertsComponent.initCalendar(true);
                //   }).catch(err => {
                //     console.log(err);
                //   })
                this.router.navigate(['dashboard/home/info-apiary']);
                this.desactiveButtonHomePageActiveNameAndAlerts();
                break;
            case '/dashboard/fleurs-floraison':
                this.fleursFloraisonService.getUserFleur(this.rucherService.getCurrentApiary());
                break;
            /*             case '/meteo':
                            this.meteoService.getWeather(this.rucherService.rucher.codePostal);
                            break; */
            case '/dashboard/ruche-detail':
                this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/dashboard/stack-apiary':
                // this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
                break;
            default:
                break;
        }
    }

    // ###############################################################
    // ###############################################################
    // ###################      MANAGE APIARY      ###################
    // ###############################################################
    // ###############################################################

    initForm() {
        this.rucherForm = this.formBuilder.group({
            'name': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
            'description': [null, Validators.compose([Validators.maxLength(40)])],
            'ville': [null, Validators.compose([Validators.required])],
            'codePostal': [null, Validators.compose([Validators.required])],
            'validate': ``,
        });
    }

    /**
     *
     *
     * @returns {number}
     * @memberof NavbarComponent
     */
    getZipCodeFormValue(): number {
        return this.rucherForm.get('codePostal').value;
    }

    onLoadCity() {
        this.geonamesService.getCityByCountryAndZipCode(this.userService.getCountry(), this.getZipCodeFormValue()).subscribe(
            _city => {
                console.log(_city);
                this.cityByZipCode = _city.map(_res => _res.placeName);
            }
        )
    }
    // ###################      CREATE      ###################

    apiarySubmit() {
        const formValue = this.rucherForm.value;
        if (this.photoApiary == null) {
            if (this.translateService.currentLang === 'fr') {
                this.newApiary.photo = './assets/imageClient/background_draw_color_FR.png';
            } else {
                this.newApiary.photo = './assets/imageClient/background_draw_color.png';
            }
        }
        this.newApiary._id = null;
        this.newApiary.userId = this.userService.getIdUserLoged();
        this.newApiary.description = formValue.description;
        this.newApiary.name = formValue.name;
        this.newApiary.city = formValue.ville;
        this.newApiary.zipCode = formValue.codePostal;
        this.newApiary.createDate = new Date();
        this.newApiary.username = this.username;
        this.initForm();
        this.rucherService.createRucher(this.newApiary).subscribe((apiary) => {
            if (this.rucherService.ruchers != null) {
                this.rucherService.ruchers.push(apiary);
                this.rucherService.allApiaryAccount.push(apiary);
            } else {
                this.rucherService.ruchers = new Array(apiary);
                this.rucherService.allApiaryAccount.push(apiary);
            }
            this.rucherService.saveCurrentApiaryId(apiary._id);
        }, () => { }, () => {
            this.rucherService.emitApiarySubject();
            this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
            if ((this.rucherService.ruchers.length !== 1) && (/home/g.test(this.router.url))) {
                this.desactiveButtonHomePageActiveName();
            }
            this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
            if ((/home/g.test(this.router.url))) {
                this.apiaryChange.emit(this.rucherService.getCurrentApiary());
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                //this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
                this.dailyRecordService.getRecThByApiaryByDateD3D7(this.rucherService.getCurrentApiary(), (new Date()));
                this.router.navigate(['dashboard/home/info-apiary']);
                this.desactiveButtonHomePageActiveNameAndAlerts();
            }
            if (this.translateService.currentLang === 'fr') {
                this.notifier.notify('success', 'Rucher créé');
            } else {
                this.notifier.notify('success', 'Created Apaiary');
            }
            this.photoApiary = null;
        });
    }

    // ###################      EDIT      ###################

    editRucherClicked() {
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;

        // Hive init
        this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.messageOrphanHives = this.displayOrphanHives(this.rucherService.rucherSelectUpdate);
        })

        const donnée = {
            name: this.rucherService.rucher.name,
            description: this.rucherService.rucher.description,
            ville: this.rucherService.rucher.city,
            codePostal: this.rucherService.rucher.zipCode,
            validate: ''
        };
        console.log(this.rucherService.rucherSelectUpdate);
        this.rucherForm.setValue(donnée);
    }

    //Edit apiary
    onEditerRucher() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.rucherForm.value;
            const index = this.rucherService.ruchers.indexOf(this.rucherService.rucherSelectUpdate);
            const indexAllApiary = this.rucherService.allApiaryAccount.indexOf(this.rucherService.rucherSelectUpdate);
            this.apiaryUpdate = formValue;
            this.apiaryUpdate.city = formValue.ville;
            this.apiaryUpdate.zipCode = formValue.codePostal;
            this.apiaryUpdate.userId = this.rucherService.rucherSelectUpdate.userId;
            this.apiaryUpdate._id = this.rucherService.rucherSelectUpdate._id;
            if (this.photoApiary === null || this.photoApiary === undefined) {
                this.apiaryUpdate.photo = this.rucherService.rucherSelectUpdate.photo;
            } else {
                this.apiaryUpdate.photo = this.editPhotoApiary;
            }
            this.apiaryUpdate.username = this.rucherService.rucherSelectUpdate.username;
            this.rucherService.updateRucher(this.rucherService.rucherSelectUpdate._id, this.apiaryUpdate).subscribe(
                () => { }, () => { }, () => {
                    this.rucherService.ruchers[index] = this.apiaryUpdate;
                    this.rucherService.allApiaryAccount[indexAllApiary] = this.apiaryUpdate;
                    this.rucherService.emitApiarySubject();
                    this.photoApiary = null;
                    this.editPhotoApiary = null;
                    if (this.rucherService.rucherSelectUpdate === this.rucherService.rucher) {
                        this.rucherService.rucher = this.apiaryUpdate;
                    }
                    if (this.translateService.currentLang === 'fr') {
                        this.notifier.notify('success', 'Rucher mis à jour');
                    } else {
                        this.notifier.notify('success', 'Updated Apiary');
                    }
                    this.initForm();
                }
            );
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    onSelectRucherEditForm() {
        this.messageOrphanHives = this.displayOrphanHives(this.rucherService.rucherSelectUpdate);

        const donnée = {
            name: this.rucherService.rucherSelectUpdate.name,
            description: this.rucherService.rucherSelectUpdate.description,
            ville: this.rucherService.rucherSelectUpdate.city,
            codePostal: this.rucherService.rucherSelectUpdate.zipCode,
            validate: ''
        };
        this.rucherForm.setValue(donnée);
    }

    // onSelectRucherEditForm() {
    //     this.messageOrphanHives = this.displayOrphanHives(this.rucherService.rucherSelectUpdate);

    //     const donnée = {
    //         name: this.rucherService.rucherSelectUpdate.name,
    //         description: this.rucherService.rucherSelectUpdate.description,
    //         ville: this.rucherService.rucherSelectUpdate.ville,
    //         codePostal: this.rucherService.rucherSelectUpdate.codePostal,
    //         validate: ''
    //     };
    //     this.rucherForm.setValue(donnée);
    // }

    rucherSelectInit() {
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
    }

    // ###################      DELETE      ###################

    displayOrphanHives(apiary: RucherModel): string {
        let message: string;
        let _hives = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiary._id);
        let lengthHives = _hives.length;
        if (lengthHives === 0) {
            message = '';
        } else if (lengthHives === 1) {
            message = this.messagesService.getMessage(MessagesList.WARNINGHIVE);
            message += _hives[0].name;
            message += this.messagesService.getMessage(MessagesList.WILLBEDELETED);
        } else {
            message = this.messagesService.getMessage(MessagesList.WARNINGHIVES);
            _hives.forEach((element, index) => {
                if (index === 0) {
                    message += element.name;
                } else if (index === lengthHives - 1) {
                    message += this.messagesService.getMessage(MessagesList.AND);
                    message += element.name;
                } else {
                    message += '; ';
                    message += element.name;
                }
            });
            message += this.messagesService.getMessage(MessagesList.WILLBEDELETEDS);
        }

        return (message);
    }

    onSelectRucherDeleteForm() {
        this.messageOrphanHives = this.displayOrphanHives(this.rucherService.rucherSelectUpdate);
    }

    deleteRucher() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            this.rucherService.deleteRucher(this.rucherService.rucherSelectUpdate).subscribe(() => { }, () => { }, () => {
                const indexApiaryUser = this.rucherService.ruchers.indexOf(this.rucherService.rucherSelectUpdate);
                const indexApiaryAllAccount = this.rucherService.allApiaryAccount.indexOf(this.rucherService.rucherSelectUpdate);
                this.rucherService.allApiaryAccount.splice(indexApiaryAllAccount, 1);
                this.rucherService.ruchers.splice(indexApiaryUser, 1);
                this.rucherService.emitApiarySubject();
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Rucher supprimé');
                } else {
                    this.notifier.notify('success', 'Deleted Apaiary');
                }
                if ((this.rucherService.ruchers.length > 0) && (this.rucherService.rucherSelectUpdate === this.rucherService.rucher)) {
                    this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
                    this.rucherService.saveCurrentApiaryId(this.rucherService.rucher._id);
                    if ((/home/g.test(this.router.url))) {
                        this.apiaryChange.emit(this.rucherService.getCurrentApiary());
                        this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                        //this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                        //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                        // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
                        this.dailyRecordService.getRecThByApiaryByDateD3D7(this.rucherService.getCurrentApiary(), (new Date()));
                        this.router.navigate(['dashboard/home/info-apiary']);
                        this.desactiveButtonHomePageActiveNameAndAlerts();
                    }
                }
                if (this.rucherService.ruchers.length < 1) {
                    this.rucherService.initRucher();
                    if (this.rucherService.allApiaryAccount.length > 0) {
                        this.rucherService.rucher = this.rucherService.allApiaryAccount[0];
                    }
                    if ((/home/g.test(this.router.url))) {
                        this.apiaryChange.emit(this.rucherService.getCurrentApiary());
                        this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                        //this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                        //this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                        // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
                        this.dailyRecordService.getRecThByApiaryByDateD3D7(this.rucherService.getCurrentApiary(), (new Date()));
                        this.router.navigate(['dashboard/home/info-apiary']);
                        this.desactiveButtonHomePageActiveNameAndAlerts();
                    }
                }
                this.rucheService.loadHiveByApiary(this.rucherService.rucher._id);

                // For the edit apiary form
                this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
                this.messageOrphanHives = this.displayOrphanHives(this.rucherService.rucherSelectUpdate);
                const donnée = {
                    name: this.rucherService.rucherSelectUpdate.name,
                    description: this.rucherService.rucherSelectUpdate.description,
                    ville: this.rucherService.rucherSelectUpdate.city,
                    codePostal: this.rucherService.rucherSelectUpdate.zipCode,
                    validate: ''
                };
                this.rucherForm.setValue(donnée);
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.NO_DELETE_RIGHT);

        }
    }

    deleteApiaryClicked() {
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
        // Hive init
        this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.messageOrphanHives = this.displayOrphanHives(this.rucherService.rucherSelectUpdate);
        })
    }

    // ###############################################################
    // ###############################################################
    // ###################      MANAGE HIVES      ###################
    // ###############################################################
    // ###############################################################

    initHiveForm() {
        this.newRucheForm = this.formBuilder.group({
            'nomRuche': [null, Validators.compose([Validators.required])],
            'descriptionRuche': [null],
        });
    }

    // ###################      CREATE      ###################

    //For create a hive
    createRuche() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.newRucheForm.value;
            this.selectHive._id = null;
            this.selectHive.apiaryId = this.rucherService.rucherSelectUpdate._id;
            this.selectHive.description = formValue.descriptionRuche;
            this.selectHive.name = formValue.nomRuche;
            this.selectHive.apiaryName = this.rucherService.rucherSelectUpdate.name;
            this.selectHive.userId = this.userService.getIdUserLoged();
            this.selectHive.username = this.username.toLowerCase();
            this.initHiveForm();
            this.rucheService.createRuche(this.selectHive).subscribe((hive) => {
                // this.rucheService.saveCurrentHive(hive.id);
                // For have good hives in homePage.
                if (this.rucherService.rucherSelectUpdate === this.rucherService.rucher) {
                    this.rucheService.ruches.push(hive);
                    const location = this.location['_platformStrategy']._platformLocation.location.pathname;
                    // if(/home/g.test(location)){
                    //     this.desactiveButtonHomePage();
                    //     this.desactiveCollapsesInfoHivesHomePage();
                    // }
                }
                //   update in manage pages
                if (this.rucheService.ruchesAllApiary !== undefined) {
                    this.rucheService.ruchesAllApiary.push(hive);
                }

            }, () => { }, () => {
                this.rucheService.emitHiveSubject();
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Ruche créée');
                } else {
                    this.notifier.notify('success', 'Crated Hive');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    // ###################      EDIT      ###################

    editHiveClicked() {
        // Apiary init
        this.apiaryUpdateHive = this.rucherService.rucher;
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
        // Hive init
        this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
            if (this.ruchesEditHiveForm.length != 0) {
                this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
                // Set value
                const donnée = {
                    nomRuche: this.hiveSelectUpdate.name,
                    descriptionRuche: this.hiveSelectUpdate.description,
                };
                this.newRucheForm.setValue(donnée);
            }
        })
    }

    onSelectRucherEditHiveForm() {
        this.apiaryUpdateHive = this.rucherService.rucherSelectUpdate;
        // init hive
        this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
        if (this.ruchesEditHiveForm.length != 0) {
            this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
            // Set value
            const donnée = {
                nomRuche: this.hiveSelectUpdate.name,
                descriptionRuche: this.hiveSelectUpdate.description,
            };
            this.newRucheForm.setValue(donnée);
        }
    }

    onSelectHiveEditHiveForm() {
        // Set value
        const donnée = {
            nomRuche: this.hiveSelectUpdate.name,
            descriptionRuche: this.hiveSelectUpdate.description,
        };
        this.newRucheForm.setValue(donnée);
    }

    // for edit a hive
    onEditeRuche() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.newRucheForm.value;
            this.hiveIndex = this.ruchesEditHiveForm.map(elt => elt._id).indexOf(this.hiveSelectUpdate._id);
            this.selectHive._id = this.hiveSelectUpdate._id;
            this.selectHive.hivePosX = this.hiveSelectUpdate.hivePosX;
            this.selectHive.hivePosY = this.hiveSelectUpdate.hivePosY;
            this.selectHive.username = this.hiveSelectUpdate.username;
            this.selectHive.apiaryId = this.apiaryUpdateHive._id;
            this.selectHive.name = formValue.nomRuche;
            this.selectHive.description = formValue.descriptionRuche;
            this.rucheService.updateRuche(this.selectHive).subscribe(() => { }, () => { }, () => {
                this.ruchesEditHiveForm[this.hiveIndex] = this.selectHive;
                // Update for home page
                if ((this.rucherService.rucherSelectUpdate._id === this.rucherService.getCurrentApiary()) && (this.selectHive.apiaryId === this.rucherService.getCurrentApiary())) {
                    let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive._id).indexOf(this.selectHive._id);
                    this.rucheService.ruches[hiveIndexUpdate] = this.selectHive;
                    //    const location = this.location['_platformStrategy']._platformLocation.location.pathname;
                    //    if(/home/g.test(location)){
                    //     this.desactiveButtonHomePage();
                    //     this.desactiveCollapsesInfoHivesHomePage();
                    // }
                } else if ((this.selectHive.apiaryId === this.rucherService.getCurrentApiary())) {
                    this.rucheService.ruches.push(this.selectHive);
                    const location = this.location['_platformStrategy']._platformLocation.location.pathname;
                    if (/home/g.test(location)) {
                        this.desactiveButtonHomePage();
                        this.desactiveCollapsesInfoHivesHomePage();
                    }
                } else if ((this.rucherService.rucherSelectUpdate._id === this.rucherService.getCurrentApiary())) {
                    let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive._id).indexOf(this.selectHive._id);
                    this.rucheService.ruches.splice(hiveIndexUpdate, 1);
                }
                // update for manage pages
                let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive._id).indexOf(this.selectHive._id);
                this.rucheService.ruchesAllApiary[hiveIndexUpdateListAllApiary] = this.selectHive;

                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Ruche mis à jour');
                } else {
                    this.notifier.notify('success', 'Updated Hive');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    // ###################      DELETE      ###################

    onSelectRucherDeleteHiveForm() {
        // init hive
        this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
        if (this.ruchesEditHiveForm.length != 0) {
            this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
        }
    }

    //for delete a hive
    deleteHive() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            this.rucheService.deleteRuche(this.hiveSelectUpdate).subscribe(() => { }, () => { }, () => {
                if ((this.rucherService.rucherSelectUpdate._id === this.rucherService.getCurrentApiary())) {
                    let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive._id).indexOf(this.hiveSelectUpdate._id);
                    this.rucheService.ruches.splice(hiveIndexUpdate, 1);
                }
                // update for manage pages
                let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive._id).indexOf(this.hiveSelectUpdate._id);
                this.rucheService.ruchesAllApiary.splice(hiveIndexUpdateListAllApiary, 1);

                // update for edit hive form
                let hiveIndexUpdateruchesEditHiveForm = this.ruchesEditHiveForm.map(hive => hive._id).indexOf(this.hiveSelectUpdate._id);
                this.ruchesEditHiveForm.splice(hiveIndexUpdateruchesEditHiveForm, 1);

                if (this.ruchesEditHiveForm[0] !== undefined) {
                    this.hiveSelectUpdate = this.ruchesEditHiveForm[0];

                    // Set value
                    const donnée = {
                        nomRuche: this.hiveSelectUpdate.name,
                        descriptionRuche: this.hiveSelectUpdate.description,
                    };
                    this.newRucheForm.setValue(donnée);
                } else {
                    this.hiveSelectUpdate = this.ruchesEditHiveForm[0];

                    // Set value
                    const donnée = {
                        nomRuche: '',
                        descriptionRuche: '',
                    };
                    this.newRucheForm.setValue(donnée);
                }

                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Ruche supprimée');
                } else {
                    this.notifier.notify('success', 'Deleted Hive');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    deleteHiveClicked() {
        // Apiary init
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
        // Hive init
        this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
            if (this.ruchesEditHiveForm.length != 0) {
                this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
            }
        })
    }


    // ###############################################################
    // ###############################################################
    // ###################      MANAGE NOTES      ###################
    // ###############################################################
    // ###############################################################

    initNavbarNoteForm() {
        const defautDate = new Date();
        // defautDate.setUTCHours(new Date().getHours());
        this.NavbarNoteForm = this.formBuilder.group({
            'sentence': [null, Validators.compose([Validators.required])],
            'type': ['HiveObs', Validators.required],
            'date': new Date(),
            'checkbox': ['apiary', Validators.required],
        });
    }

    resetNavbarNoteForm() {
        this.NavbarNoteForm.get('sentence').reset();
    }

    getHiveNameById(hiveId: string): string {
        if (this.rucheService.ruchesAllApiary.filter(hive => hive._id === hiveId)[0] !== undefined) {
            return (this.rucheService.ruchesAllApiary.filter(hive => hive._id === hiveId)[0].name);
        } else {
            return '';
        }
    }

    getApiaryNameByID(apiaryId: string): string {
        if (this.rucherService.ruchers.filter(apiary => apiary._id === apiaryId)[0] !== undefined) {
            return (this.rucherService.ruchers.filter(apiary => apiary._id === apiaryId)[0].name);
        } else {
            return '';
        }
    }

    // ###################      CREATE      ###################

    newNoteModalInit() {
        // Apiary init
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;

        // Hive init
        this.rucherService.rucheService.getHiveByUserId(this.userService.getIdUserLoged()).subscribe(ruches => {
            console.log(ruches);
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.hivesNavbarNoteForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
            if (this.hivesNavbarNoteForm.length !== 0) {
                this.hiveNoteSelect = this.hivesNavbarNoteForm[0];
            }
        })
    }

    onSelectApiaryNewNavbarNoteForm() {
        // init hive
        this.hivesNavbarNoteForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
        if (this.hivesNavbarNoteForm.length !== 0) {
            this.hiveNoteSelect = this.hivesNavbarNoteForm[0];
        }
    }

    onchangeCheckbox(event) {
        this.newNoteCheckbox = (event.target.value === 'hive');
    }

    createObservation() {
        console.log('dddd');
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.NavbarNoteForm.value;
            this.newObs = formValue;
            this.newObs.typeInspect = 'HiveObs';
            this.newObs.type = this.newNoteCheckbox ? 'hive' : 'apiary';
            this.newObs.opsDate = formValue.date;
            this.newObs.createDate = new Date();
            this.newObs.description = formValue.sentence;
            this.newObs.hiveId = this.hiveNoteSelect._id;
            this.newObs.userId = this.userService.getIdUserLoged();
            this.NavbarNoteForm.reset();
            this.observationService.createObservation(this.newObs).subscribe((obs) => {
                if (this.newObs.type === 'hive') {
                    this.observationService.observationsHive.push(obs);
                    this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
                        return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
                    });
                } else {
                    this.observationService.observationsApiary.push(obs);
                    this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
                        return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
                    });
                }
                //this.observationService.observationsHiveUser.push(obs);
                /*             this.observationService.observationsHiveUser.sort((a, b) => {
                              return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
                            }); */
            }, () => { }, () => {
                this.initNavbarNoteForm();
                this.newNoteCheckbox = false;
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Observation créée');
                } else {
                    this.notifier.notify('success', 'Created Observation');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    createAction() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.NavbarNoteForm.value;
            this.newObs = formValue;
            this.newObs.typeInspect = 'HiveAct';
            this.newObs.type = this.newNoteCheckbox ? 'hive' : 'apiary';
            this.newObs.opsDate = formValue.date;
            this.newObs.description = formValue.sentence;
            this.newObs.createDate = new Date();
            this.newObs.hiveId = this.hiveNoteSelect._id;
            this.newObs.userId = this.userService.getIdUserLoged();
            this.NavbarNoteForm.reset();
            this.observationService.createObservation(this.newObs).subscribe((obs) => {
                if (this.newObs.type === 'hive') {
                    this.observationService.observationsHive.push(obs);
                    this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
                        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
                    });
                } else {
                    this.observationService.observationsApiary.push(obs);
                    this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
                        return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
                    });
                }

                //this.observationService.observationsHiveUser.push(obs);
                /*             this.observationService.observationsHiveUser.sort((a, b) => {
                              return this.getHiveNameById(a.hiveId).localeCompare(this.getHiveNameById(b.hiveId));
                            }); */
            }, () => { }, () => {
                this.initNavbarNoteForm();
                this.newNoteCheckbox = false;
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Action créée');
                } else {
                    this.notifier.notify('success', 'Created Action');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    createNote() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.NavbarNoteForm.value;
            this.newObs = formValue;
            this.newObs.typeInspect = 'ApiaryObs';
            this.newObs.type = this.newNoteCheckbox ? 'hive' : 'apiary';
            this.newObs.opsDate = formValue.date;
            this.newObs.createDate = new Date();
            this.newObs.description = formValue.sentence;
            this.newObs.apiaryId = this.rucherService.rucherSelectUpdate._id;
            this.newObs.userId = this.userService.getIdUserLoged();
            this.NavbarNoteForm.reset();
            this.observationService.createObservation(this.newObs).subscribe((obs) => {
                if (this.newObs.type === 'hive') {
                    this.observationService.observationsHive.push(obs);
                    this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
                        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
                    });
                } else {
                    this.observationService.observationsApiary.push(obs);
                    this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
                        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
                    });
                }
            }, () => { }, () => {
                this.initNavbarNoteForm();
                this.newNoteCheckbox = false;
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Note créée');
                } else {
                    this.notifier.notify('success', 'Created Note');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    // ###################      EDIT      ###################
    // ###################      DELETE      ###################

    // ###############################################################
    // ###############################################################
    // ###################      MANAGE SENSOR      ###################
    // ###############################################################
    // ###############################################################

    initSensorForm() {
        this.newSensorForm = this.formBuilder.group({
            'reference': [null, Validators.compose(
                [Validators.required, Validators.pattern(this.paternRef)]),
                this.validateSensorNotTaken.bind(this),
                /* Validators.pattern(this.paternRef)*/
            ],
            'description': [null],
            'checkbox': ['ruche', Validators.required],
        });

        this.editSensorForm = this.formBuilder.group({
            'description': [null],
            'checkbox': ['ruche', Validators.required]
        });
    }

    // ###################      CREATE      ###################

    getSensorRef() {
        return this.newSensorForm.get('reference');
    }
    getTypeAffectation() {
        return this.newSensorForm.get('checkbox');
    }

    getApiaryNameById(apiaryId: string) {
        try {
            return this.rucherService.ruchers.filter(apiary => apiary._id === apiaryId)[0];
        } catch (e) {
            return this.rucherService.rucher;
        }
    }

    validateSensorNotTaken(control: AbstractControl): Observable<any> {
        if (!control.valueChanges) {
            return Observable.of(null);
        } else {
            return control.valueChanges
                .debounceTime(1000)
                .distinctUntilChanged()
                .switchMap(value => this.capteurService.checkSensorExist(value))
                .map(res => {
                    return res ? null : { sensorCheck: true };
                })
                .first();
        }
        /*
        return this.capteurService.checkSensorExist(control.value).map(res => {
            return res ? null : { sensorCheck: true };
        });*/

    }

    newSensorInit() {
        // Apiary init
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;

        // Hive init
        this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.hivesSensorForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
            if (this.hivesSensorForm.length !== 0) {
                this.hiveSensorSelect = this.hivesSensorForm[0];
            }
        })
    }

    onSelectApiaryNewSensorForm() {
        // init hive
        this.hivesSensorForm = this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.rucherService.rucherSelectUpdate._id);
        if (this.hivesSensorForm.length !== 0) {
            this.hiveSensorSelect = this.hivesSensorForm[0];
        }
    }

    createCapteur() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.newSensorForm.value;
            /* POUR OBTENIR LE TYPË A CHANGER DES QUE POSSIBLE */
            const sensorType = document.querySelector('#typeSensor > option').innerHTML;
            const tempType = this.capteurService.capteur.type;
            this.capteurService.initCapteur();
            if (formValue.checkbox !== 'stock') {
                this.capteurService.capteur.hiveId = this.hiveSensorSelect._id;
                this.capteurService.capteur.apiaryId = this.getApiaryNameById(this.hiveSensorSelect.apiaryId)._id;
                const index = this.rucherService.rucheService.ruches.map(hive => hive._id).indexOf(this.hiveSensorSelect._id);
                this.rucherService.rucheService.emitHiveSubject();
            } else {
                this.capteurService.capteur.hiveId = null;
                this.capteurService.capteur.apiaryId = null;
            }
            this.capteurService.capteur.sensorRef = formValue.reference;
            this.capteurService.capteur.type = sensorType.trim();
            this.initSensorForm();
            this.capteurService.createCapteur().subscribe(() => { }, () => { }, () => {
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Capteur créé');
                } else {
                    this.notifier.notify('success', 'Created sensor');
                }
                this.capteurService.getUserCapteurs();
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    // ###################      EDIT      ###################

    onchange(event) {
        this.editCapteurCheckbox = (event.target.value === 'ruche');
    }

    editSensorInit() {
        // Apiary init
        this.apiaryEditSensorFormOnes = this.rucherService.ruchers.filter(apiary => (this.capteurService.capteursByUser.filter(sensor => sensor.apiaryId === apiary._id)).length !== 0);
        if (this.apiaryEditSensorFormOnes.length !== 0) {
            this.hideEditSensorForm = false;
            this.rucherService.rucherSelectUpdate = this.apiaryEditSensorFormOnes[0];

            // Hive init
            this.rucherService.rucheService.getHiveByUserId(this.userService.getUser()).subscribe(ruches => {
                this.rucherService.rucheService.ruchesAllApiary = ruches;
                this.hivesEditSensorFormOne = this.rucheService.ruchesAllApiary.filter(hive => (hive.apiaryId === this.rucherService.rucherSelectUpdate._id) && (this.capteurService.capteursByUser.filter(sensor => sensor.hiveId === hive._id).length !== 0));
                if (this.hivesEditSensorFormOne.length != 0) {
                    this.hiveSelectUpdate = this.hivesEditSensorFormOne[0];
                    // Sensor init
                    this.sensorsEditSensorForm = this.capteurService.capteursByUser.filter(sensor => sensor.hiveId === this.hiveSelectUpdate._id);
                    if (this.sensorsEditSensorForm.length !== 0) {
                        this.sensorSelectUpdate = this.sensorsEditSensorForm[0];
                        // Set the right infos below
                        this.capteurService.capteur = this.sensorSelectUpdate;
                        this.editCapteurCheckbox = !(this.capteurService.capteur.hiveId == null || this.capteurService.capteur.apiaryId == null);
                        /* Assigne les données du capteurs au formulaire pour modification*/
                        const donnee = {
                            checkbox: this.editCapteurCheckbox ? 'ruche' : 'stock',
                        };
                        this.editSensorForm.setValue(donnee);
                        if (this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
                            this.rucherService.findRucherById(this.capteurService.capteur.apiaryId, (apiary) => {
                                this.apiarySensorSelect = apiary[0];
                                this.hivesEditSensorForm = this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiary[0].id);
                            });
                            this.hiveSensorSelect = this.hivesEditSensorForm.filter(hive => hive._id === this.capteurService.capteur.hiveId)[0];
                        }
                    }
                }
            })
        } else {
            this.hideEditSensorForm = true;
        }

    }
    onSelectApiaryEditSensorForm() {
        this.hivesEditSensorFormOne = this.rucheService.ruchesAllApiary.filter(hive => (hive.apiaryId === this.rucherService.rucherSelectUpdate._id) && (this.capteurService.capteursByUser.filter(sensor => sensor.hiveId === hive._id).length !== 0));
        if (this.hivesEditSensorFormOne.length != 0) {
            this.hiveSelectUpdate = this.hivesEditSensorFormOne[0];
            this.sensorsEditSensorForm = this.capteurService.capteursByUser.filter(sensor => sensor.hiveId === this.hiveSelectUpdate._id);
            if (this.sensorsEditSensorForm.length !== 0) {
                this.sensorSelectUpdate = this.sensorsEditSensorForm[0];
                // Set the right infos below
                this.capteurService.capteur = this.sensorSelectUpdate;
                this.editCapteurCheckbox = !(this.capteurService.capteur.hiveId == null || this.capteurService.capteur.apiaryId == null);
                /* Assigne les données du capteurs au formulaire pour modification*/
                const donnee = {
                    checkbox: this.editCapteurCheckbox ? 'ruche' : 'stock',
                };
                this.editSensorForm.setValue(donnee);
                if (this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
                    this.rucherService.findRucherById(this.capteurService.capteur.apiaryId, (apiary) => {
                        this.apiarySensorSelect = apiary[0];
                        this.hivesEditSensorForm = this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiary[0].id);
                    });
                    this.hiveSensorSelect = this.hivesEditSensorForm.filter(hive => hive._id === this.capteurService.capteur.hiveId)[0];
                }
            }
        }
    }

    onSelectHiveEditSensorForm() {
        this.sensorsEditSensorForm = this.capteurService.capteursByUser.filter(sensor => sensor.hiveId === this.hiveSelectUpdate._id);
        if (this.sensorsEditSensorForm.length !== 0) {
            this.sensorSelectUpdate = this.sensorsEditSensorForm[0];
            // Set the right infos below
            this.capteurService.capteur = this.sensorSelectUpdate;
            this.editCapteurCheckbox = !(this.capteurService.capteur.hiveId == null || this.capteurService.capteur.apiaryId == null);
            /* Assigne les données du capteurs au formulaire pour modification*/
            const donnee = {
                checkbox: this.editCapteurCheckbox ? 'ruche' : 'stock',
            };
            this.editSensorForm.setValue(donnee);
            if (this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
                this.rucherService.findRucherById(this.capteurService.capteur.apiaryId, (apiary: RucherModel) => {
                    this.apiarySensorSelect = apiary[0];
                    this.hivesEditSensorForm = this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiary[0]._id);
                });
                this.hiveSensorSelect = this.hivesEditSensorForm.filter(hive => hive._id === this.capteurService.capteur.hiveId)[0];
            }
        }
    }

    onSelectSensorEditSensorForm() {
        // Set the right infos below
        this.capteurService.capteur = this.sensorSelectUpdate;
        this.editCapteurCheckbox = !(this.capteurService.capteur.hiveId == null || this.capteurService.capteur.apiaryId == null);
        /* Assigne les données du capteurs au formulaire pour modification*/
        const donnee = {
            checkbox: this.editCapteurCheckbox ? 'ruche' : 'stock',
        };
        this.editSensorForm.setValue(donnee);
        if (this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
            this.rucherService.findRucherById(this.capteurService.capteur.apiaryId, (apiary: RucherModel) => {
                this.apiarySensorSelect = apiary[0];
                this.hivesEditSensorForm = this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiary[0]._id);
            });
            this.hiveSensorSelect = this.hivesEditSensorForm.filter(hive => hive._id === this.capteurService.capteur.hiveId)[0];
        }
    }

    onSelectApiary() {
        this.hivesEditSensorForm = this.rucherService.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === this.apiarySensorSelect._id);
        if (this.hivesEditSensorForm.length !== 0) {
            this.hiveSensorSelect = this.hivesEditSensorForm[0];
        }
    }

    updateSensor() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            const formValue = this.editSensorForm.value;
            const idTemp = this.capteurService.capteur._id;
            if (formValue.checkbox !== 'stock') {
                this.capteurService.capteur.hiveId = this.hiveSensorSelect._id;
                this.capteurService.capteur.apiaryId = this.getApiaryNameById(this.hiveSensorSelect.apiaryId)._id;
                const index = this.rucherService.rucheService.ruches.map(hive => hive._id).indexOf(this.hiveSensorSelect._id);
                this.rucherService.rucheService.emitHiveSubject();
            } else {
                this.capteurService.capteur.hiveId = null;
                this.capteurService.capteur.apiaryId = null;
            }
            this.capteurService.capteur._id = idTemp;
            this.initSensorForm();
            this.editSensorInit();
            this.capteurService.updateCapteur().subscribe(() => { }, () => { }, () => {
                let indexSensorSelect = this.capteurService.capteursByUser.map(sensor => sensor._id).indexOf(this.capteurService.capteur._id);
                this.capteurService.capteursByUser[indexSensorSelect] = this.capteurService.capteur;
                this.capteurService.emitSensorSubject();
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Capteur mis à jour');
                } else {
                    this.notifier.notify('success', 'Updated sensor');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    // ###################      DELETE      ###################

    deleteSensor() {
        if (this.userService.checkWriteObject(this.rucherService.rucherSelectUpdate.userId)) {
            this.capteurService.deleteCapteur(this.capteurService.capteur).subscribe(() => { }, () => { }, () => {
                if (this.capteurService.capteur.hiveId) {
                    const index = this.rucherService.rucheService.ruchesAllApiary.map(hive => hive._id).indexOf(this.capteurService.capteur.hiveId);
                    const tempHive = this.rucherService.rucheService.ruchesAllApiary[index];
                    if (this.capteurService.capteursByUser.filter(sensor => sensor.hiveId === tempHive._id).length <= 1) {
                        this.rucherService.rucheService.ruchesAllApiary[index].sensor = false;
                        this.rucherService.rucheService.emitHiveSubject();
                    }
                }
                let index = this.capteurService.capteursByUser.map(sensor => sensor._id).indexOf(this.capteurService.capteur._id);
                this.capteurService.capteursByUser.splice(index, 1);
                this.capteurService.emitSensorSubject();
                this.initSensorForm();
                this.editSensorInit();
                if (this.translateService.currentLang === 'fr') {
                    this.notifier.notify('success', 'Capteur supprimé');
                } else {
                    this.notifier.notify('success', 'Deleted sensor');
                }
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }
}
