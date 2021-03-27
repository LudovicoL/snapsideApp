import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user';
import { DataService } from '../services/data.service';
import { GuiService } from '../services/gui.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar-customer-home',
  templateUrl: './sidebar-customer-home.component.html',
  styleUrls: ['./sidebar-customer-home.component.scss'],
})
export class SidebarCustomerHomeComponent implements OnInit {
  selectedCat='All'
  sortBy='idA'
  public appPages = [
    {
      title: 'Logout',
      url: '/home',
      icon: 'exit'
    },

    // {
    //   title: 'Customer',
    //   url: '/customer',
    //   icon: 'home'
    // },

  ];
  constructor(private userService: UserService, private _category: CategoryService, private _data: DataService, private _gui: GuiService, private _sanitizer: DomSanitizer,
    private router: Router, private route: ActivatedRoute ) { }
  public userData: IUser;
  public categories=[]
  userid: string;

  ngOnInit() {
    this._gui.sendFilterByCat('All');
    this._gui.sendSortBy('idA');

    this._data.userid.subscribe(data=> {this.userid=data;this.userService.getUserById(this.userid).subscribe(data => this.userData=data)})
    
    this._category.getAllCat().subscribe(data => {this.categories=data;
      

      this._gui.filterByCat.subscribe(data=>{this.selectedCat=data;})})
    
    this._gui.sortAdBy.subscribe(data=>{this.sortBy=data})
  }


  sendSelectedCat(event){
    console.log(event)
    this._gui.sendFilterByCat(event.target.value)
    this.selectedCat=event.target.value
  }

  sendSortBy(event){
    console.log(event)
    this._gui.sendSortBy(event.target.value)
  }

  
  getImageSanitized(base64img)

{

  if (base64img===null){

    return ("assets/utils_imgs/avatar3.svg")
  }
  else if (base64img.lastIndexOf('/9j',0)===0){
  return this._sanitizer.bypassSecurityTrustResourceUrl("data:image/jpg;base64, " + base64img);
  }
  else {
    return this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + base64img);
    }
}

getImageNotSanitized(base64img)

{

  if (base64img===null){

    return ("assets/utils_imgs/avatar3.svg")
  }
  else if (base64img.lastIndexOf('/9j',0)===0){
  return "data:image/jpg;base64, " + base64img;
  }
  else {
    return "data:image/png;base64, " + base64img;
    }
}
goToProfile(){
  console.log(this.route)

}
}
