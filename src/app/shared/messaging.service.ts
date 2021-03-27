import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo, mergeMap } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { NotifService } from '../services/notif.service';
import { DataService } from '../services/data.service';
import { serverUrl } from '../globals/globals';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(

    private _notif: NotifService,
    private _data: DataService,
    private http: HttpClient,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
        this.angularFireDB.object('fcmTokens/').update(data)
      })
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  async requestPermission(userId) {
    try {await this.deleteToken()} catch (Error) {}


    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        // this.deleteToken()
        console.log('New token: '+token);
        this._notif.sendNewFirebaseToken(token)
        this.updateFirebaseToken(userId,token).subscribe(data=>{console.log(data)})
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

  async deleteToken() {
    var old;
    old = await this.angularFireMessaging.getToken.toPromise()
    console.log('Old firebase sender token: '+old)
    if(old!==null)
    await this.angularFireMessaging.getToken
      .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
      .toPromise()
  }

  // deleteToken() {
  //   this.angularFireMessaging.getToken
  //     .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
  //     .subscribe(
  //       (token) => { console.log('Deleted!'); },
  //     );
  // }

  updateFirebaseToken(idUser,token){
    return this.http.post(serverUrl+'/user/updateFirebaseToken/'+idUser,{"token": token },{responseType:'text'})

  }
}
