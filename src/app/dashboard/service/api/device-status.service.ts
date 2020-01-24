import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceStatus } from '../../../_model/device-status';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../constants/config';
import { DEVICE_STATUS_CODE } from '../../../../constants/deviceStatusCode';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceStatusService {

  private deviceStatus: DeviceStatus[];
  public rangeStatus: Date;
  constructor(private httpClient: HttpClient, private translateService: TranslateService) {
    this.rangeStatus = new Date();
    this.rangeStatus.setDate(new Date().getDate() - 2);
    this.rangeStatus.setHours(23);
    this.rangeStatus.setMinutes(0);
    this.deviceStatus = [];
  }


  getDeviceStatusByUser(userId: string): Observable<DeviceStatus[]> {
    let previousDay: Date = new Date();
    previousDay.setFullYear(this.rangeStatus.getFullYear());
    previousDay.setMonth(this.rangeStatus.getMonth());
    previousDay.setDate(this.rangeStatus.getDate() + 1);
    previousDay.setHours(23);
    previousDay.setMinutes(0);
    return this.httpClient.get<DeviceStatus[]>(CONFIG.URL + `deviceStatus/user/${userId}/${this.rangeStatus.getTime()}/${previousDay.getTime()}`);
  }

  public nextDay(userId: string): void {
    this.rangeStatus.setDate(this.rangeStatus.getDate() + 1);
    this.rangeStatus.setHours(23);
    this.rangeStatus.setMinutes(0);
    this.rangeStatus.setSeconds(0);
    this.callRequest(userId);
  }

  public previousDay(userId: string): void {
    this.rangeStatus.setDate(this.rangeStatus.getDate() - 1);
    this.rangeStatus.setHours(23);
    this.rangeStatus.setMinutes(0);
    this.callRequest(userId);

  }

  getDeviceStatusBySensorRef(sensorRef: string): DeviceStatus[] {
    return this.deviceStatus.filter(_s => _s.sensorRef === sensorRef);
  }

  callRequest(userId: string): void {
    this.getDeviceStatusByUser(userId).subscribe(
      _res => {
        this.deviceStatus = _res;
        console.log(this.deviceStatus);
      }
    )
  }

  getMessageBySensor(sensorRef: string): string {
    const lang = this.translateService.currentLang.toUpperCase();
    const deviceStat: DeviceStatus[] = this.deviceStatus.filter(_ds => _ds.sensorRef === sensorRef);
    if (deviceStat.length > 0) {
      return DEVICE_STATUS_CODE[deviceStat[0].code][lang]['Message'];
    } else {
      return '';
    }
  }


}
