import { Component, ChangeDetectorRef } from '@angular/core';
import { AdService } from 'src/app/services/ad.service';
import { IAd } from 'src/app/interfaces/ad';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {
  RxSpeechRecognitionService,
  resultList,
  SpeechRecognitionService,
} from '@kamiazya/ngx-speech-recognition';

import { Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GuiService } from 'src/app/services/gui.service';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isBrowser: boolean;
  
  public ads=[]
  public fullAds=[];
  public recentAds=[]
  query=''
    recognition:any;
  matches: String[];
  isRecording = false;
  selectedCat='All'
  unsub;
  message = '';
  c_timeout=null;
  loaded=false;
started=false
items=[]
selectedItem='All'
defaultRecentDays=3
recentDays=3

isaRecentSearch=false
 constructor(private _adService: AdService, private _sanitizer: DomSanitizer,private router: Router, private route: ActivatedRoute,
    private speechRecognition: SpeechRecognition, public service: SpeechRecognitionService, @Inject(PLATFORM_ID) platformId: Object,
              private plt: Platform, private cd: ChangeDetectorRef, private _gui: GuiService, private _category: CategoryService, private _user: UserService) { 
                
                this.isBrowser = isPlatformBrowser(platformId);

                this.service.onstart = (e) => {
                  console.log('onstart');
                };
                this.service.onend = (e) =>{
                  this.started=false
                }

                this.service.onresult = (e) => {
                  this.message = e.results[0].item(0).transcript;
                  console.log('MainComponent:onresult', this.message, e);
                  this.query=this.message;
                  const searchbar = document.querySelector('ion-searchbar');
                  searchbar.value=this.message;
                  this.doSearchFilter();
                  
                  this.cd.detectChanges();
                  this.doSearchFilter();
                  // this.stop()
                  
                };
              
              }
  ngOnInit()
  {
    // this.plt.backButton.subscribeWithPriority(100,()=>{})
    // console.log(this.plt.platforms())
    const searchbar = document.querySelector('ion-searchbar');
    const items = Array.from(document.querySelector('ion-list').children);
    
    
    searchbar.addEventListener('ionInput', handleInput);
    var that=this
    function handleInput(event) {
      
      that.query = event.target.value.toLowerCase();
      that.doSearchFilter()
      
    }
    const refresher = document.getElementById('refresher1');
    refresher.addEventListener('ionRefresh', () => {
     this.c_timeout = setTimeout(() => {
        if(this.c_timeout!=null){
          clearTimeout(this.c_timeout)
        }
        console.log('refresh1')
        this.refresher();
        (<any>refresher).complete();
      }, 1000);
    })

    
    this._gui.sortAdBy.subscribe(data=>{this.sortAds(data)})
    
    // this.getPermission()

this.unsub= this._adService.getAllPublished().subscribe(data=>{this.loaded=false;this.ads=data;
  this._category.getAllItems().subscribe(data=>this.items=data)
    var that=this;
    this.ads.forEach(function(entry,index){
      that._category.getCatFromAd(entry.idAd).subscribe(data => {entry['category'] = data.categoryName; entry.idcategory = data.idcategory;});
      that._category.getItemFromAd(entry.idAd).subscribe(data => {entry['idItem'] = data.idItem; entry['nameItem'] = data.name;});
      that._user.getUserById(entry.user_id_seller).subscribe(data=>{entry['sellerUsername']=data.username})
      entry.files=that.getImageSanitized(entry.files)
    })
    
    this.fullAds=this.ads
    this.recentAds=this.ads.filter(item=>item.creationDate+this.daysToMsec(this.defaultRecentDays)>moment().valueOf()).slice(0)
    console.log(this.fullAds)
    this._gui.filterByCat.subscribe(data=>{this.selectedCat=data; this.doSearchFilter()})
    
    this.loaded=true;
    
  })
  
  }
  isRecentSearch(){
    var recent=this.defaultRecentDays
    console.log(this.query)
    var qq=this.query.toLowerCase()
    var condition = (qq.search('ultim')>-1|| qq.search('last')>-1|| qq.search('nuov')>-1|| qq.toLowerCase().search('new')>-1)&&
    (qq.search('offer')>-1||qq.search('propost')>-1||qq.search('annunci')>-1||qq.search('ad')>-1)
    if (condition){
    var numberPattern = /\d+/g;
    
    if(qq.search('today')>-1 || qq.search('oggi')>-1) {
      recent=1;
      console.log('oggi')
    }
    else if(qq.search('week')>-1 || qq.search('settimana')>-1 ) {
      recent=7;
      console.log('settimana')
    }
    else if(qq.search('month')>-1 || qq.search('mese')>-1 ) {
      recent=30;
    }
    else if(qq.search(numberPattern)>-1 && qq.search('day')>-1 || qq.search(numberPattern)>-1 && qq.search('giorni')>-1 ) {
      recent=(Math.max(parseInt(qq.match(numberPattern)[0]),1))
    }
    else{
      recent=this.defaultRecentDays
    }
    this.recentAds=this.fullAds.filter(item=>item.creationDate+this.daysToMsec(recent)>moment().valueOf()).slice(0)
    this.recentDays=recent
    }
    return condition
  }
  daysToMsec(days){
    return days*86400*1000
  }
