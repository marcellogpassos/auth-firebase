import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';
import { LoginPage } from "../login/login";
import { EstabelecimentosProvider } from "../../providers/estabelecimentos/estabelecimentos";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public userProfile:any = null;

  public estabelecimentos: any[];

  constructor(public navCtrl: NavController, public estab: EstabelecimentosProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userProfile = user;
        this.initPage();
      }
      else
        this.navCtrl.setRoot(LoginPage);
    });
  }

  initPage() {
    this.estab.telaInicial().then(snapshot => {
      console.log(snapshot.val())
      this.estabelecimentos = this.snapshotToArray(snapshot);
    });
  }

  snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });
    return returnArr;
  };

}
