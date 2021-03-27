import { Injectable } from '@angular/core';

import { serverUrl } from '../globals/globals';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable, forkJoin } from 'rxjs';
import { IAd } from '../interfaces/ad';
import { ICategory } from '../interfaces/category';
import { IItem } from '../interfaces/item';
import { IAttribute } from '../interfaces/attribute';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }



getAllCat(): Observable<ICategory[]>{
  return this.http.get<ICategory[]>(serverUrl+'/category/getAll/')
}

getCatFromAd(idAd): Observable<ICategory>{
  return this.http.get<ICategory>(serverUrl+'/category/getCategoryFromAd/'+idAd)
}

getItemFromAd(idAd): Observable<IItem>{
  return this.http.get<IItem>(serverUrl+'/item/getItemFromAd/'+idAd)
}

getAllItems(): Observable<IItem[]>{
  return this.http.get<IItem[]>(serverUrl+'/item/getAll/')
}


getAllAttributes(): Observable<IAttribute[]>{
return this.http.get<IAttribute[]>(serverUrl+'/attribute/getAll/')
}

public getInitSchema(): Observable<any[]> {
  let response0 = this.getAllCat()
  let response1 = this.getAllItems()
  let response2 = this.getAllAttributes()


  // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
  return forkJoin([response0, response1, response2]);
}

}

