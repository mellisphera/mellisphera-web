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
import { AtokenStorageService } from './atoken-storage.service';
var AuthInterceptorService = /** @class */ (function () {
    function AuthInterceptorService(tokenService) {
        this.tokenService = tokenService;
        this.TOKEN_HEADER_KEY = 'Authorization';
    }
    AuthInterceptorService.prototype.intercept = function (req, next) {
        var authReq = req.clone({
            setHeaders: {
                Authorization: "Bearer " + this.tokenService.getToken()
            }
        });
        if (req.url.indexOf("openweathermap") != -1) {
            return next.handle(req);
        }
        else {
            return next.handle(authReq);
        }
    };
    AuthInterceptorService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [AtokenStorageService])
    ], AuthInterceptorService);
    return AuthInterceptorService;
}());
export { AuthInterceptorService };
//authReq = req.clone({ headers: req.headers.set(this.TOKEN_HEADER_KEY, 'token ' + token), withCredentials : true});
//# sourceMappingURL=auth-interceptor.service.js.map