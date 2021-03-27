import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { IMedia } from 'src/app/interfaces/media';
import { MediaService } from 'src/app/services/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { IAd } from 'src/app/interfaces/ad';
import { AdService } from 'src/app/services/ad.service';
import { AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifService } from 'src/app/services/notif.service';
import { UserService } from 'src/app/services/user.service';
import { BenefitService } from 'src/app/services/benefit.service';
import { Location } from '@angular/common';

declare var $: any;
declare var google: any;

@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.component.html',
  styleUrls: ['./edit-ad.component.scss'],
})
export class EditAdComponent implements OnInit {

  public idAd;
  ad: IAd;
  // Info iniziali
  newTitle = '';
  newDescription = '';
  newPrice;
  newAddress = '';

  // Categorie ed Items
  categories = [];
  items = [];
  selectedCatId = '';
  selectedItemId = '';
  properties = [];
  attributeIndexes = [];
  category;
  item;
  public attributes = [];

  // Maps
  latitude: number;
  longitude: number;
  zoom = 10;
  address: string;
  private geoCoder;
  points = [];
  @ViewChild('search') public searchElementRef: ElementRef;
  rooms = [{lat : -7.025253, long: 107.519760}, {lat : -17.025253, long: 17.519760}, {lat : -7.925253, long: 15.519760}];
  start = {lat: 40.351382, long: 18.174981};

  // Pubblicazione o bozza
  publicationStatus = 'Keep as draft';
  publishToggle;

  // Immagini
  image;
  loadedImages: IMedia[] = [];

  // Date
  minDateBegin = moment().format('YYYY-MM-DD');
  minDateEnd = moment().format('YYYY-MM-DD');
  maxDateBegin = moment('3000-01-01').format('YYYY-MM-DD');
  maxDateEnd = moment('3000-01-02').format('YYYY-MM-DD');
  minDate = moment().format('YYYY-MM-DD');
  maxDate = moment().format('YYYY-MM-DD');
  beginDateTStamp = moment().valueOf();
  endDateTStamp = moment().valueOf() + 1;

  userid;

  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    // tslint:disable-next-line: variable-name
    private _category: CategoryService,
    // tslint:disable-next-line: variable-name
    private _item: ItemService,
    // tslint:disable-next-line: variable-name
    private _media: MediaService,
    public platform: Platform,
    private route: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    private _data: DataService,
    // tslint:disable-next-line: variable-name
    private _ad: AdService,
    private router: Router,
    public alertController: AlertController,
    // tslint:disable-next-line: variable-name
    private _sanitizer: DomSanitizer,
    // tslint:disable-next-line: variable-name
    private _notif: NotifService,
    // tslint:disable-next-line: variable-name
    private _user: UserService,
    // tslint:disable-next-line: variable-name
    private _benefits: BenefitService,
    private location: Location
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: variable-name
    const param_idAd: string = this.route.snapshot.queryParamMap.get('idAd');
    this.idAd = param_idAd;

    console.log('IdAD: ' + this.idAd);

    this._data.userid.subscribe(data => this.userid = data);

    // Per GoogleMaps
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // tslint:disable-next-line: new-parens
      this.geoCoder = new google.maps.Geocoder;
      // tslint:disable-next-line: prefer-const
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          // tslint:disable-next-line: prefer-const
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

    this._ad.getAdById(this.idAd).subscribe(data => {
      this.ad = data;
      this.newTitle = this.ad.title;
      this.newDescription = this.ad.description;
      this.newAddress = this.ad.address;
      this.newPrice = this.ad.sellPrice;
      this.beginDateTStamp = this.ad.beginDate;
      this.endDateTStamp = this.ad.endDate;
      this.minDateBegin = moment(this.beginDateTStamp).format('DD/MM/YYYY');
      this.publishToggle = this.ad.approved;
      const toggle = document.getElementById('toggle');
      if (this.publishToggle === -1) {
        this.publicationStatus = 'Keep as draft';
        toggle.setAttribute('checked', 'false');
      } else {
        this.publicationStatus = 'Publish now';
        toggle.setAttribute('checked', 'true');
      }

      if (this.ad.coordinates !== null && this.ad.coordinates.length !== 0 ) {
        this.points = JSON.parse(this.ad.coordinates);
      }
      this._media.getAllImagesFromAd(this.idAd).subscribe(data1 => {
        this.loadedImages.push({
          content: this.ad.files,
          contentSanitized: this.getImageNotSanitized(this.ad.files),
          mediaName : 'LoadedImage',
          adByAdIdAd: null});
        const that = this;
        data1.forEach((entry, index) => {
          const img = entry;
          img.contentSanitized = that.getImageNotSanitized(img.content);
          that.loadedImages.push(img);
        });
      });
    });

