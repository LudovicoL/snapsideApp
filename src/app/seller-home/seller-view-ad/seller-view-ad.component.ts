import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from 'src/app/services/ad.service';
import { CategoryService } from 'src/app/services/category.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GuiService } from 'src/app/services/gui.service';
import { MediaService } from 'src/app/services/media.service';
import * as moment from 'moment';
import { BenefitService } from 'src/app/services/benefit.service';
import { IBenefit } from 'src/app/interfaces/benefit';
import { CommentService } from 'src/app/services/comment.service';
import { ModalController } from '@ionic/angular';
import { SellerCommentModalComponent } from './seller-comment-modal/seller-comment-modal.component';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { NotifService } from 'src/app/services/notif.service';
import { IUser } from 'src/app/interfaces/user';
import { Location } from '@angular/common';


@Component({
  selector: 'app-seller-view-ad',
  templateUrl: './seller-view-ad.component.html',
  styleUrls: ['./seller-view-ad.component.scss'],
})
export class SellerViewAdComponent implements OnInit {

  idAd: string;
  dateNow: Date;
  mobile = false;
  public ad;
  public category;
  public item;
  public isCollapsed = false;
  public attributes = [];
  nImgsArray = [];
  public media;
  displayMedia = [];
  frontImg;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  start = {lat: 40.351382, long: 18.174981};
  parsedPoints = [];
  benefits: IBenefit[];
  public comments = [];
  public selectedCommenter;
  maxRating = 5;
  maxRatingStars = [];
  mainCommentText = '';
  ratingSel = '-1';
  public commentIndexes = [];
  public cc = [];
  dataReturned: any;
  selectedCommentID = null;
  selectedCommentText = null;
  userid;
  // tslint:disable-next-line: variable-name
  c_timeout = null;
  showMoreDescription = false;

  constructor(
    private route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _adService: AdService,
    // tslint:disable-next-line: variable-name
    private _catService: CategoryService,
    // tslint:disable-next-line: variable-name
    private _sanitizer: DomSanitizer,
    // tslint:disable-next-line: variable-name
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    // tslint:disable-next-line: variable-name
    private _media: MediaService,
    // tslint:disable-next-line: variable-name
    private _benefits: BenefitService,
    // tslint:disable-next-line: variable-name
    private _comment: CommentService,
    // tslint:disable-next-line: variable-name
    private _data: DataService,
    public modalController: ModalController,
    // tslint:disable-next-line: variable-name
    private _user: UserService,
    // tslint:disable-next-line: variable-name
    private _notif: NotifService,
    private location: Location
  ) { }

