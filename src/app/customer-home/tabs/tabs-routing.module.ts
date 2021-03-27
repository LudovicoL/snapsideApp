import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { Tab2Page } from '../tab2/tab2.page';
import { ViewAdComponent } from '../view-ad/view-ad.component';
import { Tab1Page } from '../tab1/tab1.page';
import { BuyAdComponent } from '../buy-ad/buy-ad.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            // loadChildren: () =>
            //   import('../tab1/tab1.module').then(m => m.Tab1PageModule)
            component : Tab1Page
          },
          {
            path: 'view-ad',
            children:[
              {
                path: '',
                component : ViewAdComponent
              },
              {
              path: 'buy-ad',
              component: BuyAdComponent
            },]
          },
          {
            path: 'user-profile',
            children:[
              {
                path: '',
                // component : UserProfileComponent
              },
              ]
          },
  
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            // loadChildren: () =>
              // import('../tab2/tab2.module').then(m => m.Tab2PageModule)
              component: Tab2Page
          },
          {
            path: 'view-ad',
            children:[
              {
                path: '',
                component : ViewAdComponent
              },
              {
              path: 'buy-ad',
              component: BuyAdComponent
            },]
          },

        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          },
          {
            path: 'view-ad',
            children:[
              {
                path: '',
                component : ViewAdComponent
              },
              {
              path: 'buy-ad',
              component: BuyAdComponent
            },]
          },
        ]
      },
      {
        path: '',
        redirectTo: 'tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
