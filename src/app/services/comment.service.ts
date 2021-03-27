import { Injectable } from '@angular/core';

import { serverUrl } from '../globals/globals';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable, forkJoin } from 'rxjs';
import { IAd } from '../interfaces/ad';
import { IHasAttribute } from '../interfaces/hasAttribute';
import { IAttribute } from '../interfaces/attribute';
import { IMedia } from '../interfaces/media';
import { IComment } from '../interfaces/comment';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }


  getUserFromComment(id): Observable<IUser>{
  return this.http.get<IUser>(serverUrl+'/user/getUserFromComment/'+id)
}

  getAllCommentsFromAd(idAd): Observable<IComment[]>{
    return this.http.get<IComment[]>(serverUrl+'/comment/getAllCommentsFromAd/'+idAd)


}
deleteComment(idcomment){
  console.log(idcomment)
  return this.http.get(serverUrl+'/comment/delete/'+idcomment,{responseType: 'text'})
}
saveComment(idcomment,text,ratingSel,userid,idAd){

  return this.http.post(serverUrl+'/comment/save',
  { text: text,
    rating: parseInt(ratingSel),
    user_id_user: parseInt(userid),
    comment_idcomment: parseInt(idcomment),
    ad_id_ad: idAd,
    creationDate: moment().valueOf() },
    {responseType: 'text'})
}

}
