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
import { Router } from '@angular/router';
import { UserloggedService } from '../../userlogged.service';
import { AuthService } from '../Service/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SignupService } from '../../admin/service/signup.service';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, router, data, authService, signupService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.data = data;
        this.authService = authService;
        this.signupService = signupService;
        this.loginErrorMsg = false;
        this.formLogin = true;
        this.myform = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.innitForm();
        if (this.authService.isAuthenticated) {
            this.router.navigate(['/home']);
        }
        this.myform = new FormGroup({
            username: new FormControl(''),
            password: new FormControl('')
        });
    };
    LoginComponent.prototype.innitForm = function () {
        this.signupForm = this.formBuilder.group({
            'email': [null, Validators.required],
            'username': [null, Validators.required],
            'password': [null, Validators.compose([
                    ,
                    Validators.minLength(6),
                    Validators.required
                ])]
        });
    };
    LoginComponent.prototype.receiveMessage = function ($event) {
        this.message = $event;
    };
    LoginComponent.prototype.signup = function () {
        var _this = this;
        if (this.signupForm.valid) {
            var data = this.signupForm.value;
            this.signupService.user = data;
            this.signupService.user.role = new Array("***REMOVED***");
            console.log(this.signupService.user);
            this.signupService.user.createdAt = new Date();
            this.signupService.signupUser(function () {
                _this.authService.login.username = _this.signupService.user.username;
                _this.authService.login.password = _this.signupService.user.password;
                _this.authService.signIn();
                _this.success = true;
                _this.innitForm();
                setTimeout(function () {
                    _this.success = false;
                }, 1000);
            });
        }
    };
    LoginComponent.prototype.verifLogin = function () {
        this.authService.signIn();
    };
    LoginComponent.prototype.currentUser = function () {
        return JSON.parse(localStorage.getItem('currentUser'));
    };
    LoginComponent.prototype.goToDashboard = function () {
    };
    LoginComponent.prototype.test = function () {
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            Router,
            UserloggedService,
            AuthService,
            SignupService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map