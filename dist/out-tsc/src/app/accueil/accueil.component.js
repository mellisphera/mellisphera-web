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
import { UserloggedService } from '../userlogged.service';
var AccueilComponent = /** @class */ (function () {
    function AccueilComponent(data) {
        this.data = data;
        this.message = "";
        this.username = data.currentUser().username;
        console.log("logged user accueil : " + this.username);
        if (this.username == '***REMOVED***') {
            this.userBLG = true;
            console.log("userBLG : " + this.userBLG);
        }
        if (this.username == 'clo') {
            this.userCLO = true;
            console.log("userCLO : " + this.userCLO);
        }
        if (this.username == '***REMOVED***') {
            this.userJCP = true;
            console.log("userCLO : " + this.userJCP);
        }
        if (this.username == '***REMOVED***') {
            this.userJHE = true;
            console.log("userCLO : " + this.userJHE);
        }
    }
    AccueilComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    AccueilComponent.prototype.ngOnInit = function () {
    };
    AccueilComponent.prototype.isMap = function () {
    };
    AccueilComponent = __decorate([
        Component({
            selector: 'app-accueil',
            templateUrl: './accueil.component.html',
            styleUrls: ['./accueil.component.scss']
        }),
        __metadata("design:paramtypes", [UserloggedService])
    ], AccueilComponent);
    return AccueilComponent;
}());
export { AccueilComponent };
//# sourceMappingURL=accueil.component.js.map