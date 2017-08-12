import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/*
  Generated class for the GoogleapiGeocodeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GoogleapiGeocodeProvider {

  static apiKey = "AIzaSyAGYPjbDQ42rYlwXxxrUoN4HN4DENv008Y";

  public urlGeocodeApi = "https://maps.googleapis.com/maps/api/geocode/json?address=:address&key=:apiKey";

  constructor(public http: Http) {
    // console.log('Hello GoogleapisGeocodeProvider Provider');
  }

  getLatLong(address) {
    let myAddress = address.logradouro + "+" + address.numero + "+" + address.bairro 
      + "+" + address.municipio + "+" + address.uf + "+" + address.cep;
    let url = this.urlGeocodeApi.replace(":address", myAddress.replace(" ", "+"))
      .replace(":apiKey", GoogleapiGeocodeProvider.apiKey);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
