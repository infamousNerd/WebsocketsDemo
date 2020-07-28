import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor( private socket: Socket) { }

  public socketData = new Observable<any>(observer => {
    this.socket.on('dataDirty', (newData) => {
      observer.next(newData);
    });
  });
}
