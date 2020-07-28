import { Component, OnInit, ErrorHandler } from '@angular/core';
import { StartupService } from './startup.service';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private startupService: StartupService, private socketService: SocketService) {
  }

  public records = this.startupService.preFillData;
  ngOnInit () {
    this.socketService.socketData.subscribe((newData) => {
      this.records = [].concat(newData);
    }, (error) => {
      alert('An API operation failed' + ' ' + error);
    });
  }
}
