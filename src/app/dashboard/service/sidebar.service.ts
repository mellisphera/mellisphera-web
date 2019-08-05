import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private colorSidebar: any;
  private currentColor: any;
  constructor() {
    this.colorSidebar = [
      { color: '#E5AF2C', text: 'Golden'},
      { color: '#ACC87B', text: 'Green'},
      { color: '#70A8B2', text: 'Blue'}
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