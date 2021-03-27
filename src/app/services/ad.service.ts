import { Injectable } from '@angular/core';

import { serverUrl } from '../globals/globals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable, forkJoin } from 'rxjs';
import { IAd } from '../interfaces/ad';
import { IHasAttribute } from '../interfaces/hasAttribute';
import { IAttribute } from '../interfaces/attribute';
import { IMedia } from '../interfaces/media';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }


  getAdById(id): Observable<IAd>{
  return this.http.get<IAd>(serverUrl+'/ad/getById/'+id)
}

getAllAdsBySeller(id): Observable<IAd[]>{
  return this.http.get<IAd[]>(serverUrl+'/ad/getAllbySeller/'+id)
}

getAllPublished(): Observable<IAd[]>{
  return this.http.get<IAd[]>(serverUrl+'/ad/getAllPublished')
}

getAll(): Observable<IAd[]>{
  return this.http.get<IAd[]>(serverUrl+'/ad/getAll/')
}

getAttributeValues(id): Observable<IHasAttribute[]>{
  return this.http.get<IHasAttribute[]>(serverUrl+'/hasattrib/getAllAttribValuesFromAd/'+id)
}
getAttributeNames(id): Observable<IAttribute[]>{
  return this.http.get<IAttribute[]>(serverUrl+'/attribute/getAllFromAd/'+id)
}

logicDeleteAd(id)
{
  return this.http.get(serverUrl+'/ad/logicDeleteAd/'+id,{responseType: 'text'})
}

approve(id,decision){
  return this.http.post(serverUrl+'/ad/approve/'+id,{approved: decision },{responseType:'text'})

}

deleteAd(id)
{
  return this.http.get(serverUrl+'/ad/deleteAd/'+id,{responseType: 'text'})
}

public getAttributes(idAd): Observable<any[]> {
  let response0 = this.getAttributeNames(idAd)
  let response1 = this.getAttributeValues(idAd)


  // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
  return forkJoin([response0, response1]);
}

createAd(ad:IAd){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''});

let options = { headers: headers };
 return this.http.post(serverUrl+'/ad/save',ad,{responseType:'text'})
}



editAd(ad:IAd){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''});

let options = { headers: headers };
 return this.http.post(serverUrl+'/ad/editAd',ad,{responseType:'text'})
}

getLastBySeller(ad:IAd){
return this.http.get<IAd>(serverUrl+'/ad/getLastBySeller/1')
}


resetAttributes(idAd){
  return this.http.post(serverUrl+'/hasattrib/resetAttributes/'+idAd,{},{responseType:'text'}).toPromise()
}


public saveAttributes(array,newIdAd) {

let msg;
var that=this
array.forEach( async function(entry, index){
  var value=entry.toString()
  console.log(entry.toString())
  if (entry.toString()===''){
    value='Not set'
  }
   const a:IHasAttribute={
    attributeValue: value,
    adByAdIdAd: newIdAd,
    attributeByAttributeIdAttribute: index
  }
 msg=await that.http.post(serverUrl+'/hasattrib/save',a,{responseType:'text'}).toPromise()
console.log(msg)
})

}

}

