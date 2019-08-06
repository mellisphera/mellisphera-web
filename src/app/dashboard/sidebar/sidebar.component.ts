/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Component, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { UserloggedService } from "../../userlogged.service";
import { CONFIG } from "../../../constants/config";
import { AuthService } from "../../auth/Service/auth.service";
import { AtokenStorageService } from "../../auth/Service/atoken-storage.service";
import { SidebarService } from '../service/sidebar.service';
import { NavbarComponent } from "../shared/navbar/navbar.component";

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
  private eltOnClick: EventTarget;
  url_sideImg: string;
  /* @ViewChild(NavbarComponent) public navComponent: NavbarComponent; */
  constructor(
    public userService: UserloggedService,
    public router: Router,
    public authService: AuthService,
    public tokenService: AtokenStorageService,
    public sidebarService: SidebarService,
    private renderer: Renderer2
  ) {
    this.eltOnClick = null;
    // this.url_sideImg = CONFIG.URL_FRONT + "assets/logo.png";
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

  focus(id: string) {
    console.log(id);
    if (this.eltOnClick === null ) {
      this.eltOnClick = document.getElementById(id);
      this.renderer.addClass(this.eltOnClick, 'side-active');
    } else {
      this.renderer.removeClass(this.eltOnClick, 'side-active');
      this.eltOnClick = document.getElementById(id);
      this.renderer.addClass(this.eltOnClick, 'side-active');
    }
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


  openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }
}
