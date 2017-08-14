import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
    // console.log('Hello AuthProvider Provider');
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logoutUser(): firebase.Promise<void> {
    return firebase.auth().signOut();
  }

  resetPassword(email: string): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  signupUser(newUser: any): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(newUser.credentials.email, newUser.credentials.password).then( userCreated => {
      firebase.database().ref('/userProfile').child(userCreated.uid).set({ 
        email: newUser.credentials.email,
        personal: newUser.personal,
        address: newUser.address
      });
    });
  }

}
