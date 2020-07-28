import { BrowserModule } from '@angular/platform-browser';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartupService } from './startup.service';

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    StartupService,
    {
        // Provider for APP_INITIALIZER
        provide: APP_INITIALIZER,
        useFactory: startupServiceFactory,
        deps: [StartupService],
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
