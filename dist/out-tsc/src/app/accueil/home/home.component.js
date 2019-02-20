var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from '../Service/dailyRecordService';
import { RucheService } from '../Service/ruche.service';
import { Router } from '@angular/router';
import { CONFIG } from '../../../config';
import { AuthService } from '../../auth/Service/auth.service';
var HomeComponent = /** @class */ (function () {
    function HomeComponent(dailyRecTh, draggable, login, rucheService, rucherService, route, authService) {
        this.dailyRecTh = dailyRecTh;
        this.draggable = draggable;
        this.login = login;
        this.rucheService = rucheService;
        this.rucherService = rucherService;
        this.route = route;
        this.authService = authService;
        this.top = Offsets.HANDLE_HEIGHT;
        this.right = Offsets.HALF_WIDTH;
        this.bottom = Offsets.HANDLE_HEIGHT;
        this.left = Offsets.HALF_WIDTH;
        this.infoRuche = null;
        this.message = "";
        this.position = {
            'x': '0',
            'y': '0'
        };
        this.style = {
            'background-image': 'url(' + CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png)',
            'background-position': "center",
            'background-repeat': "no-repeat"
        };
        console.log(this.rucherService.rucher);
        this.photoApiary = null;
        this.offset = new Offsets(this.top, this.right, this.bottom, this.left);
        //this.rucheService.getRucheByApiary(this.login.currentUser().username, this.rucherService.rucher.id);
    }
    HomeComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    HomeComponent.prototype.ngOnInit = function () {
        this.username = this.login.currentUser().username;
        //this.style["background-image"] = "url("+this.rucherService.rucher.photo+")";
        /*if(this.username == "***REMOVED***"){
           this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/JHE.png)";
         }
         else if(this.username == "***REMOVED***"){
           this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/JCP.png)";
         }
         else if(this.username == "***REMOVED***"){
           this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/***REMOVED***.png)";
         }
         else if(this.username == "***REMOVED***"){
           this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/LPO.png)";
         }
         else if(this.username == "aro"){
           this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/aro.png)";
         }
         else if(this.username == "theo"){
           this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/theo.png)";
         }
         else if(this.username == "pma"){
           this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/PMA.png)";
         }*/
    };
    HomeComponent.prototype.onClick = function (ruche) {
        this.route.navigate(['/ruche-detail', ruche.id, ruche.name]);
    };
    HomeComponent.prototype.onDragEnd = function ($event) {
        var id = $event.id;
        this.getPosition($event.style);
        try {
            this.rucheSelect = this.rucheService.ruches[id];
            var rucheUpdate = new Ruche(this.rucheSelect.id, this.rucheSelect.name, this.rucheSelect.description, this.rucheSelect.username, this.rucheSelect.idApiary, this.rucheSelect.hivePosX, this.rucheSelect.hivePosY);
            rucheUpdate.setX(this.position.x);
            rucheUpdate.setY(this.position.y);
            this.rucheService.updateCoordonneesRuche(rucheUpdate);
            this.position.x = '' + 0;
            this.position.y = '' + 0;
        }
        catch (e) {
        }
        //this.rucheService.getRucheByApiary(this.username,rucheUpdate.idApiary);
    };
    /* Calcule les positions */
    HomeComponent.prototype.getPosition = function (position) {
        var container = document.getElementById("cadre");
        /* Dimensions block parent */
        var widthcontainer = container.offsetWidth;
        var heightcontainer = container.offsetHeight;
        var coordonnes = position.transform.slice(10, position.transform.length - 1);
        /* Position en pourcentage */
        var left = parseInt(position.left);
        var top = parseInt(position.top);
        /* Convertir en px */
        left = this.getPourccentToPx(left, widthcontainer);
        top = this.getPourccentToPx(top, heightcontainer);
        var deplacement = coordonnes.split(',');
        deplacement[0] = parseInt(deplacement[0].slice(0, deplacement[0].length - 2));
        deplacement[1] = parseInt(deplacement[1].slice(0, deplacement[1].length - 2));
        this.position.x = '' + (parseInt(left + deplacement[0]) * 100) / widthcontainer;
        this.position.y = '' + (parseInt(top + deplacement[1]) * 100) / heightcontainer;
        if (parseInt(this.position.x) > 99 || parseInt(this.position.x) < 0) {
            this.position.x = '' + 50;
            this.position.x = "" + 50;
            this.position.y = "" + 50;
            //this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
        }
        if (parseInt(this.position.y) > 99 || parseInt(this.position.y) < 0) {
            this.position.y = '' + 50;
            this.position.x = "" + 50;
            this.position.y = "" + 50;
            //this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
        }
    };
    HomeComponent.prototype.getPourccentToPx = function (valeur, valeurTotal) {
        return ((valeur / 100) * valeurTotal);
    };
    /* Pour chaque rucher selectionner */
    HomeComponent.prototype.saveBackground = function () {
        this.rucherService.updateBackgroundApiary(this.rucherService.rucher.id);
        this.photoApiary = null;
    };
    HomeComponent.prototype.cancelBackground = function () {
        this.rucherService.rucher.photo = this.rucherService.currentBackground;
        this.photoApiary = null;
    };
    HomeComponent.prototype.onMouseover = function ($ruche) {
        var ruche = JSON.parse(JSON.stringify($ruche));
        this.infoRuche = ruche.name + ' : ' + ruche.description;
    };
    HomeComponent = __decorate([
        Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss']
        }),
        __metadata("design:paramtypes", [DailyRecordService, DragAndCheckModule,
            UserloggedService,
            RucheService,
            RucherService,
            Router,
            AuthService])
    ], HomeComponent);
    return HomeComponent;
}());
export { HomeComponent };
//# sourceMappingURL=home.component.js.map