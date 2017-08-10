import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import firebase from 'firebase';
import { AuthProvider } from "../providers/auth/auth";
import { LoginPage } from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{id: number, title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public auth: AuthProvider, public alertCtrl: AlertController) {
    this.initializeFirebase();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { id: 1, title: 'Home', component: HomePage },
      { id: 2, title: 'List', component: ListPage },
      { id: 0, title: 'Logout', component: null }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initializeFirebase() {
    firebase.initializeApp({
      apiKey: "AIzaSyCwFOKH0393ngVWAUMByv5lZKBd1jtoyiM",
      authDomain: "deau-8e28f.firebaseapp.com",
      databaseURL: "https://deau-8e28f.firebaseio.com",
      projectId: "deau-8e28f",
      storageBucket: "deau-8e28f.appspot.com",
      messagingSenderId: "1028891332988",
    });
  }

  openPage(page) {
    if(!page.id)
      this.logout();
    else    
      this.nav.setRoot(page.component);
  }

  logout() {
    this.auth.logoutUser().then(
      () => {
        console.log("Bye! I'll miss you... :(");
        this.nav.setRoot(LoginPage);
      }, error => {
        this.alertCtrl.create({
          message: "Falha ao tentar realizar o logout!",
          buttons: [{ text: "Ok", role: 'cancel'  }]
        }).present();
      }
    );
  }

}
