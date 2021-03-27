import { Injectable } from '@angular/core';

import { serverUrl } from '../globals/globals';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable } from 'rxjs';
import { IAd } from '../interfaces/ad';
import { IAttribute } from '../interfaces/attribute';
import { IItem } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<IItem[]>{
    return this.http.get<IItem[]>(serverUrl+'/item/getAll/')
  }


getAllAttributes(): Observable<IAttribute[]>{
  return this.http.get<IAttribute[]>(serverUrl+'/attribute/getAll/')
}

}

