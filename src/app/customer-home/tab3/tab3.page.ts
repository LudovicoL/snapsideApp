import { Component } from '@angular/core';
import {
  RxSpeechRecognitionService,
  resultList,
} from '@kamiazya/ngx-speech-recognition';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BenefitService } from 'src/app/services/benefit.service';
import { DataService } from 'src/app/services/data.service';
import { AdService } from 'src/app/services/ad.service';
import * as moment from 'moment'
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  message = '';
  c_timeout=null
  unsub=null
  public benefits=[]
  constructor(
    public service: RxSpeechRecognitionService,private localNotifications: LocalNotifications, private _benefits: BenefitService, private _data : DataService,
    private _adService : AdService
  ) { }

    ngOnInit(){
      
      const refresher = document.getElementById('refresher3');
      refresher.addEventListener('ionRefresh',  () => {
       this.c_timeout=  setTimeout( () => {
          if(this.c_timeout!=null){
            clearTimeout(this.c_timeout)
          }
          console.log('refresh3')
          this.refresher();
          (<any>refresher).complete();
       
          
          
        }, 1000);
        
       
      })

      var that=this;
      this._data.userid.subscribe(data=>{this._benefits.getAllBenefitsByCustomer(data).subscribe(data=>{this.benefits=data;
      this.benefits.forEach(function(entry, index){
        that._adService.getAdById(entry.ad_id_ad).subscribe(data=>{entry['title']=data.title})
      })
      
      // this.benefits.sort((a, b) => a.checkinDate < b.checkinDate ? -1 : a.checkinDate > b.checkinDate ? 1 : 0);
      })})
        
    }


  listen() {
    this.service
      .listen()
      .pipe(resultList)
      .subscribe((list: SpeechRecognitionResultList) => {
        this.message = list.item(0).item(0).transcript;
        console.log('RxComponent:onresult', this.message, list);
      });
  }

  
  single_notification() {
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      // sound: 'file://sound.mp3',
      data: { secret: 'key_data' }
    });
  }

  initial(){
    if(this.unsub!=null){
      this.unsub.unsubscribe()
    }
    var that=this;
    this.unsub=this._data.userid.subscribe(data=>{this._benefits.getAllBenefitsByCustomer(data).subscribe(data=>{this.benefits=data;
    this.benefits.forEach(function(entry, index){
      that._adService.getAdById(entry.ad_id_ad).subscribe(data=>{entry['title']=data.title})
    })
    
    // this.benefits.sort((a, b) => a.checkinDate < b.checkinDate ? -1 : a.checkinDate > b.checkinDate ? 1 : 0);
    })})
  }

  
  prettyDate(timestamp) {
    const t = parseInt(timestamp);
    return moment(t).format('DD-MMM-YYYY');
  }

  
  prettyPrice(price){
    return Number(price).toFixed(2).toString().replace(".",",") // pads the zeros and then replaces . with ,
    }
    refresher()
    {
      this.initial()
    }
}
