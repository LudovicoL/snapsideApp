import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user';
import { DataService } from '../../services/data.service';
import { GuiService } from '../../services/gui.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from "moment";
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  

  constructor(private location: Location,private userService: UserService, private _category: CategoryService, 
    private _data: DataService, private _gui: GuiService, private _sanitizer: DomSanitizer,
    private router: Router, private route: ActivatedRoute ) { }
  public userData: IUser;
  public categories=[]
  userid: string;

  ngOnInit() {
    this._data.userid.subscribe(data=> {this.userid=data;this.userService.getUserById(this.userid).subscribe(data => this.userData=data)})
    

  }

  goBack()
  {
    this.location.back()
  }

  prettyDate(timestamp) {
    const t = parseInt(timestamp);
    return moment(t).format('DD-MMM-YYYY');
  }

}
