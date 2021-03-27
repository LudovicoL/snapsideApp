import { Component, OnInit } from '@angular/core';
import { AdService } from 'src/app/services/ad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SearchService } from 'src/app/services/search.service';
import { GuiService } from 'src/app/services/gui.service';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { Location} from '@angular/common';

@Component({
  selector: 'app-ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss'],
})
export class AdsListComponent implements OnInit {

  public ads = [];
  public fullAds = [];
  private loaded = false;
  public userid: string;

  constructor(
    private userService: UserService,
    // tslint:disable-next-line: variable-name
    private _adService: AdService,
    private data: DataService,
    // tslint:disable-next-line: variable-name
    private _category: CategoryService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private platform: Platform, private routerx: Router, private location: Location
  ) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(100,()=>{
      if(!(this.routerx.url.search('ads-list')>-1))
      this.location.back()
    })

    var that = this;
    this.data.userid.subscribe(data => {
      this.userid = data;
    });
    this._adService.getAllAdsBySeller(this.userid)
      .subscribe(data => {
        this.loaded = false;
        this.ads = data;
        this.ads.forEach(function(entry, index) {
          that._category.getCatFromAd(entry.idAd).subscribe(data1 => {
            // tslint:disable-next-line: no-string-literal
            entry['category'] = data1.categoryName;
            // tslint:disable-next-line: no-string-literal
            entry['idcategory'] = data1.idcategory;
          });
          that._category.getItemFromAd(entry.idAd).subscribe(data2 => {
            // tslint:disable-next-line: no-string-literal
            entry['idItem'] = data2.idItem;
            // tslint:disable-next-line: no-string-literal
            entry['nameItem'] = data2.name;
          });
          entry.files = that.getImageNotSanitized(entry.files);
          that.fullAds = that.ads;
        });
      },
    (error) => {alert(error); this.loaded = false; },
    () => this.loaded = true);
  }
  getImageNotSanitized(base64img) {
    if (base64img === null) {
      return ('assets/utils_imgs/noimg.jpg');
    } else if (base64img.lastIndexOf('/9j', 0) === 0) {
      return 'data:image/jpg;base64, ' + base64img;
    } else {
      return 'data:image/png;base64, ' + base64img;
    }
  }
  onSearchTerm(ev: CustomEvent) {
    this.ads = this.fullAds;
    const val = ev.detail.value;
    if (val && val.trim() !== '') {
      this.ads = this.ads.filter(term => {
        return term.title.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }
  }
  async presentActionSheet(ad) {
    const actionSheet = await this.actionSheetController.create({
      header: ad.title,
      buttons: [
        {
          text: 'View detail',
          icon: 'eye',
          handler: () => {
            // this.router.navigate(['../view-ad/' + ad.idAd], { relativeTo: this.route });
            this.router.navigate(['../seller-view-ad'], { queryParams: {idAd: ad.idAd}, relativeTo: this.route});
          }
        },
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            // this.router.navigate(['../edit-ad/' + ad.idAd], { relativeTo: this.route });
            this.router.navigate(['../edit-ad'], { queryParams: {idAd: ad.idAd}, relativeTo: this.route});
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.presentAlert(ad);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlert(ad) {
    const alert = await this.alertController.create({
      header: 'Delete ad: ' + ad.title,
      message: 'Are you sure you want to delete this ad?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Yes, delete it',
          handler: () => {
            console.log('Confirm Okay');
            this.logicDeleteAd(ad.idAd);
            this.ngOnInit();
          }
        }
      ]
    });
    await alert.present();
  }

  logicDeleteAd(id) {
    console.log(id);
    this._adService.logicDeleteAd(id).subscribe(data => {
      console.log(data);
      this.ngOnInit();
    });
  }

  prettyPrice(price){
    return Number(price).toFixed(2).toString().replace(".",","); // pads the zeros and then replaces . with ,
  }

}
