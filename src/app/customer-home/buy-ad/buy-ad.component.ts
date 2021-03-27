import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AdService } from 'src/app/services/ad.service';
import { CategoryService } from 'src/app/services/category.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GuiService } from 'src/app/services/gui.service';
import { IBenefit } from 'src/app/interfaces/benefit';
import { BenefitService } from 'src/app/services/benefit.service';
import { IAd } from 'src/app/interfaces/ad';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { NotifService } from 'src/app/services/notif.service';
import { IUser } from 'src/app/interfaces/user';
@Component({
  selector: 'app-buy-ad',
  templateUrl: './buy-ad.component.html',
  styleUrls: ['./buy-ad.component.scss'],
})
export class BuyAdComponent implements OnInit {
  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  customPickerOptions: any;
  idAd : string;
  minDateBegin
  maxDateBegin
  minDateEnd
  maxDateEnd
  beginDateTStamp=null
  endDateTStamp=null
  isValidDate=true;

  public ad : IAd;
  benefits: IBenefit[]
  userid;
  pChannel='PayPal'



  constructor(private route: ActivatedRoute,
    private router: Router,
    private _adService: AdService,
    private _catService: CategoryService,
    private _sanitizer: DomSanitizer,
    private _gui: GuiService,
    private navCtrl: NavController,
    private _benefits: BenefitService,
    private _user: UserService,
    private _notif: NotifService,
    private _data: DataService,
    private location: Location) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }

 
  }  
  ngOnInit() {
    const param_idAd: string = this.route.snapshot.queryParamMap.get('idAd');
    this.idAd=param_idAd

    this._data.userid.subscribe(data=>this.userid=data)
    this._gui.sendFocusedAdId(param_idAd)




    this._adService.getAdById(this.idAd).subscribe(data => {this.ad=data; this.minDateBegin=this.getMinDate(); this.maxDateBegin=this.getMaxDate();
      this.minDateEnd=this.getMinDate(); this.maxDateEnd=this.getMaxDate();
      // let date = new Date(this.getMinDate())
      // console.log(date.getTime())
      // this.beginDateTStamp=date.getTime()
      // this.endDateTStamp=date.getTime()

      this._benefits.getBenefitsHaveAd(this.idAd).subscribe(data=>{this.benefits=data})});
      



    
  }

  getMinDate(){
    var date=Math.max(this.ad.beginDate, moment().valueOf())
    return moment(date).format('YYYY-MM-DD') 
  }


buyNotif(){
  var token;
  var userid;
  var body;
  var senderUser:IUser;
  var title = "Good news! A customer has bought your ad"
  this._data.userid.subscribe(data=>userid=data)
  this._user.getUserById(userid).subscribe(data=>{senderUser=data;
    body="Customer @"+senderUser.username+" has bought your ad '"+this.ad.title+ "' (#"+this.ad.idAd+")";
  
    this._user.getUserById(this.ad.user_id_seller).subscribe(data=>{token=data.token; console.log(token)
      this._notif.sendToastNotif(this.ad.user_id_seller,body,title).subscribe(data=>console.log(data))
      this._notif.firebasePush(token,body,title).subscribe(data=>console.log(data))
    })
})
}

  buyClick(){
    var controller = document.querySelector('ion-action-sheet-controller');
    var toastController = document.querySelector('ion-toast-controller');
    var button = document.querySelector('ion-button');
    if(this.validateDateInterval()){
    controller.create({
      header: 'Do you confirm you want to buy this ad?',
      buttons: [
        { text: 'Confirm buy', role: 'success',
        handler: () => {
          console.log('Confirm clicked');
          // that.router.navigate(['view-ad'])
          this._benefits.saveBenefit(this.beginDateTStamp,this.endDateTStamp,this.pChannel,this.priceTotalCalc(this.ad.sellPrice),
          this.idAd,this.userid).subscribe(data=>console.log(data))
          this.buyNotif()

          
          
          toastController.create({
            color: 'success',
            duration: 3000,
            message: 'Operation successful',
            showCloseButton: true
          }).then(toast => {
            toast.present();
          });
          this.navCtrl.back();
        } },
        { text: 'Cancel', role: 'cancel' }
      ]
    }).then(actionSheet => {
      actionSheet.present();
    });
  }
  }


  getMaxDate(){
    
    return moment(this.ad.endDate).format('YYYY-MM-DD')
  }
  myAlert(msg)
  {
    console.log(msg.detail.value.split("T")[0])
    
  }

  addEventBegin(event){
    this.minDateEnd = event.detail.value.split("T")[0]
    let date = new Date(event.detail.value.split("T")[0])
    console.log(date.getTime())
    this.beginDateTStamp=date.getTime()
    this.validateDateInterval()

  }

  addEventEnd(event){
    this.maxDateBegin = event.detail.value.split("T")[0]
    let date = new Date(event.detail.value.split("T")[0])
    console.log(date.getTime())
    this.endDateTStamp=date.getTime()
    this.validateDateInterval()

  }

  validateDateInterval(){
    console.log(this.beginDateTStamp)
    if(this.beginDateTStamp==null || this.endDateTStamp==null)
      {
        this.isValidDate=false
        return false
      }

    var that=this;
    var valid=true;
    if(this.benefits!=null){
    this.benefits.forEach(function(entry,index){

      if((entry.checkinDate>that.beginDateTStamp && entry.checkoutDate<that.endDateTStamp)||
      (entry.checkinDate<that.beginDateTStamp && entry.checkoutDate>that.endDateTStamp) ||
      (entry.checkinDate<that.endDateTStamp && entry.checkinDate>that.beginDateTStamp) || 
      (entry.checkoutDate>that.beginDateTStamp && entry.checkoutDate<that.endDateTStamp)
      ){
        valid=false;
      }
    })}
    else{
    // this.isValidDate=valid
    // return valid
    }
    
    if(valid)
    console.log('Date interval is valid')
    else {
      console.log('Date interval is not valid')
    }
    this.isValidDate=valid
    return valid;
  }


  prettyDate(timestamp) {
    const t = parseInt(timestamp);
    return moment(t).format('DD-MMM-YYYY');
  }


  priceTotalCalc(basePrice){
    return Math.max(basePrice*((this.endDateTStamp - this.beginDateTStamp)+(86400*1000))/(86400*1000),basePrice)
  }

  prettyPrice(price){
    return Number(price).toFixed(2).toString().replace(".",",") // pads the zeros and then replaces . with ,
    }

    setPaymentChannel(event){
      this.pChannel=event.target.value

    }

    goBack(){
      this.location.back()
    }
}
