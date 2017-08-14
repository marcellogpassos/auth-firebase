import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

/*
  Generated class for the EstabelecimentosProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EstabelecimentosProvider {

  constructor(public http: Http) {
    // console.log('Hello EstabelecimentosProvider Provider');
  }

  telaInicial() {
    return firebase.database().ref('/estabelecimentos').once('value');
  }

}
