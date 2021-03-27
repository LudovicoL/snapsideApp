import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TabsPage } from './customer-home/tabs/tabs.page';
import { SidebarMainComponent } from './sidebar-main/sidebar-main.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavParams, NavController } from '@ionic/angular';
import { ListPage } from './list/list.page';
import { AgmCoreModule } from '@agm/core';
import { ViewAdComponent } from './customer-home/view-ad/view-ad.component';
import { SidebarCustomerHomeComponent } from './sidebar-customer-home/sidebar-customer-home.component';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { CommentModalPageModule } from './customer-home/view-ad/comment-modal/comment-modal.module';
import { DataService } from './services/data.service';
import {
  SpeechRecognitionModule, RxSpeechRecognitionService,
} from '@kamiazya/ngx-speech-recognition';
import {
  SpeechRecognitionLang,
  SpeechRecognitionMaxAlternatives,
  SpeechRecognitionGrammars,
  SpeechRecognitionService,
} from '@kamiazya/ngx-speech-recognition';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { MessagingService } from './shared/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { UserProfileComponent } from './customer-home/user-profile/user-profile.component';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AboutComponent } from './about/about.component';
import { SidebarSellerHomeComponent } from './seller-home/sidebar-seller-home/sidebar-seller-home.component';
import { SellerHomePageModule } from './seller-home/seller-home.module';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { Firebase } from '@ionic-native/firebase/ngx';
// import { FcmProvider } from './providers/fcm.service';
const firebase = {
  // your firebase web config
  apiKey: "AIzaSyBC9L-KXNevyYZnoIOCBhH6XsxaZhJxldk",
  authDomain: "snapside-push-a677e.firebaseapp.com",
  databaseURL: "https://snapside-push-a677e.firebaseio.com",
  projectId: "snapside-push-a677e",
  storageBucket: "snapside-push-a677e.appspot.com",
  messagingSenderId: "222097974773",
  appId: "1:222097974773:web:20ce9bb12f4467e15c2cbc",
  measurementId: "G-S40ZMWK97Y"
 }

@NgModule({
  declarations: [
    AppComponent,
    SidebarMainComponent,
    LoginPageComponent,
    SidebarCustomerHomeComponent,
    UserProfileComponent,
    AboutComponent,
    SidebarSellerHomeComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4KdwJtPi9jK0GZvctyj4L0efaZa_bnv4',
      // libraries: ['places']
    }),
    // AngularFireModule.initializeApp(firebase), 
    // AngularFirestoreModule,
    CommentModalPageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    
    
    //WEB SPEECH
    SpeechRecognitionModule.withConfig({
      lang: 'it-IT',
      interimResults: true,
      maxAlternatives: 10,
      // continuous:true,
    }),
    //
    SellerHomePageModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar,
    SplashScreen,
    // Firebase,
    // FcmProvider,
    SpeechRecognition,
    NavController,
    DataService,
    Geolocation,
    NativeGeocoder,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

//WEB SPEECH
    {
      provide: SpeechRecognitionLang,
      useValue: 'it-IT',
    },
    {
      provide: SpeechRecognitionMaxAlternatives,
      useValue: 1,
    },
    SpeechRecognitionService,
    RxSpeechRecognitionService,
    //
    Camera,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

  MessagingService, AsyncPipe, FCM
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
