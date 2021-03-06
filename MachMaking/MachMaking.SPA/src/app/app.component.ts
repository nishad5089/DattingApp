import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from './_models/user';
import { Photo } from './_models/Photo';
import * as _ from 'underscore';
import { HubConnectionBuilder, HubConnection, LogLevel } from '../../node_modules/@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  jwtHelper: JwtHelper = new JwtHelper();
  currentMain: Photo;
  private _hubConnection: HubConnection;
  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
       this.authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
