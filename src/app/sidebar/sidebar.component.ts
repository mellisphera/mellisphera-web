import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserloggedService } from '../userlogged.service';
import { CONFIG } from '../../config'
import { AuthService } from '../auth/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: 'user', title: 'User Profile',  icon:'pe-7s-user', class: '' },
    { path: 'table', title: 'Table List',  icon:'pe-7s-note2', class: '' },
    { path: 'typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    { path: 'icons', title: 'Icons',  icon:'pe-7s-science', class: '' },
    { path: 'test', title: 'test',  icon:'pe-7s-map-marker', class: '' },
    { path: 'maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    { path: 'notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' },
    { path: 'upgrade', title: 'Upgrade to PRO',  icon:'pe-7s-rocket', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:['./sidebar.component.scss'],

})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  username;
  url_sideImg : string;
    
  constructor(public router: Router, public authService : AuthService) {
    this.url_sideImg = CONFIG.URL_FRONT+'assets/logo.png'
    //this.username = data.currentUser();
   }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if (window.innerWidth > 991) {
          return false;
      }
      return true;
  };
  goAccueil(){
    this.router.navigate(['home']);
  }

  logout(){
    this.authService.isAuthenticated = false;
    sessionStorage.connexion = "false";
    sessionStorage.removeItem('currentUser');
    console.log(this.authService.connexionStatus);
    console.log(this.authService.isAuthenticated);
    console.log(sessionStorage.getItem("connexion"));
    this.authService.connexionStatus.next(false);
    this.router.navigate(['/login']);
  }
 
}