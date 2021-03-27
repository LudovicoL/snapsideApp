import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AdService } from 'src/app/services/ad.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BenefitService } from 'src/app/services/benefit.service';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/interfaces/user';
import { IBenefit } from 'src/app/interfaces/benefit';
import * as moment from 'moment';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {

  userid;
  selectedCustomer: IUser;
  benefits: IBenefit[];

  constructor(
    // tslint:disable-next-line: variable-name
    private _benefits: BenefitService,
    // tslint:disable-next-line: variable-name
    private _data: DataService,
    // tslint:disable-next-line: variable-name
    private _user: UserService,
    // tslint:disable-next-line: variable-name
    private _ad: AdService,
    // tslint:disable-next-line: variable-name
    private _sanitizer: DomSanitizer) {
      this._data.userid.subscribe(data => {this.userid = data; });
    }

  ngOnInit() {
    this._benefits.getAllBenefitsBySeller(this.userid).subscribe(data => {
      this.benefits = data;
      this.benefits.forEach(async entry => {
        // tslint:disable-next-line: prefer-const
        let ad = await this._ad.getAdById(entry.ad_id_ad).toPromise();
        // tslint:disable-next-line: no-string-literal
        entry['adTitle'] = ad.title;
        // tslint:disable-next-line: no-string-literal
        entry['preview'] = this.getImageNotSanitized(ad.files);
        // tslint:disable-next-line: no-string-literal
        entry['idAd'] = ad.idAd;
        // tslint:disable-next-line: prefer-const
        let u = await this._user.getUserById(entry.user_id_user).toPromise();
        // tslint:disable-next-line: no-string-literal
        entry['idCustomer'] = u.id;
        // tslint:disable-next-line: no-string-literal
        entry['customer'] = u.username;
      });
    });
  }

  prettyDate(timestamp) {
    // tslint:disable-next-line: radix
    const t = parseInt(timestamp);
    return moment(t).format('DD-MMM-YYYY');
  }

  async selectCustomer(id) {
    this.selectedCustomer = await this._user.getUserById(id).toPromise();
    // tslint:disable-next-line: no-string-literal
    this.selectedCustomer['userImgSanitized'] = this.getImageSanitized(this.selectedCustomer.userImg);
  }

  getImageSanitized(base64img) {
    if (base64img === null) {
      console.log('getimg');
      // tslint:disable-next-line: quotemark
      return ("assets/utils_imgs/nouserimg.svg");
    } else if (base64img.lastIndexOf('/9j', 0) === 0) {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64, ' + base64img);
    } else {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + base64img);
    }
  }

  getImageNotSanitized(base64img) {
    if (base64img === null) {
        return ('assets/utils_imgs/avatar3.svg');
    } else if (base64img.lastIndexOf('/9j', 0) === 0) {
      return 'data:image/jpg;base64, ' + base64img;
    } else {
        return 'data:image/png;base64, ' + base64img;
    }
  }

}
