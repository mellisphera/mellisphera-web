import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    if(sessionStorage.getItem("connexion") == "true"){
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
