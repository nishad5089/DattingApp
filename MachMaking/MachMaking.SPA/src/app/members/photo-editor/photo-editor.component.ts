import { Photo } from './../../_models/Photo';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';
import { AuthService } from '../../_services/auth.service';
import { environment } from '../../../environments/environment';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '../../../../node_modules/@aspnet/signalr';

import * as _ from 'underscore';
@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  public loginToken: string;
  private _hubConnection: HubConnection;
@Input()photos: Photo[];
uploader: FileUploader = new FileUploader({});
hasBaseDropZoneOver = false;
hasAnotherDropZoneOver = false;
baseUrl = environment.apiUrl;
currentMain: Photo;

@Output() getMemberPhotoChange = new EventEmitter<string>();
  constructor(private authService: AuthService, private alertify: AlertifyService, private userService: UserService) { }
//  ngOnInit() {}
  ngOnInit() {
this.loginToken = localStorage.getItem('token');
    this.initializeUploader();
        // this done into employeeSignalrService
    this._hubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5000/image', { accessTokenFactory: () => this.loginToken})
    .configureLogging( LogLevel.Debug)
    .build();

    this._hubConnection.on('Send', (photo: any) => {
    //  this.authService.currentUser.photoUrl = data.url;
    // console.log(data);

        this.authService.changeMemberPhoto( photo.url );
     this.authService.currentUser.photoUrl = photo.url;
    console.log(photo);
  //  this._hubConnection.stop();
  // localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    });
    this._hubConnection
    .start()
    .then(() => {
     // this.connectionIsEstablished = true;
      console.log('Hub connection started');
     // this.connectionEstablished.emit(true);
    }).catch(() => { console.log('Failed To connect'); });
  }
  changePhoto(photo: Photo) {
    this._hubConnection.invoke('Send', photo);
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: false,
      removeAfterUpload: true,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response); // this convert JSON into an object
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    };
  }

setMainPhoto(photo: Photo) {
this.changePhoto(photo);
// this._hubConnection.stop();
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe((data) => {
      // underscore.js used for menupulating arrays so that get instance feedback
    this.currentMain = _.findWhere(this.photos, {isMain: true });
   // console.log(this.currentMain.url);
    this.currentMain.isMain = false;
     photo.isMain = true;
     this.authService.changeMemberPhoto( photo.url );
     this.authService.currentUser.photoUrl = photo.url;
    localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
   // console.log(this.authService.currentUser);
    }, error => {
    this.alertify.error(error);
});
}

deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
     this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
      this.photos.splice(_.findIndex(this.photos, {id: id}), 1); // to remove using the index instantly(items, index, howmany to delete)
      this.alertify.success('Photo has been deleted');
    }, error => {
      this.alertify.error('Failed to delete photo');
    });
    });
}


}
