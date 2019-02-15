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
import { HttpClient } from '@angular/common/http';
var AtokenStorageService = /** @class */ (function () {
    function AtokenStorageService(httpClient) {
        this.httpClient = httpClient;
        //TOKEN_KEY
        this.roles = [];
    }
    AtokenStorageService.prototype.getToken = function () {
        return window.sessionStorage.getItem("TOKEN_KEY");
    };
    AtokenStorageService.prototype.saveToken = function (token) {
        window.sessionStorage.removeItem('TOKEN_KEY');
        window.sessionStorage.setItem("TOKEN_KEY", token);
    };
    AtokenStorageService.prototype.saveAuthorities = function (authorities) {
        window.sessionStorage.removeItem('AUTHORITIES_KEY');
        window.sessionStorage.setItem('AUTHORITIES_KEY', JSON.stringify(authorities));
        this.getAuthorities();
    };
    AtokenStorageService.prototype.getAuthorities = function () {
        var _this = this;
        this.roles = [];
        if (sessionStorage.getItem('TOKEN_KEY')) {
            JSON.parse(sessionStorage.getItem('AUTHORITIES_KEY')).forEach(function (authority) {
                _this.roles.push(authority.authority);
            });
        }
        return this.roles;
    };
    AtokenStorageService.prototype.signOut = function () {
        window.sessionStorage.clear();
    };
    AtokenStorageService.prototype.getAdmin = function () {
        return this.roles.indexOf("ROLE_ADMIN") != -1;
    };
    AtokenStorageService.prototype.checkAuthorities = function (role) {
        return this.getAuthorities().indexOf(role) != -1 ? true : false;
    };
    AtokenStorageService.prototype.testRequete = function () {
        this.httpClient.get("http://195.154.179.102/api/test/pm").subscribe(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    AtokenStorageService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], AtokenStorageService);
    return AtokenStorageService;
}());
export { AtokenStorageService };
//# sourceMappingURL=atoken-storage.service.js.map