    this._category.getCatFromAd(this.idAd).subscribe(data => {this.category = data; });
    this._category.getItemFromAd(this.idAd).subscribe(data => {this.item = data; });




    // Per categorie ed Items
    this.initializeSchema();
    this.getAttributeInfo(this.idAd);
  }

  // IMMAGINI

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      // tslint:disable-next-line: object-literal-shorthand
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // tslint:disable-next-line: prefer-const
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.loadedImages.push({
        mediaName: 'image',
        content: base64Image,
        contentSanitized: this._sanitizer.bypassSecurityTrustResourceUrl(base64Image),
        adByAdIdAd: null
      });
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  reorderImages(event) {
    console.log(event);
    console.log(`Moving point from ${event.detail.from} to ${event.detail.to}`);
    const itemMove = this.loadedImages.splice(event.detail.from, 1)[0];
    this.loadedImages.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

  removeFile(i) {
    this.loadedImages.splice(i, 1);
    console.log(this.loadedImages);
  }

  getImageSanitized(base64img) {
    console.log('getImageSanitized in Edit');
    if (base64img === null) {
      return ('assets/utils_imgs/noimg.svg');
    } else if (base64img.search('data:image') > -1) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(base64img);
    } else if (base64img.lastIndexOf('/9j', 0) === 0) {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64, ' + base64img);
    } else {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + base64img);
    }
  }

  getImageNotSanitized(base64img) {
    if (base64img === null) {
      return ('assets/utils_imgs/noimg.jpg');
    } else if (base64img.search('data:image') > -1) {
      return base64img;
    } else if (base64img.lastIndexOf('/9j', 0) === 0) {
      return 'data:image/jpg;base64, ' + base64img;
    } else {
      return 'data:image/png;base64, ' + base64img;
    }
  }

  // GOOGLE MAPS

  async keyAddress() {
    await this.delay(1000);
    this.getAddress(this.latitude, this.longitude);
  }

  delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  initMapPan() {
    const interval = setInterval(() => {
        if (this.points !== null && this.points.length !== 0) {
          this.start = this.points[0];
          clearInterval(interval);
        }
    }, 500);
  }

  private setCurrentLocation() {
    this.zoom = 10;
    this.latitude = this.start.lat;
    this.longitude = this.start.long;
    // tslint:disable-next-line: new-parens
    this.geoCoder = new google.maps.Geocoder;
    this.getAddress(this.latitude, this.longitude);
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
    console.log('Get dragged coords: ' + this.latitude + ', ' + this.longitude);
  }

  getAddress(latitude, longitude) {
    // tslint:disable-next-line: object-literal-key-quotes
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      // console.log(results);
      // console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  addMapLocation() {
    if (this.points === null) {
      this.points = [];
    }
    this.points.push({address: this.address, lat : this.latitude, long: this.longitude});
    if (this.points.length > 0) {
      this.start = this.points[this.points.length - 1];
    }
  }

  removeMapLocation(i) {
    this.points.splice(i, 1);
    if (this.points.length === 0) {
      this.start = {lat: 40.351382, long: 18.174981};
    }
  }

  toStr(integer) {
    return integer.toString();
  }

  reorderPoints(event) {
    console.log(event);
    console.log(`Moving point from ${event.detail.from} to ${event.detail.to}`);
    const itemMove = this.points.splice(event.detail.from, 1)[0];
    this.points.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }

  // TOGGLE

  changePublicationStatus() {
    const toggle = document.getElementById('toggle');
    // console.log(toggle);
    const toggleStatus = toggle.getAttribute('aria-checked');
    // console.log(toggle.getAttribute('aria-checked'));
    // console.log(typeof toggleStatus);
    // tslint:disable-next-line: triple-equals
    if (toggleStatus == 'true') {
      this.publicationStatus = 'Keep as draft';
      this.publishToggle = -1;
    } else {
      this.publicationStatus = 'Publish now';
      this.publishToggle = this.ad.approved;
    }
  }

  // OTTIENI INFORMAZIONI MEMORIZZATE

  getAttributeInfo(idAd) {
    // tslint:disable-next-line: prefer-const
    let that = this;
    let attributeNames;
    let attributeValues;
    this._ad.getAttributes(idAd).subscribe(responseList => {
      attributeNames = responseList[0];
      attributeValues = responseList[1];
      let mergedAttributes = [];
      // tslint:disable-next-line: only-arrow-functions
      attributeNames.forEach(function(entry, index) {
        // tslint:disable-next-line: prefer-const
        let attribute = {};
        // tslint:disable-next-line: no-string-literal
        attribute['name'] = entry.attributeName;
        // tslint:disable-next-line: no-string-literal
        attribute['value'] = attributeValues[index].attributeValue;
        that.attributeIndexes[entry.idattribute] = attributeValues[index].attributeValue;
        mergedAttributes = mergedAttributes.concat(attribute);

      });
      that.attributes = mergedAttributes;
      // console.log(this.attributes)

    });
  }

  setSelectedCategory(idcat) {
    this.selectedCatId = idcat;
  }

  setSelectedItem(iditem) {
    this.selectedItemId = iditem;
  }

  getItemsByCat(idcat) {
    // tslint:disable-next-line: prefer-const
    let that = this;
    this._item.getAllItems().subscribe(data => {
      that.items = [];
      // tslint:disable-next-line: only-arrow-functions
      data.forEach(function(entry, index) {
        // tslint:disable-next-line: triple-equals
        if (entry.category_idcategory == idcat) {
          that.items.push(entry);
        }
      });
    });
  }

  getAttributesByItem(idItem) {
    this.properties = [];
    // tslint:disable-next-line: prefer-const
    let that = this;
    this._item.getAllAttributes().subscribe(data => {
      // tslint:disable-next-line: only-arrow-functions
      data.forEach(function(entry, index) {
        // tslint:disable-next-line: triple-equals
        if (idItem == entry.itemByItemIdItem) {
        that.properties.push(entry);
        }
      });
    });
  }

  initializeSchema() {
    const that = this;
    this._category.getInitSchema().subscribe(responseList => {
      that.categories = responseList[0];
      that.selectedCatId = that.category.idcategory;
      // tslint:disable-next-line: only-arrow-functions
      responseList[1].forEach(function(entry, index) {
        // tslint:disable-next-line: triple-equals
        if (entry.category_idcategory == that.selectedCatId) {
          that.items.push(entry);
        }
      });
      that.selectedItemId = that.item.idItem;
      // tslint:disable-next-line: only-arrow-functions
      responseList[2].forEach(function(entry, index) {
        // tslint:disable-next-line: triple-equals
        if (that.selectedItemId == entry.itemByItemIdItem) {
          that.properties.push(entry);
        }
      });

    });
  }


  updateSchema() {
    const that = this;
    this._category.getInitSchema().subscribe(responseList => {
      that.properties = [];
      that.items = [];
      // tslint:disable-next-line: only-arrow-functions
      responseList[1].forEach(function(entry, index) {
        // tslint:disable-next-line: triple-equals
        if (entry.category_idcategory == that.selectedCatId) {
          that.items.push(entry);
        }
      });
      that.selectedItemId = that.items[0].idItem;
      // tslint:disable-next-line: only-arrow-functions
      responseList[2].forEach(function(entry, index) {
        // tslint:disable-next-line: triple-equals
        if (that.selectedItemId == entry.itemByItemIdItem) {
          that.properties.push(entry);
        }
      });
    });
  }

  // CALENDARIO

  addEventBegin(event) {
    this.minDateEnd = event.detail.value.split('T')[0];
    console.log(this.minDateEnd);
    // tslint:disable-next-line: prefer-const
    let date = new Date(event.detail.value);
    console.log(date.getTime());
    this.beginDateTStamp = date.getTime();
  }

  addEventEnd(event) {
    this.maxDateBegin = event.detail.value.split('T')[0];
    console.log(this.maxDateBegin);
    // tslint:disable-next-line: prefer-const
    let date = new Date(event.detail.value);
    console.log(date.getTime());
    this.endDateTStamp = date.getTime();
  }

  prettyDate(timestamp: any) {
    // tslint:disable-next-line: radix
    const t = parseInt(timestamp);
    return moment(t).format('DD/MM/YYYY');
  }

  // CREAZIONE AD

  async checkInformationsAd() {
    let ok = true;
    if (this.newTitle === '') {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Title field cannot be empty!',
        buttons: ['OK']
      });
      await alert.present();
      ok = false;
      return;
    }
    if (this.newDescription === '') {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Description field cannot be empty!',
        buttons: ['OK']
      });
      await alert.present();
      ok = false;
      return;
    }
    // tslint:disable-next-line: triple-equals
    if (this.newPrice == undefined) {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Fixed price field cannot be empty!',
        buttons: ['OK']
      });
      await alert.present();
      ok = false;
      return;
    }
    if (this.newAddress === '') {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Address field cannot be empty!',
        buttons: ['OK']
      });
      await alert.present();
      ok = false;
      return;
    }
    if (this.points.length === 0) {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'You must enter at least one address!!',
        buttons: ['OK']
      });
      await alert.present();
      ok = false;
      return;
    }

    if (ok === true) {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm?',
      message: 'Would you confirm?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Publish',
          handler: () => {
            console.log('Confirm Okay');
            this.editAd();
          }
        }
      ]
    });
    await alert.present();
  }

  editAd() {
    // console.log(this.newTitle);
    // console.log(this.attributeIndexes);
    // if (this.newTitle.length === 0) {
    //   this.newTitle = 'No title';
    // }
    // if (this.newDescription.length === 0) {
    //     this.newDescription = 'No description';
    // }
    // // tslint:disable-next-line: triple-equals
    // if (this.newPrice == null || this.newPrice == '') {
    //   this.newPrice = 0;
    // }
    let f;
    f = this.loadedImages.slice(0);
    if (this.loadedImages.length === 0 || this.loadedImages[0].content == null) {
      f = null;
    } else {
      console.log(f);
      // f=f[0].content
      // .split(',').slice(-1).pop()
      f = f[0].content.split(',').slice(-1).pop();
    }
    // tslint:disable-next-line: prefer-const
    let newAd: IAd = {
      idAd: this.ad.idAd,
      title: this.newTitle,
      description: this.newDescription,
      sellPrice: Math.abs(Math.max(this.newPrice, 0)).toString(),
      address: this.newAddress,
      coordinates: JSON.stringify(this.points),
      approved: this.publishToggle,
      user_id_seller: this.userid,
      beginDate: this.beginDateTStamp,
      endDate: this.endDateTStamp + (86400 * 1000), // 86400=seconds in a day,
      // tslint:disable-next-line: radix
      item_id_item: parseInt(this.selectedItemId),
      adType: 'AD_TYPE_HARDCODED',
      // files:"iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAE0lEQVR42mPcztD3nwENMNJAEACrnQtaam/wngAAAABJRU5ErkJggg==",
      files: f,
      deleted: null,
      lastEdit: moment().valueOf(),
      creationDate: moment().valueOf(),
      active: true,
    };
    // tslint:disable-next-line: prefer-const
    let that = this;
    this._ad.editAd(newAd).subscribe(data0 => {
      console.log(data0);
      this._media.resetMedia(this.idAd);
      let mediaToLoad = [];
      mediaToLoad = that.loadedImages.slice(0);
      mediaToLoad.shift();
      that._media.addMediaArrayAsync(mediaToLoad, this.ad.idAd);
      that._ad.resetAttributes(this.idAd);
      that._ad.saveAttributes(that.attributeIndexes, this.ad.idAd);
      this.presentAlertConfirm();
      this.router.navigate(['../ads-list'], { relativeTo: this.route });
      // this._media.addMedia(this.loadedImages,newIdAd).subscribe(data=>{console.log(data)})
    });
    this._benefits.getBenefitsHaveAd(this.idAd).subscribe(data => {
      // console.log('notif sent')
      // tslint:disable-next-line: prefer-const
      let that1 = this;
      let customers = [];
      // tslint:disable-next-line: only-arrow-functions
      data.forEach(async function(entry, index) {
        customers.push(entry.user_id_user);
      });
      customers = customers.filter(
        (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
      ).slice(0);
      console.log(customers);
      // tslint:disable-next-line: only-arrow-functions
      customers.forEach(async function(entry, index) {
        // tslint:disable-next-line: prefer-const
        let title = 'Ad ' + that1.ad.title + '\' modified';
        // tslint:disable-next-line: prefer-const
        let subject = 'The ad \'' + that1.ad.title + '\' (#' + that1.ad.idAd + ') that you purchased has been modified by seller.';
        that1._user.getUserById(entry).subscribe(data1 => {
          console.log(data1);
          that1._notif.firebasePush(data1.token, subject, title).subscribe(data2 => console.log(data2));
        });
        await that1._notif.sendToastNotif(entry, subject, title).toPromise();
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Successful!',
      message: 'Ad edited!',
      buttons: ['OK']
    });

    await alert.present();
  }

  async goBack() {
    const alert = await this.alertController.create({
      header: 'Discard changes?',
      message: 'Would you discard changes?',
      buttons: [
        {
          text: 'Keep going',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Discard',
          handler: () => {
            this.location.back();
          }
        }
      ]
    });
    await alert.present();
  }

}
