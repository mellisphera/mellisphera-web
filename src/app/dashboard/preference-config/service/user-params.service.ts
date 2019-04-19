import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserParamsService {

  
  private formatDate: string;
  constructor() {
    this.formatDate = 'medium';
  }

  /**
   *
   *
   * @param {string} datePipe
   * @memberof UserService
   */
  setFormatDate(datePipe: string): void {
    this.formatDate = datePipe;
  }

  /**
   *
   *
   * @returns {string}
   * @memberof UserService
   */
  getFormatDate(): string {
    return this.formatDate;
  }
}
