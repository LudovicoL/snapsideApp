import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IUser } from '../interfaces/user';
import { InteractionService } from '../services/interaction.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { GuiService } from '../services/gui.service';
import { AdService } from '../services/ad.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.page.html',
  styleUrls: ['./seller-home.page.scss'],
})
export class SellerHomePage implements OnInit {

  public userData: IUser;
  userid: string;
  name: string;

  constructor(
    private _interactionService: InteractionService,
    private userService: UserService,
    private http: HttpClient,
    // tslint:disable-next-line: variable-name
    private _Activatedroute: ActivatedRoute,
    private data: DataService,
    private cdRef: ChangeDetectorRef,
    private _gui: GuiService,
    private router: Router,
    private _ad: AdService
  ) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.userid = params.get('userid');
    });
    this.data.sendUserid(this.userid);
    this.userService.getUserById(this.userid).subscribe(data => this.userData = data);
  }
}
