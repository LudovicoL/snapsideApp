import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private _teacherMessageSource = new Subject<string>();
  teacherMessage$ = this._teacherMessageSource.asObservable();

  private _userIDSource = new Subject<string>();
  userID$ = this._userIDSource.asObservable();

  private _userNameSource = new Subject<string>();
  name$ = this._userNameSource.asObservable();


  constructor() { }

  sendMessage(message: string) {
    this._teacherMessageSource.next(message);
  }

  sendUserID(ID: string) {
    this._userIDSource.next(ID);
  }
  sendName(name: string) {
    this._userNameSource.next(name);
  }
}
