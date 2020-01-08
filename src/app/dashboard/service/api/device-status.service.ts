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

  constructor(private httpClient: HttpClient, private translateService: TranslateService) { }


  getDeviceStatusByUser(userId: string): Observable<DeviceStatus[]> {
    return this.httpClient.get<DeviceStatus[]>(CONFIG.URL + `deviceStatus/user/${userId}`);
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
