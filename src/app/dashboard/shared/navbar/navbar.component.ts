import { RucherModel } from '../../../_model/rucher-model';
import { CONFIG } from '../../../../constants/config';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserloggedService } from '../../../userlogged.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/Service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RucherService } from '../../service/api/rucher.service';
import { RucheService } from '../../service/api/ruche.service';
import { FleursFloraisonService } from '../../fleurs-floraison/service/fleurs.floraison.service';
import { MeteoService } from '../../meteo/Service/MeteoService';
import { ObservationService } from '../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { CapteurService } from '../../capteur/capteur.service';
import { ngf } from 'angular-file';
import { SidebarService } from '../../service/sidebar.service';
import { AdminService } from '../../admin/service/admin.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiaryNotesComponent } from '../../apiary/apiary-notes/apiary-notes.component';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';
import { RucheInterface } from '../../../_model/ruche';
import { Observable} from 'rxjs';
import { AlertsService } from '../../service/api/alerts.service';

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
    private eltOnClickId: EventTarget;
    private eltOnClickClass: HTMLCollectionOf<Element>;

    private apiaryUpdate: RucherModel;
    private indexApiaryUpdate: number;
    private selectHive: RucheInterface;
    newRucheForm: FormGroup;
    private hiveIndex: number;
    hiveSelectUpdate: RucheInterface;
    ruchesEditHiveForm : RucheInterface[];
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
        private capteurService: CapteurService,
        private formBuilder: FormBuilder,
        public tokenService: AtokenStorageService,
        private dailyRecordService: DailyRecordService,
        public sidebarService: SidebarService,
        public notifierService: NotifierService,
        public translateService: TranslateService,
        private alertsService: AlertsService,
        private renderer: Renderer2) {
        this.location = location;
        this.notifier = this.notifierService;
        this.sidebarVisible = false;
        this.username = userService.getUser();
        if(this.userService.getJwtReponse().country === "FR"){
            this.translateService.use("fr");
        }else{
            this.translateService.use("en");
        }
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
        this.selectHive = {
            id: null,
            name: '',
            description: '',
            idUsername : '',
            username: '',
            idApiary: '',
            hivePosX: '',
            hivePosY: '',
            sharingUser: []
          };

          this.eltOnClickId = null;
          this.eltOnClickClass = null;


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

    initHiveForm() {
        this.newRucheForm = this.formBuilder.group({
          'nomRuche': [null, Validators.compose([Validators.required])],
          'descriptionRuche': [null],
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
        this.initHiveForm();
    }

    // Desactive the 'active' class from buttons in homePage
    desactiveButtonHomePage(){
        this.eltOnClickId = document.getElementById('name');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('brood');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('weight');
        this.renderer.removeClass(this.eltOnClickId, 'active');
        this.eltOnClickId = document.getElementById('sensors');
        this.renderer.removeClass(this.eltOnClickId, 'active');

        // Desactive alerts, notes, summary buttons
        this.eltOnClickId = document.getElementById('notes');
        this.renderer.removeClass(this.eltOnClickId, 'active0');
        this.eltOnClickId = document.getElementById('summary');
        this.renderer.removeClass(this.eltOnClickId, 'active0');
        this.eltOnClickId = document.getElementById('alert');
        this.renderer.removeClass(this.eltOnClickId, 'active0');
    }

    // Desactive the 'in' class from info under hives in home page
    desactiveCollapsesInfoHivesHomePage(){
        this.eltOnClickClass = document.getElementsByClassName('name');
        for(let i = 0 ; i < this.eltOnClickClass.length; i++) {
         this.eltOnClickClass[i].classList.remove('in');
        }

        this.eltOnClickClass = document.getElementsByClassName('brood');
        for(let i = 0 ; i < this.eltOnClickClass.length; i++) {
         this.eltOnClickClass[i].classList.remove('in');
        }

        this.eltOnClickClass = document.getElementsByClassName('weight');
        for(let i = 0 ; i < this.eltOnClickClass.length; i++) {
         this.eltOnClickClass[i].classList.remove('in');
        }

        this.eltOnClickClass = document.getElementsByClassName('sensors');
        for(let i = 0 ; i < this.eltOnClickClass.length; i++) {
         this.eltOnClickClass[i].classList.remove('in');
        }

    }

    onSelectRucher() {
        this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
        const location = this.location['_platformStrategy']._platformLocation.location.pathname;
        this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
        this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
        switch (location) {
            case '/dashboard/ruche-et-rucher':
                break;
            case '/dashboard/home':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePage();
                this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                break;
            case '/dashboard/home/info-hives':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePage();
                this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                this.router.navigate(['dashboard/home']);
                break;
            case '/dashboard/home/notes':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePage();
                this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                this.router.navigate(['dashboard/home']);
                break;
            case '/dashboard/home/alerts':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePage();
                this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                this.router.navigate(['dashboard/home']);
                break;
            case '/dashboard/home/states':
                this.dailyRecordService.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
                this.desactiveButtonHomePage();
                this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());
                this.alertsService.getAllHiveAlertsByApiary(this.rucherService.getCurrentApiary());
                this.router.navigate(['dashboard/home']);
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

    onSelectRucherEditForm() {
        const donnée = {
            name: this.rucherService.rucherSelectUpdate.name,
            description: this.rucherService.rucherSelectUpdate.description,
            ville: this.rucherService.rucherSelectUpdate.ville,
            codePostal: this.rucherService.rucherSelectUpdate.codePostal,
            validate: ''
        };
        this.rucherForm.setValue(donnée);
    }

    onSelectRucherEditHiveForm(){
        this.apiaryUpdateHive = this.rucherService.rucherSelectUpdate;
        // init hive
        this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === this.rucherService.rucherSelectUpdate.id);
        if(this.ruchesEditHiveForm.length != 0){
            this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
            // Set value
            const donnée = {
                nomRuche: this.hiveSelectUpdate.name,
                descriptionRuche: this.hiveSelectUpdate.description,
            };
            this.newRucheForm.setValue(donnée);
        }
    }

    onSelectRucherDeleteHiveForm(){
        // init hive
        this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === this.rucherService.rucherSelectUpdate.id);
        if(this.ruchesEditHiveForm.length != 0){
            this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
        }
    }

    onSelectHiveEditHiveForm(){
        // Set value
        const donnée = {
            nomRuche: this.hiveSelectUpdate.name,
            descriptionRuche: this.hiveSelectUpdate.description,
        };
        this.newRucheForm.setValue(donnée);
    }

      //Pour effacer une ruche
    deleteHive() {
    this.rucheService.deleteRuche(this.hiveSelectUpdate).subscribe(() => { }, () => { }, () => {
        if ((this.rucherService.rucherSelectUpdate.id === this.rucherService.getCurrentApiary())){
            let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive.id).indexOf(this.hiveSelectUpdate.id);
            this.rucheService.ruches.splice(hiveIndexUpdate,1);
        }
        // update for manage pages
        let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive.id).indexOf(this.hiveSelectUpdate.id);
        this.rucheService.ruchesAllApiary.splice(hiveIndexUpdateListAllApiary,1);

      if(this.userService.getJwtReponse().country === "FR"){
        this.notifier.notify('success', 'Ruche supprimée');
      }else{
        this.notifier.notify('success', 'Deleted Hive');
      }
    });
    }


    //Pour créer une ruche
    createRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive.id = null;
    this.selectHive.idApiary = this.rucherService.rucherSelectUpdate.id;
    this.selectHive.description = formValue.descriptionRuche;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.apiaryName = this.rucherService.rucherSelectUpdate.name;
    this.selectHive.idUsername = this.userService.getIdUserLoged();
    this.selectHive.username = this.username.toLowerCase();
    this.initHiveForm();
    this.rucheService.createRuche(this.selectHive).subscribe((hive) => {
      // this.rucheService.saveCurrentHive(hive.id);
      // For have good hives in homePage.
      if(this.rucherService.rucherSelectUpdate ===  this.rucherService.rucher){
        this.rucheService.ruches.push(hive);
        const location = this.location['_platformStrategy']._platformLocation.location.pathname;
        if(/home/g.test(location)){
            this.desactiveButtonHomePage();
            this.desactiveCollapsesInfoHivesHomePage();
        }
      }
    //   update in manage pages
    console.log(this.rucheService.ruchesAllApiary);
    if(this.rucheService.ruchesAllApiary !== undefined){
        this.rucheService.ruchesAllApiary.push(hive);
    }

    }, () => { }, () => {
      this.rucheService.emitHiveSubject();
      if(this.userService.getJwtReponse().country === "FR"){
        this.notifier.notify('success', 'Ruche créée');
      }else{
        this.notifier.notify('success', 'Crated Hive');
      }
    });
    }

    // pour editer une ruche
    onEditeRuche() {
    const formValue = this.newRucheForm.value;
    this.hiveIndex = this.ruchesEditHiveForm.map(elt => elt.id).indexOf(this.hiveSelectUpdate.id);
    this.selectHive.id = this.hiveSelectUpdate.id;
    this.selectHive.hivePosX = this.hiveSelectUpdate.hivePosX;
    this.selectHive.hivePosY = this.hiveSelectUpdate.hivePosY;
    this.selectHive.username = this.hiveSelectUpdate.username;
    this.selectHive.idApiary = this.apiaryUpdateHive.id;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.description = formValue.descriptionRuche;
    this.rucheService.updateRuche(this.selectHive).subscribe(() => { }, () => { }, () => {
    this.ruchesEditHiveForm[this.hiveIndex] = this.selectHive;
    // Update for home page
    if ((this.rucherService.rucherSelectUpdate.id === this.rucherService.getCurrentApiary()) && (this.selectHive.idApiary === this.rucherService.getCurrentApiary())) {
       let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive.id).indexOf(this.selectHive.id);
       this.rucheService.ruches[hiveIndexUpdate] = this.selectHive;
    //    const location = this.location['_platformStrategy']._platformLocation.location.pathname;
    //    if(/home/g.test(location)){
    //     this.desactiveButtonHomePage();
    //     this.desactiveCollapsesInfoHivesHomePage();
    // }
    }else if((this.selectHive.idApiary === this.rucherService.getCurrentApiary())){
        this.rucheService.ruches.push(this.selectHive);
        const location = this.location['_platformStrategy']._platformLocation.location.pathname;
        if(/home/g.test(location)){
            this.desactiveButtonHomePage();
            this.desactiveCollapsesInfoHivesHomePage();
        }
    }else if((this.rucherService.rucherSelectUpdate.id === this.rucherService.getCurrentApiary())){
        let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive.id).indexOf(this.selectHive.id);
        this.rucheService.ruches.splice(hiveIndexUpdate,1);
    }
    // update for manage pages
    let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive.id).indexOf(this.selectHive.id);
    this.rucheService.ruchesAllApiary[hiveIndexUpdateListAllApiary] = this.selectHive;

      if(this.userService.getJwtReponse().country === "FR"){
        this.notifier.notify('success', 'Ruche mis à jour');
      }else{
        this.notifier.notify('success', 'Updated Hive');
      }
    });
  }

    //Editer Rucher
    onEditerRucher() {
        if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
            const formValue = this.rucherForm.value;
            const index = this.rucherService.ruchers.indexOf(this.rucherService.rucher);
            const indexAllApiary = this.rucherService.allApiaryAccount.indexOf(this.rucherService.rucher);
            this.apiaryUpdate = formValue;
            this.apiaryUpdate.idUsername = this.rucherService.rucher.idUsername;
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
                    this.rucherService.allApiaryAccount[indexAllApiary] = this.apiaryUpdate;
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
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
        }
    }

    deleteRucher() {
        if (this.userService.checkWriteObject(this.rucherService.rucher.idUsername)) {
            this.rucherService.deleteRucher(this.rucherService.rucher).subscribe(() => { }, () => { }, () => {
                const indexApiaryUser = this.rucherService.ruchers.indexOf(this.rucherService.rucher);
                const indexApiaryAllAccount = this.rucherService.allApiaryAccount.indexOf(this.rucherService.rucher);
                this.rucherService.allApiaryAccount.splice(indexApiaryAllAccount, 1);
                this.rucherService.ruchers.splice(indexApiaryUser, 1);
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
                    this.rucherService.rucher = this.rucherService.allApiaryAccount[0];
                }
                this.rucheService.loadHiveByApiary(this.rucherService.rucher.id);
            });
        } else {
            this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);

        }
    }

    rucherSelectInit(){
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
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
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
        const donnée = {
            name: this.rucherService.rucher.name,
            description: this.rucherService.rucher.description,
            ville: this.rucherService.rucher.ville,
            codePostal: this.rucherService.rucher.codePostal,
            validate: ''
        };
        this.rucherForm.setValue(donnée);
    }

    editHiveClicked(){
        // Apiary init
        this.apiaryUpdateHive = this.rucherService.rucher;
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
        // Hive init
        this.rucherService.rucheService.getHiveByUsername(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === this.rucherService.rucherSelectUpdate.id);
            if(this.ruchesEditHiveForm.length != 0){
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

    deleteHiveClicked(){
        // Apiary init
        this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
        // Hive init
        this.rucherService.rucheService.getHiveByUsername(this.userService.getUser()).subscribe(ruches => {
            this.rucherService.rucheService.ruchesAllApiary = ruches;
            this.ruchesEditHiveForm = this.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === this.rucherService.rucherSelectUpdate.id);
            if(this.ruchesEditHiveForm.length != 0){
                this.hiveSelectUpdate = this.ruchesEditHiveForm[0];
            }
        })
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
                this.rucherService.allApiaryAccount.push(apiary);
            } else {
                this.rucherService.ruchers = new Array(apiary);
                this.rucherService.allApiaryAccount.push(apiary);
            }
            this.rucherService.saveCurrentApiaryId(apiary.id);
        }, () => { }, () => {
            this.rucherService.emitApiarySubject();
            this.rucheService.loadHiveByApiary(this.rucherService.getCurrentApiary());
            this.desactiveButtonHomePage();
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
