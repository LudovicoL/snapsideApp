import { Injectable } from '@angular/core';

import { serverUrl } from '../globals/globals';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/user';
import { Observable, forkJoin } from 'rxjs';
import { IAd } from '../interfaces/ad';
import { IBenefit } from '../interfaces/benefit';
import { AdService } from './ad.service';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  constructor(private http: HttpClient, private _adService: AdService) { }




getBenefitsHaveAd(idAd): Observable<IBenefit[]>{
  return this.http.get<IBenefit[]>(serverUrl+'/benefit/getAllBenefitsAtAd/'+idAd)
}

getAllBenefitsByCustomer(id): Observable<IBenefit[]>{
  return this.http.get<IBenefit[]>(serverUrl+'/benefit/getAllBenefitsByCustomer/'+id)
}

getAllBenefitsBySeller(id): Observable<IBenefit[]>{
  return this.http.get<IBenefit[]>(serverUrl+'/benefit/getAllBenefitsBySeller/'+id)
}

public getAdandItsBenefits(idAd): Observable<any[]> {
  let response0 = this._adService.getAdById(idAd)
  let response1 : Observable<IBenefit[]>= this.http.get<IBenefit[]>(serverUrl+'/benefit/getAllBenefitsAtAd/'+idAd)


  // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
  return forkJoin([response0, response1]);
}


saveBenefit(cin,cout,pchannel,pamount,idAd,customerId){

  return this.http.post(serverUrl+'/benefit/save',
  { 
  idBenefit: null,
  checkinDate: cin,
  checkoutDate: cout,
  interested: 1,
  paymentType: pchannel,
  paidAmount: pamount,
  paid: true,
  user_id_user: customerId,
  ad_id_ad: idAd,
  interested_seller_side: 1 },
    {responseType: 'text'})
}

}

