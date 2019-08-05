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