  ngOnInit() {

    const refresher = document.getElementById('refresher-view');
    refresher.addEventListener('ionRefresh',  () => {
     this.c_timeout = setTimeout( () => {

        this.refresher();
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        (<any> refresher).complete();

      }, 1000);
    });
    // tslint:disable-next-line: variable-name
    const param_idAd: string = this.route.snapshot.queryParamMap.get('idAd');
    this.idAd = param_idAd;
    this._data.userid.subscribe(data => this.userid = data);

    this._adService.getAdById(this.idAd).subscribe(data => {
      this.ad = data;
      this.gatherCoordinates();
      this._benefits.getBenefitsHaveAd(this.idAd).subscribe(data1 => { this.benefits = data1; });
      // tslint:disable-next-line: no-string-literal
      this._user.getUserById(this.ad.user_id_seller).subscribe(data1 => { this.ad['sellerUsername'] = data1.username; });
    });
    this._catService.getCatFromAd(this.idAd).subscribe(data => { this.category = data; });
    this._catService.getItemFromAd(this.idAd).subscribe(data => { this.item = data; });
    this.getAttributeInfo(this.idAd);
    this._media.getAllImagesFromAd(this.idAd).subscribe(data => {
      this.media = data;
      this.nImgsArray = Array(data.length + 1).fill(0).map((x, i) => i);
      this.nImgsArray.shift();
      // console.log(this.nImgsArray);
      this.displayMedia = [];
      this.media.forEach((img, index) => {
        this.displayMedia.push({content: this.getImageSanitized(img.content), mediaName: img.mediaName});
      });
      // console.log(this.displayMedia);
    });

    this.ratingSel = '-1';
    this.maxRatingStars = Array(this.maxRating + 1).fill(0).map((x, i) => i);
    this.maxRatingStars.shift();
    const that = this;
    this._comment.getAllCommentsFromAd(this.idAd).subscribe(data => {
      this.comments = data;
      // console.log(this.comments);
      // tslint:disable-next-line: only-arrow-functions
      this.comments.forEach(function(entry, index) {
        that._comment.getUserFromComment(entry.idComment).subscribe(user => {
          // tslint:disable-next-line: no-string-literal
          entry['username'] = user.username;
          // tslint:disable-next-line: no-string-literal
          entry['uimage'] = user.userImg;
        });
      });
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.c_timeout != null) {
      clearTimeout(this.c_timeout);
    }
  }

  refresher() {
    this.ngOnInit();
  }

  toggleShowMoreDescription() {
    this.showMoreDescription = !this.showMoreDescription;
  }

  getAttributeInfo(idAd) {
    const that = this;
    let attributeNames;
    let attributeValues;
    this._adService.getAttributes(idAd).subscribe(responseList => {
      attributeNames = responseList[0];
      attributeValues = responseList[1];
      let mergedAttributes = [];
      // tslint:disable-next-line: only-arrow-functions
      attributeNames.forEach(function(entry, index) {
        // console.log(entry.attributeName);
        // tslint:disable-next-line: prefer-const
        let attribute = {};
        // tslint:disable-next-line: no-string-literal
        attribute['name'] = entry.attributeName;
        // tslint:disable-next-line: no-string-literal
        attribute['value'] = attributeValues[index].attributeValue;
        mergedAttributes = mergedAttributes.concat(attribute);
      });
      that.attributes = mergedAttributes;
    });
  }

  prettyPrice(price) {
    return Number(price).toFixed(2).toString().replace('.', ','); // pads the zeros and then replaces . with ,
  }

  getImageSanitized(base64img) {
    if (base64img === null) {
        return ('assets/utils_imgs/noimg.svg');
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

  prettyDateTime(timestamp) {
    // tslint:disable-next-line: radix
    const t = parseInt(timestamp);
    return moment(t).format('DD-MMM-YYYY HH:mm:ss');
  }

  prettyDate(timestamp) {
    // tslint:disable-next-line: radix
    const t = parseInt(timestamp);
    return moment(t).format('DD-MMM-YYYY');
  }

  gatherCoordinates() {
    this.parsedPoints = JSON.parse(this.ad.coordinates);
    if (this.parsedPoints !== null && this.parsedPoints.length !== 0) {
         this.initMapPan();
    }
  }

  initMapPan() {
    this.start = this.parsedPoints[0];
  }

  toStr(integer) {
    return integer.toString();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: SellerCommentModalComponent,
      componentProps: {
        "paramID": this.selectedCommentID,
        "commenterUname": this.selectedCommenter,
        "paramTitle": "Answer to comment",
        "text": this.selectedCommentText,
        "idAd": this.idAd
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
      this.ngOnInit();
    });
    return await modal.present();
  }

  setSelectedComment(id, text, commenterUname) {
    this.selectedCommentID = id;
    this.selectedCommentText = text;
    this.selectedCommenter = commenterUname;
  }

  saveComment(idcomment, text, idAd) {
    console.log(this.userid, this.ratingSel);
    this._comment.saveComment(idcomment, text, this.ratingSel, this.userid, idAd)
      .subscribe(res => {console.log(res); this.ngOnInit(); });
  }

  setRating(value) {
    this.ratingSel = value;
    // console.log(this.ratingSel);
  }

  goBack() {
    this.location.back();
  }

}
