import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AtokenStorageService {

  //TOKEN_KEY
  private roles: Array<string> = [];

  constructor() { }

  getToken() : string {
    window.sessionStorage.removeItem('TOKEN_KEY');
    return window.sessionStorage.getItem("TOKEN_KEY");
  }

  saveToken(token : string){
    return window.sessionStorage.setItem("TOKEN_KEY",token);
  }

  public saveAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem('AUTHORITIES_KEY');
    window.sessionStorage.setItem('AUTHORITIES_KEY', JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
 
    if (sessionStorage.getItem('TOKEN_KEY')) {
      JSON.parse(sessionStorage.getItem('AUTHORITIES_KEY')).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
 
    return this.roles;
  }
}
