import { Component } from '@angular/core';
import { AdService } from '../services/ad.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public ads;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Customer',
      url: '/customer',
      icon: 'home'
    },
  ];
  constructor(private _adService: AdService, private _sanitizer: DomSanitizer) {}

  ngOnInit(){
    this._adService.getAllPublished().subscribe(data=>{this.ads=data;
      var that=this;
      this.ads.forEach(function(entry,index){

        entry.files=that.getImageSanitized(entry.files)
      })})
    
    
    }
  

 myAlert(msg)
 {alert(msg)}


 getImageSanitized(base64img)

 {
 
   if (base64img===null){
 
     return ("assets/utils_imgs/avatar3.svg")
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
 
     return ("assets/utils_imgs/avatar3.svg")
   }
   else if (base64img.lastIndexOf('/9j',0)===0){
   return "data:image/jpg;base64, " + base64img;
   }
   else {
     return "data:image/png;base64, " + base64img;
     }
 }


 prettyPrice(price){
  return Number(price).toFixed(2).toString().replace(".",",") // pads the zeros and then replaces . with ,
  }
  
}
