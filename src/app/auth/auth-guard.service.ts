import { AtokenStorageService } from './Service/atoken-storage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './Service/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private authService: AuthService,
    public tokenService : AtokenStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,): Observable<boolean> | boolean {

    if(this.tokenService.getToken()){
      return true;
    }
    this.router.navigate(['/login']);
  }
  canLoad(route: Route): boolean {
    if(sessionStorage.getItem("connexion") == "true"){
      return true;
    }
    this.router.navigate(['/login']);
  }
}
