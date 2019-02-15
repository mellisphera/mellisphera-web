var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { AtokenStorageService } from './atoken-storage.service';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var AuthService = /** @class */ (function () {
    function AuthService(router, http, tokenService) {
        this.router = router;
        this.http = http;
        this.tokenService = tokenService;
        this.connexionStatus = new BehaviorSubject(false);
        this.showNavBarEmitter = new EventEmitter();
        this.login = { username: "", password: "" };
        this.errLogin = false;
        this.isAuthenticated = false;
    }
    AuthService.prototype.signIn = function () {
        var _this = this;
        this.loginObs = this.http.post(CONFIG.URL + 'api/auth/signin', this.login, httpOptions);
        this.loginObs.subscribe(function (data) {
            _this.jwtReponse = data;
            _this.tokenService.saveToken(_this.jwtReponse.accessToken);
            _this.tokenService.saveAuthorities(_this.jwtReponse.authorities);
            _this.login.username = _this.jwtReponse.username;
            _this.connexionStatus.next(data);
            _this.isAuthenticated = _this.tokenService.getToken() ? true : false;
            sessionStorage.setItem("connexion", JSON.stringify(_this.isAuthenticated));
            _this.errLogin = !_this.isAuthenticated;
            console.log(sessionStorage.getItem("connexion") == "true");
            sessionStorage.setItem("currentUser", JSON.stringify(_this.login));
            _this.router.navigate(['/home']);
        }, function (err) {
            _this.errLogin = true;
            console.log(err);
        });
    };
    AuthService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Router,
            HttpClient,
            AtokenStorageService])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
/*

### AVEC TOKEN ###
this.jwtReponse = data;
this.tokenService.saveToken(this.jwtReponse.accessToken);
this.tokenService.saveAuthorities(this.jwtReponse.authorities);
this.login.username = this.jwtReponse.username
this.connexionStatus.next(data);
this.isAuthenticated = window.sessionStorage.getItem("TOKEN_KEY") ? true : false;
sessionStorage.setItem("connexion",JSON.stringify(this.isAuthenticated));
this.errLogin = !this.isAuthenticated;
if(this.isAuthenticated){
  this.lastConnection = new Date(data);
  console.log(sessionStorage.getItem("connexion") == "true");
  
  sessionStorage.setItem("currentUser",JSON.stringify(this.login));
  this.router.navigate(['/position-Ruche']);
}







### SANS TOKEN ###

console.log(data);
this.user = data;
//this.login = this.user.login;
console.log(this.user);
this.connexionStatus.next(data);
this.isAuthenticated = this.user.id != null? true : false;
sessionStorage.setItem("connexion",JSON.stringify(this.isAuthenticated));
console.log(this.isAuthenticated);
this.errLogin = !this.isAuthenticated;
console.log(!this.isAuthenticated);
if(this.isAuthenticated){
  this.lastConnection = new Date(data);
  console.log(sessionStorage.getItem("connexion") == "true");
  
  sessionStorage.setItem("currentUser",JSON.stringify(this.user.login));
  this.router.navigate(['/position-Ruche']);




*/
//# sourceMappingURL=auth.service.js.map