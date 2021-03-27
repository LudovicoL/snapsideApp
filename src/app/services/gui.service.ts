import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuiService {

  private sortAdBySource = new BehaviorSubject('idA'); // default message = '*' for mysql query sake
  sortAdBy = this.sortAdBySource.asObservable();

  private isMobileSource = new BehaviorSubject(''); // default message = '*' for mysql query sake
  isMobile = this.isMobileSource.asObservable();

  private filterByCatSource = new BehaviorSubject('All'); // default message = '*' for mysql query sake
  filterByCat = this.filterByCatSource.asObservable();

  private filterByStatusSource = new BehaviorSubject('All'); // default message = '*' for mysql query sake
  filterByStatus = this.filterByStatusSource.asObservable();

  private clearSource = new BehaviorSubject('0'); // default message = '*' for mysql query sake
  clear = this.clearSource.asObservable();

  private newNotifsSource = new BehaviorSubject('0'); // default message = '*' for mysql query sake
  nnotifs = this.newNotifsSource.asObservable();

  private focusedAdIdSource = new BehaviorSubject(0); // default message = '*' for mysql query sake
  focusedAdId = this.focusedAdIdSource.asObservable();


  constructor() { }

  sendSortBy(message: string) {
    this.sortAdBySource.next(message)
  }

  sendIsMobile(message: string) {
    this.isMobileSource.next(message)
  }

  sendFilterByCat(message: string) {
    this.filterByCatSource.next(message)
  }

  sendFilterByStatus(message: string) {
    this.filterByStatusSource.next(message)
  }

  sendFocusedAdId(message){
    this.focusedAdIdSource.next(message)
  }

   async clearAllNotifs(set){
    this.clearSource.next(set);
    await this.delay(100)
    this.clearSource.next('0');
  }

   async newNotifsBadge(n){
    this.newNotifsSource.next(n);
  }
delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

}
