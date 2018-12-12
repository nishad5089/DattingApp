import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  // @Input() valueFromHome: any;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  constructor(public authservice: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.min(4)]),
      confirmPassword: new FormControl('', Validators.required)
    });
  }
  register() {
    // this.authservice.register(this.model).subscribe(() => {
    //   this.alertify.success('registration Completed');
    // }, error => {
    //   this.alertify.error(error);
    // });
    // console.log(this.model);
console.log(this.registerForm.value);
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
