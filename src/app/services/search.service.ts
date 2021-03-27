import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchContentSource = new BehaviorSubject(''); // default message = '*' for mysql query sake
  searchContent = this.searchContentSource.asObservable();

  constructor() { }

  sendSearchContent(message: string) {
    this.searchContentSource.next(message)
  }

}
