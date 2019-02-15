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
import { UserloggedService } from '../userlogged.service';
import { CONFIG } from '../../config';
import { AuthService } from '../auth/Service/auth.service';
import { AtokenStorageService } from '../auth/Service/atoken-storage.service';
export var ROUTES = [
    { path: 'dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: '' },
    { path: 'user', title: 'User Profile', icon: 'pe-7s-user', class: '' },
    { path: 'table', title: 'Table List', icon: 'pe-7s-note2', class: '' },
    { path: 'typography', title: 'Typography', icon: 'pe-7s-news-paper', class: '' },
    { path: 'icons', title: 'Icons', icon: 'pe-7s-science', class: '' },
    { path: 'test', title: 'test', icon: 'pe-7s-map-marker', class: '' },
    { path: 'maps', title: 'Maps', icon: 'pe-7s-map-marker', class: '' },
    { path: 'notifications', title: 'Notifications', icon: 'pe-7s-bell', class: '' },
    { path: 'upgrade', title: 'Upgrade to PRO', icon: 'pe-7s-rocket', class: 'active-pro' },
];
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(userService, router, authService, tokenService) {
        this.userService = userService;
        this.router = router;
        this.authService = authService;
        this.tokenService = tokenService;
        this.url_sideImg = CONFIG.URL_FRONT + 'assets/logo.png';
    }
    SidebarComponent.prototype.ngOnInit = function () {
        this.menuItems = ROUTES.filter(function (menuItem) { return menuItem; });
    };
    SidebarComponent.prototype.isMobileMenu = function () {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    };
    ;
    SidebarComponent.prototype.goAccueil = function () {
        this.router.navigate(['home']);
    };
    SidebarComponent.prototype.logout = function () {
        this.tokenService.signOut();
        this.authService.isAuthenticated = false;
        this.authService.connexionStatus.next(false);
        this.router.navigate(['/login']);
    };
    SidebarComponent = __decorate([
        Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.scss'],
        }),
        __metadata("design:paramtypes", [UserloggedService, Router, AuthService, AtokenStorageService])
    ], SidebarComponent);
    return SidebarComponent;
}());
export { SidebarComponent };
//# sourceMappingURL=sidebar.component.js.map