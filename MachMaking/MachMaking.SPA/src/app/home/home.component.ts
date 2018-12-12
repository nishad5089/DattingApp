import { Component, OnInit } from '@angular/core';
import { Http } from '../../../node_modules/@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  values: any = {};
  constructor(private http: Http) { }
  registerMode = false;
  ngOnInit() {
   // this.getValues();
  }
  registerToggle() {
    this.registerMode = true;
  }
  // getValues() {
  //   this.http.get('http://localhost:5000/api/values').subscribe(response => {
  //     this.values = response.json();
  //   });
  // }
  caneRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
