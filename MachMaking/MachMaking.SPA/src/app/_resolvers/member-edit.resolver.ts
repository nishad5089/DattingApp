import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService,
         private authSrvice: AuthService) { }

        resolve(route: ActivatedRouteSnapshot): Observable<User> {
          return  this.userService.getUser(this.authSrvice.decodedToken.nameid).catch(error => {
                this.alertify.error('Problem Retriving Data');
                this.router.navigate(['/members']);
                return Observable.of(null);
            });
        }

}
