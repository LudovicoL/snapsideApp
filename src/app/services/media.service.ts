import { Injectable } from '@angular/core';

import { serverUrl } from '../globals/globals';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable, forkJoin } from 'rxjs';
import { IAd } from '../interfaces/ad';
import { IHasAttribute } from '../interfaces/hasAttribute';
import { IAttribute } from '../interfaces/attribute';
import { IMedia } from '../interfaces/media';


@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }


  getAdById(id): Observable<IAd>{
  return this.http.get<IAd>(serverUrl+'/ad/getById/'+id)
}

getAllImagesFromAd(idAd): Observable<IMedia[]>{
  return this.http.get<IMedia[]>(serverUrl+'/media/getAllByAd/'+idAd)
}


addMedia(media:IMedia,newIdAd){


  const m:IMedia={
    mediaName: media.mediaName,
    adByAdIdAd: newIdAd,
    content: media.content.split(',').slice(-1).pop(),
    contentSanitized: null
  }
  return this.http.post(serverUrl+'/media/save',m,{responseType:'text'})

}

async addMediaArrayAsync(media:IMedia[],newIdAd){
let posts=[]
let msg;
var that=this

let index=0
for await (let entry of media ){
  // console.log(entry.content)
  const m:IMedia={
    mediaName: entry.mediaName,
    adByAdIdAd: newIdAd,
    content: entry.content.split(',').slice(-1).pop(),
    contentSanitized: null
  }
   msg = await that.saveMedia(m)
   console.log(msg+' '+index)
   index++
}

// media.forEach( async function(entry, index){
//    const m:IMedia={
//     mediaName: entry.mediaName,
//     adByAdIdAd: newIdAd,
//     content: entry.content.split(',').slice(-1).pop()
//   }
//    msg= await that.saveMedia(m)
//    console.log(msg+' '+index)
// })

}


saveMedia(m){
  return this.http.post(serverUrl+'/media/save',m,{responseType:'text'}).toPromise()
}

resetMedia(idAd){
  return this.http.post(serverUrl+'/media/resetMedia/'+idAd,{},{responseType:'text'}).toPromise()
}

}
