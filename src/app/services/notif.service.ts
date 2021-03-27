import { Injectable } from '@angular/core';

import { serverUrl, firebaseServerKey } from '../globals/globals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';


import * as moment from 'moment';
import { INotif } from '../interfaces/notif';


@Injectable({
  providedIn: 'root'
})
export class NotifService {

  private firebaseTokenSource = new BehaviorSubject('token_0'); // default message = '*' for mysql query sake
  firebaseToken = this.firebaseTokenSource.asObservable();

  constructor(private http: HttpClient) { }

  getAllNotifsByUser(id): Observable<INotif[]>{
    return this.http.get<INotif[]>(serverUrl+'/notif/getAllbyUser/'+id)
  }

  clearPush(id)
{
  return this.http.get(serverUrl+'/notif/clearPush/'+id,{responseType: 'text'})
}

clearNotif(id)
{
  return this.http.get(serverUrl+'/notif/clearNotif/'+id,{responseType: 'text'})
}

clearAllByUser(userid)
{
  return this.http.get(serverUrl+'/notif/clearAllByUser/'+userid,{responseType: 'text'})
}

sendNewFirebaseToken(token){
  this.firebaseTokenSource.next(token)
}

sendToastNotif(idRecv,body,title)
{
return this.http.post(serverUrl+'/notif/save',
{
  title: title,
  subject: body,
  status: '',
  cleared: 0,
  date: moment().valueOf(),
  userByUserIdUser: idRecv
},
{responseType: 'text'})

}



firebasePush(token,body,title)
{// "title": "Snapside push notification system: "+title,
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': firebaseServerKey});

  return this.http.post('https://fcm.googleapis.com/fcm/send',{
    "notification":{
      "title": title,
      "body": body,
    },
    "to" : token
  },{headers})
}


updateFirebaseToken(idUser,token){
  return this.http.post(serverUrl+'/user/updateFirebaseToken/'+idUser,{"token": token },{responseType:'text'})

}


}
