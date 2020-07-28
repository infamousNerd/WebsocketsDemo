import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  public _preFillData: any;

  constructor(private http: HttpClient) { }

  load(): Promise<any> {

    const startupPromise = this.http.get('/api').toPromise();
    startupPromise.then(loadDoc => this._preFillData = loadDoc);

    return startupPromise;
  }

  get preFillData(): any {
      return this._preFillData;
  }
}