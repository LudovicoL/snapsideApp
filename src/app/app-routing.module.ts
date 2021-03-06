import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './customer-home/tabs/tabs.page';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserProfileComponent } from './customer-home/user-profile/user-profile.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'user/customer/:userid/home',
    // component: CustomerHomeComponent,
    loadChildren: () => import('./customer-home/tabs/tabs.module').then(m => m.TabsPageModule),

  },
  {
    path: 'login',
    component: LoginPageComponent,
    
  },
  {
    path: 'user/customer/user-profile',
    component: UserProfileComponent,
    
  },
  {
    path: 'comment-modal',
    loadChildren: () => import('./customer-home/view-ad/comment-modal/comment-modal.module').then( m => m.CommentModalPageModule)
  },
  {
    path: 'user/seller/:userid/home',
    redirectTo: 'user/seller/:userid/home/ads-list',
    pathMatch: 'full',
    data: {urlTag: 'ads-list'}
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'seller-home',
    loadChildren: () => import('./seller-home/seller-home.module').then( m => m.SellerHomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
