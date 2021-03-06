import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as globals from '../globals/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private _user: UserService

  ) { }
  model: any = {};
  logInFailed = false;
  globals;
  ngOnInit() {

    this.globals=globals.loginUrl
  }

  
  myAlert(msg)
  {
    alert(msg)
  }

  login(f: NgForm): void {

    if(this.model.username && this.model.password){
    localStorage.setItem('token', btoa(this.model.username + ':' + this.model.password));
    this.http.post(globals.loginUrl, { username: this.model.username, password: this.model.password })
      .subscribe((res) => {
        if (res['enabled']) { 
          localStorage.setItem('token', btoa(this.model.username + ':' + this.model.password));
          // alert('LOGGED:\n Username: '+this.model.username+'\n Password: '+this.model.password+'\n token: '+localStorage.getItem('token'));
          this.logInFailed = false;


          if (res['userType'] === 'CUSTOMER') {
            console.log('Logged in as customer!')
            // alert('Sono un acquirente!')
            this.router.navigate(['user/customer', res['idUser'].toString(),'home']);
            this._user.updateLastAccess(res['idUser']).subscribe(data=>{console.log(data)})
          } else if (res['userType'] === 'SELLER') {

            this.router.navigate(['user/seller', res['idUser'].toString(),'home']);
            this._user.updateLastAccess(res['idUser']).subscribe(data=>{console.log(data)})
          } else if (res['userType'] === 'ADMIN') {
            alert('Admin domain! You are trying to log in as admin. The mobile app does not support admin interface. There is a web app for that, go there.')

            // this.router.navigate(['user/admin', res['idUser'].toString(),'home']);

          }

          else {
            alert("I dont know what kind of user you are")
            // this.router.navigate(['about']);
               }

        } else {
          this.logInFailed=true;
          // alert("Authentication failed.")
        }
      },
      (error) => {
        
        alert(error+'\nLogin request failed. There is a problem with HTTP request to backend server. '+
        'If you are using the application in android simulator, change backend serverip to 10.0.2.2:8080 in globals.ts')}


      );
    }
    else{
      this.logInFailed=true;
    }
    // f.reset();
  }
}
