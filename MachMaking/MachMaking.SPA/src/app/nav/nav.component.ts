import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '../../../node_modules/@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '../../../node_modules/@aspnet/signalr';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  private _hubConnection: HubConnection;
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }


  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
      const token = localStorage.getItem('token');
      this._hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/image', { accessTokenFactory: () => token})
      .configureLogging( LogLevel.Debug)
      .build();
      this._hubConnection.on('Send', (photo: any) => {
      //  this.authService.currentUser.photoUrl = data.url;
      // console.log(data);
          this.authService.changeMemberPhoto( photo.url );
       this.authService.currentUser.photoUrl = photo.url;
      console.log('APP Compnent  :  ' + photo);
    // localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      });
      this._hubConnection
      .start()
      .then(() => {
       // this.connectionIsEstablished = true;
        console.log('Hub connection started');
       // this.connectionEstablished.emit(true);
      }).catch(() => { console.log('Failed To connect'); });
      this.alertify.success('logged in successfully');
      console.log(data);
    }, error => {
      this.alertify.error('Failed to log in');
    }, () => {
      this.router.navigate(['/members']);
    });
  }

 logout() {

    this.authService.userToken = null;
    this.authService.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
    this._hubConnection.off('Send');
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
