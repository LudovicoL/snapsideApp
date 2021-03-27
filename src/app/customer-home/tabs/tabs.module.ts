import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { Tab2Page } from '../tab2/tab2.page';
import { AgmCoreModule } from '@agm/core';
import { ViewAdComponent } from '../view-ad/view-ad.component';
import { Tab1Page } from '../tab1/tab1.page';
import { BuyAdComponent } from '../buy-ad/buy-ad.component';
import { SidebarCustomerHomeComponent } from 'src/app/sidebar-customer-home/sidebar-customer-home.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4KdwJtPi9jK0GZvctyj4L0efaZa_bnv4',
      // libraries: ['places']
    }),
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [TabsPage,Tab1Page,Tab2Page,ViewAdComponent, BuyAdComponent]
})
export class TabsPageModule {}
