import { Component } from '@angular/core';
import {
  IonicPage, 
  Loading,
  LoadingController, 
  NavController,
  AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

import firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
    public authProvider: AuthProvider, public formBuilder: FormBuilder) {
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  loginUser(): void {
    if (this.loginForm.valid) { 
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      let email = this.loginForm.value.email;
      let password = this.loginForm.value.password;

      this.authProvider.loginUser(email, password).then( authData => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(HomePage);
        });
      }, error => {
        this.loading.dismiss().then( () => {
          this.showErrorAlert(error.message);
        });
      });
    }
  }

  googleLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then(result => {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(token, user);
      }).catch( error => {
        console.log(error);
      });
    });
  }

  showErrorAlert(message) {
    this.alertCtrl.create({
      message: message,
      buttons: [{ text: "Fechar", role: 'cancel' }]
    }).present();
  }

  goToSignup(): void { 
    // this.navCtrl.push('signup'); 
  }

  goToResetPassword(): void { 
    // this.navCtrl.push('reset-password'); 
  }

}
