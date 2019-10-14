import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { JwtResponse } from '../../_model/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {
    this.resultLoadDataRequest();
    }

  resultLoadDataRequest() {
    this.socket.fromEvent('resRequest').subscribe(
      _res => {
        console.log(_res);
      }
    )
  }

  loadDataRequest(authResponse: JwtResponse) {
    this.socket.emit('loaData', authResponse);
  }
}
