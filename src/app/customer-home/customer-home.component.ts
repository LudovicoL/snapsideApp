import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss'],
})
export class CustomerHomeComponent implements OnInit {

  constructor(private _Activatedroute:ActivatedRoute, private data: DataService) { }
  userid;
  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.userid = params.get('userid');
    });

    

    this.data.sendUserid(this.userid)
    console.log(this.userid)
  }

}