async initial(){
    //RESET FILTERING INTERFACE
    await this._gui.sendFilterByCat('All')
    this.query= await ''
    this.selectedItem='All'
    this._gui.sendSortBy('id')
    
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.value=''
    //
this.ngOnInit()

  //  this._adService.getAllPublished().subscribe(data=>{this.ads=data;
    
  //   var that=this;
  //   this.ads.forEach( async function(entry,index){
  //     var data;
  //     entry.files=that.getImageSanitized(entry.files)
  //     data = await that._category.getCatFromAd(entry.idAd).toPromise()
  //     entry['category'] = data.categoryName; entry.idcategory = data.idcategory;

  //     data = await that._category.getItemFromAd(entry.idAd).toPromise()
  //     entry['idItem'] = data.idItem; entry['nameItem'] = data.name;

  //     data = await that._user.getUserById(entry.user_id_seller).toPromise()
  //     entry['sellerUsername']=data.username
      
  //   })
    
  //   this.fullAds=this.ads
  //   this.recentAds=this.ads.filter(item=>item.creationDate+this.daysToMsec(3)>moment().valueOf()).slice(0)


  //   this.doSearchFilter()
    
  // })
  
  }

  doSearchFilter(){
    // this.query=''
    // console.log(this.query)
    // console.log(this.selectedCat)
  this.loaded=false;
  this.isaRecentSearch=this.isRecentSearch()
  if(this.query==='' && this.selectedCat==='All' && this.selectedItem=="All"){
    this.ads=this.fullAds;
  }
  else{
  var that=this;

  let searchedAds = []

  this.fullAds.forEach(function(entry, index) {

    
    if(entry.category!=null || true){
      // console.log(that.selectedCat)
      if (entry.title.toLowerCase().search(that.query.toLowerCase()) > -1 ||
      entry.description.toLowerCase().search(that.query.toLowerCase()) > -1 ||
      entry.category.toLowerCase().search(that.query.toLowerCase()) > -1 ||
      (('#'+entry.idAd.toString()).search(that.query) >-1 && that.query.charAt(0)==='#')||
      (('@'+entry.sellerUsername.toString()).search(that.query) >-1 && that.query.charAt(0)==='@')) {
        // console.log(entry.category)
        if(entry.idcategory.toString() === that.selectedCat.toString() || that.selectedCat==='All' ){

          if(entry.item_id_item==that.selectedItem || that.selectedItem==='All'){

          searchedAds.push(entry);
          }
        
        }
        }
      }
    });
this.ads = searchedAds;

}
this.loaded=true


  }


  getImageSanitized(base64img)

