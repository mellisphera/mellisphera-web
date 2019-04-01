import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private colorSidebar: any;
  private currentColor: any;
  constructor() {
    this.colorSidebar = [
      { color: '#D53838', text: 'Red'},
      { color: '#59B53D', text: 'Green'},
      { color: '#3F7DE8', text: 'Blue'}
  ];
  this.currentColor = this.colorSidebar[1];
  }

  getCurrentColor() {
    return this.currentColor;
  }

  getColors() {
    return this.colorSidebar;
  }

  setCurrentColor(color: any) {
    this.currentColor = color;
  }
}