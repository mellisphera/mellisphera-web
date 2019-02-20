var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/Service/auth.service';
var UserloggedService = /** @class */ (function () {
    function UserloggedService(authService) {
        this.authService = authService;
        this.messageSource = new BehaviorSubject('');
        this.currentMessage = this.messageSource.asObservable();
        this.loginDemo = {
            username: "demo",
            password: 'demo'
        };
    }
    UserloggedService.prototype.changeMessage = function (message) {
        this.messageSource.next(message);
    };
    UserloggedService.prototype.currentUser = function () {
        if (sessionStorage.getItem("currentUser")) {
            return JSON.parse(sessionStorage.getItem('currentUser'));
        }
        else {
            sessionStorage.setItem("currentUser", JSON.stringify(this.loginDemo));
            return sessionStorage.getItem("currentUser");
        }
    };
    UserloggedService.prototype.setUser = function (user) {
        window.sessionStorage.removeItem("currentUser");
        window.sessionStorage.setItem("currentUser", user);
    };
    UserloggedService.prototype.getUser = function () {
        return window.sessionStorage.getItem("currentUser");
    };
    UserloggedService.prototype.logOut = function () {
        return localStorage.removeItem('currentUser');
    };
    UserloggedService.prototype.signOut = function () {
        window.sessionStorage.clear();
    };
    UserloggedService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthService])
    ], UserloggedService);
    return UserloggedService;
}());
export { UserloggedService };
//# sourceMappingURL=userlogged.service.js.map