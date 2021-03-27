import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerHomePage } from './seller-home.page';
import { AdsListComponent } from './ads-list/ads-list.component';
import { NewAdComponent } from './new-ad/new-ad.component';
import { EditAdComponent } from './edit-ad/edit-ad.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { SellerViewAdComponent } from './seller-view-ad/seller-view-ad.component';

const routes: Routes = [
  {
    path: 'user/seller/:userid/home',
    component: SellerHomePage,
    data: {urlTag: 'ads-list'},
    children: [
      {
        path: 'ads-list',
        component: AdsListComponent
      },
      {
        path: 'new-ad',
        component: NewAdComponent
      },
      {
        // path: 'edit-ad/:adid',
        path: 'edit-ad',
        component: EditAdComponent
      },
      {
        path: 'reservations',
        component: ReservationsComponent
      },
      {
        //path: 'view-ad/:adid',
        path: 'seller-view-ad',
        component: SellerViewAdComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerHomePageRoutingModule {}
