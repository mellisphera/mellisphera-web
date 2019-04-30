import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserloggedService } from "../../userlogged.service";
import { CONFIG } from "../../../config";
import { AuthService } from "../../auth/Service/auth.service";
import { AtokenStorageService } from "../../auth/Service/atoken-storage.service";
import { SidebarService } from '../service/sidebar.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "dashboard", title: "Dashboard", icon: "pe-7s-graph", class: "" },
  { path: "user", title: "User Profile", icon: "pe-7s-user", class: "" },
  { path: "table", title: "Table List", icon: "pe-7s-note2", class: "" },
  {
    path: "typography",
    title: "Typography",
    icon: "pe-7s-news-paper",
    class: ""
  },
  { path: "icons", title: "Icons", icon: "pe-7s-science", class: "" },
  { path: "test", title: "test", icon: "pe-7s-map-marker", class: "" },
  { path: "maps", title: "Maps", icon: "pe-7s-map-marker", class: "" },
  {
    path: "notifications",
    title: "Notifications",
    icon: "pe-7s-bell",
    class: ""
  },
  {
    path: "upgrade",
    title: "Upgrade to PRO",
    icon: "pe-7s-rocket",
    class: "active-pro"
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  username;
  url_sideImg: string;

  constructor(
    public userService: UserloggedService,
    public router: Router,
    public authService: AuthService,
    public tokenService: AtokenStorageService,
    public sidebarService: SidebarService
  ) {
    this.url_sideImg = CONFIG.URL_FRONT + "assets/logo.png";
  }

  ngOnInit() {
/*     this.menuItems = ROUTES.filter(menuItem => menuItem);
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('nav-open'); */
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
  goAccueil() {
    this.router.navigate(["home"]);
  }

  hideSidebar() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('nav-open');
  }

  logout() {
    this.tokenService.signOut();
    this.authService.isAuthenticated = false;
    this.authService.connexionStatus.next(false);
    this.router.navigate(["/login"]);
  }
}
