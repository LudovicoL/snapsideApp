import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { SellerHomePageRoutingModule } from './seller-home-routing.module';

import { SellerHomePage } from './seller-home.page';
import { AdsListComponent } from './ads-list/ads-list.component';
import { NewAdComponent } from './new-ad/new-ad.component';
import { EditAdComponent } from './edit-ad/edit-ad.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { SellerViewAdComponent } from './seller-view-ad/seller-view-ad.component';
import { SellerCommentModalComponent } from './seller-view-ad/seller-comment-modal/seller-comment-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerHomePageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4KdwJtPi9jK0GZvctyj4L0efaZa_bnv4',
      libraries: ['places']
    })
  ],
  declarations: [
    SellerHomePage,
    AdsListComponent,
    NewAdComponent,
    EditAdComponent,
    ReservationsComponent,
    SellerViewAdComponent,
    SellerCommentModalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SellerHomePageModule {}
