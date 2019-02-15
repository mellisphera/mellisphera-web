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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../../../config';
var httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
var SignupService = /** @class */ (function () {
    function SignupService(http) {
        this.http = http;
        this.errSignup = false;
        this.user = {
            id: null,
            createdAt: new Date(),
            login: { username: null, password: null },
            phone: null,
            email: null,
            username: null,
            password: null,
            connexions: null,
            role: null,
            lastConnection: null,
            fullName: null,
            position: null,
            country: null,
            city: null,
            levelUser: null,
        };
    }
    SignupService.prototype.signupUser = function (callback) {
        var _this = this;
        this.http.post(CONFIG.URL + 'api/auth/signup', this.user, httpOptions).subscribe(function () { }, function (err) {
            _this.errSignup = true;
            console.log(err);
            _this.errSignupLabel = err.error.message.split('->')[1];
            console.log(_this.errSignup);
        }, function () {
            if (!_this.errSignup) {
                callback();
            }
        });
    };
    SignupService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], SignupService);
    return SignupService;
}());
export { SignupService };
//# sourceMappingURL=signup.service.js.map