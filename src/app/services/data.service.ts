import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {


  private useridSource = new BehaviorSubject('default message');
  userid = this.useridSource.asObservable();

  constructor() { }

  sendUserid(message: string) {
    this.useridSource.next(message)
  }

}

