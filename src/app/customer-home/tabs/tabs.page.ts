import { Component, ViewChild } from '@angular/core';
import { Location} from '@angular/common';
import { IonTabs, NavController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifService } from 'src/app/services/notif.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as moment from "moment";
import { Route } from '@angular/compiler/src/core';
import { MessagingService } from '../../shared/messaging.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { notifTrigger } from '../../globals/globals';
import * as firebase from 'firebase';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userid;
  c_interval;
  currentMessage = new BehaviorSubject(null);
  // messaging = firebase.messaging()
  constructor(public navCtrl: NavController,private _Activatedroute:ActivatedRoute, private data: DataService, private _notif: NotifService,
    private localNotifications: LocalNotifications, private platform: Platform, private location: Location, private route: Router,
    private messagingService: MessagingService,private angularFireMessaging: AngularFireMessaging, private fcm: FCM, private plt: Platform   )  {

      

    }
  @ViewChild('tabs',{static: false}) tabs: IonTabs;

  async openTab(tab: string, evt: MouseEvent) {
      const tabSelected = this.tabs.getSelected();
      evt.stopImmediatePropagation();
      evt.preventDefault();
      return tabSelected !== tab
        ? await this.navCtrl.navigateRoot(this.tabs.outlet.tabsPrefix + '/' + tab)
        : this.tabs.select(tab);
  }

   ngOnDestroy(){
    clearInterval(this.c_interval);
    }

    receiveMessage() {

      this.angularFireMessaging.messages.subscribe(
        (payload) => {
          console.log("new message received. ", payload);
          this.currentMessage.next(payload);
          console.log('Hi there - push notifications recv')
          this.displayNotifications()
        })
    }

  ngOnInit()
  {
    
    // console.log(this.messagingService.receiveMessage())
    
    this.platform.backButton.subscribeWithPriority(100,()=>{
      if(!(this.route.url.endsWith('tab1')||this.route.url.endsWith('tab2')||this.route.url.endsWith('tab3')))
      this.location.back()
    })

    this._Activatedroute.paramMap.subscribe(params => {
      this.userid = params.get('userid');
      console.log(this.userid)

    });

    

    //ANGULAR EVENT FIREBASE NOT WORKING ON IONIC
    // this.messagingService.requestPermission(this.userid)
    // this.receiveMessage()
    // this.messaging.onMessage((payload)=>{console.log('msg received'); this.currentMessage.next(payload)})
    //

    this.data.sendUserid(this.userid)
    console.log(this.userid)

    if(!this.plt.is('cordova')){
      this.messagingService.requestPermission(this.userid)
      this.receiveMessage()
    }
    else{ 

      if(notifTrigger!='FIREBASE'){
      this.c_interval = setInterval(async () => {
        this.displayNotifications()
        console.log('Hi there - push notifications recv')
        }, 1000);
      }

      else{

        this.fcm.subscribeToTopic('marketing');

        this.fcm.getToken().then(token => {
          console.log('New token (ionic)',token)
          this._notif.updateFirebaseToken(this.userid,token).subscribe(data=>{console.log(data)})
        });

        this.fcm.onNotification().subscribe(data => {
          if(data.wasTapped){
            console.log("Received in background");
            this.displayNotifications()
          } else {
            this.displayNotifications()
            console.log("Received in foreground");
          };
        }); 

      }

    }

}

  async displayNotifications(){
    var unsub = this._notif.getAllNotifsByUser(this.userid).subscribe(data=>{
    var that=this;  

    data.forEach(async function(entry,index){
        if(entry.cleared===0 ){
          that.single_notification(entry.title,entry.subject)
          console.log('notif received: '+entry.title)
          await that._notif.clearPush(entry.idNotif).toPromise()
        }
        })

        // console.log(entry.idNotif)
    unsub.unsubscribe();
      })
      
  
      
  
  }

  single_notification(title,text) {
    // Schedule a single notification
    this.localNotifications.schedule({
      id: moment().valueOf(),
      title: title,
      text: text,
      // sound: 'file://sound.mp3',
      data: { secret: 'key_data' }
    });
  }
  
}
