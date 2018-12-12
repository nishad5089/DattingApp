import { User } from './../../_models/User';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '../../../../node_modules/ngx-gallery';

@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css']
})
export class MemeberDetailComponent implements OnInit {
user: User;
galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];
  constructor(private userService: UserService,
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }
  // members/3
  // loadUser() {
  //   // + used for casting to numeric value the routes
  //   // http://localhost:4200/members/2
  //  this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //    this.user = user;
  //  }, error => {
  //  this.alertify.error(error);
  //  });
  // }

}
