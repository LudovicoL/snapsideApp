import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/interfaces/user';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sidebar-seller-home',
  templateUrl: './sidebar-seller-home.component.html',
  styleUrls: ['./sidebar-seller-home.component.scss'],
})
export class SidebarSellerHomeComponent implements OnInit {

  public appPages = [];
  userid: string;
  public userData: IUser;

  constructor(
    private userService: UserService,
    // tslint:disable-next-line: variable-name
    private _sanitizer: DomSanitizer,
    private data: DataService,
  ) { }

  ngOnInit() {
    this.data.userid.subscribe(data => {
      this.userid = data;
      this.userService.getUserById(this.userid).subscribe(data1 => this.userData = data1);
    });
    this.appPages = [
      {
        title: 'Your ads',
        url: 'user/seller/' + this.userid + '/home/ads-list',
        icon: 'list'
      },
      {
        title: 'Add ads',
        url: 'user/seller/' + this.userid + '/home/new-ad',
        icon: 'add-circle-outline'
      },
      {
        title: 'Reservations',
        url: 'user/seller/' + this.userid + '/home/reservations',
        icon: 'basket'
      },
      {
        title: 'Logout',
        url: '/login',
        icon: 'log-out'
      }
    ];
  }

  getNameUser() {
    //  alert(this.userData['name'])
      // tslint:disable-next-line: no-string-literal
      return this.userData['name'];
  }
  getImageSanitized(base64img) {
    if (base64img === null) {
      return ('assets/utils_imgs/nouserimg.jpg');
    } else if (base64img.lastIndexOf('/9j', 0) === 0) {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64, ' + base64img);
    } else {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + base64img);
    }
  }

}
