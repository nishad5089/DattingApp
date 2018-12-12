import { User } from './../../_models/User';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
user: User;
// we can get the status of form in html file
@ViewChild('editForm') editForm: NgForm;
photoUrl: string;

  constructor(private route: ActivatedRoute,
     private alertify: AlertifyService,
     private authService: AuthService,
     private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);

  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile updated successfully');
      this.editForm.reset(this.user);
     // console.log(next);
    }, error => {
      this.alertify.error(error);
    });
  }
  updateMainPhoto(photoUrl) {
   this.user.photoUrl =  photoUrl;
  }

}
