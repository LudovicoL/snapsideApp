import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-main',
  templateUrl: './sidebar-main.component.html',
  styleUrls: ['./sidebar-main.component.scss'],
})
export class SidebarMainComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // },
    // {
    //   title: 'Customer',
    //   url: '/customer',
    //   icon: 'home'
    // },
    {
      title: 'Login',
      url: '/login',
      icon: 'contact'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle-outline'
    }
  ];
  constructor() { }

  ngOnInit() {}

}
