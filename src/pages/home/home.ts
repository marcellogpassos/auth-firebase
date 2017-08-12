import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public userProfile:any = null;

  constructor(public navCtrl: NavController) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) 
        this.userProfile = user;
      else
        this.navCtrl.setRoot(LoginPage);
    });
  }

}
