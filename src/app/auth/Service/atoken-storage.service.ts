import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CONFIG } from '../../../config';
import { RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AtokenStorageService {

  //TOKEN_KEY
  private roles: Array<string> = [];

  constructor(private httpClient : HttpClient) { }

  getToken() : string {
    return window.sessionStorage.getItem("TOKEN_KEY");
  }

  saveToken(token : string){
    window.sessionStorage.removeItem('TOKEN_KEY');
    window.sessionStorage.setItem("TOKEN_KEY",token);
  }

  public saveAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem('AUTHORITIES_KEY');
    window.sessionStorage.setItem('AUTHORITIES_KEY', JSON.stringify(authorities));
    this.getAuthorities();
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

  signOut() {
    window.sessionStorage.clear();
  }

  getAdmin(){
    return this.roles.indexOf("ROLE_ADMIN")!=-1;
  }

  checkAuthorities(role : string) : Boolean{
    return this.getAuthorities().indexOf(role)!=-1 ? true : false;
  }


  testRequete(){
    this.httpClient.get<String>("http://195.154.179.102/api/test/pm"
    ).subscribe(
      (data)=>{
        console.log(data);
      },
      (err)=>{
        console.log(err);
      }
    )
  }

}