{

  if (base64img===null){

    return ("assets/utils_imgs/noimg.svg")
  }
  else if (base64img.lastIndexOf('/9j',0)===0){
  return this._sanitizer.bypassSecurityTrustResourceUrl("data:image/jpg;base64, " + base64img);
  }
  else {
    return this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + base64img);
    }
}

getImageNotSanitized(base64img)

{

  if (base64img===null){

    return ("assets/utils_imgs/noimg.svg")
  }
  else if (base64img.lastIndexOf('/9j',0)===0){
  return "data:image/jpg;base64, " + base64img;
  }
  else {
    return "data:image/png;base64, " + base64img;
    }
}

filterByItem(event){
  
  this.selectedItem=event.detail.value
  this.doSearchFilter()
  console.log(this.selectedItem)
}

  myAlert(msg)
  {
    alert(msg)
  }
  prettyPrice(price){
    return Number(price).toFixed(2).toString().replace(".",",") // pads the zeros and then replaces . with ,
    }


    refresher()
    {
      this.unsub.unsubscribe()
      this.initial()
    }

// SPEECH RECOGNITION

isIos() {
  return this.plt.is('ios');
}

isAndroid() {
  return this.plt.is('cordova');
}

stopListening() {
  this.speechRecognition.stopListening().then(() => {
    this.isRecording = false;
 
  });
}

getPermission() {
  if(this.plt.is('android')||this.plt.is('ios')){
  this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission();
      }
    });
  }
}

startListening() {
  let options = {
    language: 'it-IT'
    // language: 'en-US'
  }
  this.speechRecognition.startListening(options).subscribe(matches => {
    this.matches = matches;   
    var firstMatch=this.matches[0]
    this.query=firstMatch.toString().toLowerCase()
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.value=this.query;
    this.doSearchFilter()
    this.cd.detectChanges();
  });
  this.isRecording = true;
}



// listen() {
//   this.service
//     .listen()
//     .pipe(resultList)
//     .subscribe((list: SpeechRecognitionResultList) => {
//       this.message = list.item(0).item(0).transcript;
//       console.log('RxComponent:onresult', this.message, list);

//       this.query=this.message;
//       const searchbar = document.querySelector('ion-searchbar');
//       searchbar.value=this.message;
//       this.doSearchFilter();
      
//       this.cd.detectChanges();

//     });
// }
sortAds(by) {
  if (by === 'idA') {
    this.ads.sort((a, b) => a.idAd < b.idAd ? -1 : a.idAd > b.idAd ? 1 : 0);
}
  if (by === 'idD') {
  this.ads.sort((a, b) => a.idAd > b.idAd ? -1 : a.idAd < b.idAd ? 1 : 0);
  }
  if (by === 'title') {
       this.ads.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (by === 'startDate') {
       this.ads.sort((a, b) => a.beginDate < b.beginDate ? -1 : a.beginDate > b.beginDate ? 1 : 0);
  }
  if (by === 'PriceLH') {
    this.ads.sort((a, b) => a.sellPrice < b.sellPrice ? -1 : a.sellPrice > b.sellPrice ? 1 : 0);
  }
  if (by === 'PriceHL') {
    this.ads.sort((a, b) => a.sellPrice > b.sellPrice ? -1 : a.sellPrice < b.sellPrice ? 1 : 0);
}
  if (by === 'mostRecent') {
    this.ads.sort((a, b) => a.creationDate > b.creationDate ? -1 : a.creationDate < b.creationDate ? 1 : 0);
  }
  if (by === 'leastRecent') {
    this.ads.sort((a, b) => a.creationDate < b.creationDate ? -1 : a.creationDate > b.creationDate ? 1 : 0);
  }

}


listen() {
  if(!this.started){
  // this.service.stop()
  // this.service.abort()
  this.service.start()
  this.started=true}
  else{
    // this.stop()
  }
} 


    stop() {
      this.started = false;
      this.service.stop();
    }


}
