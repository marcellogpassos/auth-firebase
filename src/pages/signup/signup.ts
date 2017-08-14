import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Loading, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CpfValidator } from "../../validators/cpf";
import { EmailValidator } from "../../validators/email";
import { PasswordValidator } from "../../validators/password";

import { GoogleapiGeocodeProvider } from "../../providers/googleapi-geocode/googleapi-geocode";
import { AddressProvider } from "../../providers/address/address";
import { AuthProvider } from "../../providers/auth/auth";

import { HomePage } from "../home/home";

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  STEP_ACCOUNT_DATA: number = 0;
  STEP_PERSONAL_DATA: number = 1;
  STEP_ADDRESS_DATA: number = 2;
  step: number = 0;

  newUser = {
    credentials: {
      email: "",
      password: "",
    },
    personal: {
      nome: "",
      sobrenome: "",
      sexo: '',
      data_nascimento: '',
      cpf: '',
      telefone: '',
    },
    address: {
      cep: '',
      uf: '',
      municipio: '',
      municipio_id: '',
      bairro: '',
      logradouro: '',
      numero: '',
      complemento: '',
      latitude: '',
      longitude: ''
    }   
  };

  passwordConfirmation;

  accountDataForm: FormGroup;
  personalDataForm: FormGroup;
  addressDataForm: FormGroup;

  maxDate: String = new Date().toISOString();

  cepConsultado: boolean = false;

  signupLoading: Loading;
  addressLoading: Loading;
  geocodeLoading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public address: AddressProvider, public geocode: GoogleapiGeocodeProvider, public auth: AuthProvider) {
    this.initAccountDataForm();
    this.initPersonalDataForm();
    this.initAddressDataForm();  
  }

  initAccountDataForm() {
    this.accountDataForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      sobrenome: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.compose([Validators.required])],
    }, {validator: PasswordValidator.MatchPassword});
  }

  initPersonalDataForm() {
    this.personalDataForm = this.formBuilder.group({
      sexo: ['', Validators.compose([Validators.required])],
      data_nascimento: ['', Validators.compose([Validators.required])],
      cpf: ['', Validators.compose([Validators.required, CpfValidator.isValid])],
      telefone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11)])],
    });
  }

  initAddressDataForm() {
    this.addressDataForm = this.formBuilder.group({
      cep: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      uf: ['', Validators.compose([])],
      municipio: ['', Validators.compose([])],
      bairro: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      logradouro: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      numero: ['', Validators.compose([Validators.required, Validators.maxLength(16)])],
      complemento: ['', Validators.compose([Validators.maxLength(64)])],
    });
  }

  initAlert(message) {
    return this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: "Ok",
          role: 'cancel'
        }
      ]
    });
  }

  initLoading(message) {
    return this.loadingCtrl.create({
      content: message,
      dismissOnPageChange: true,
      spinner: 'dots'
    });
  }

  initToast(message) {
    return this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signupUser() {
    this.getLatLong(() => {
      this.signupLoading = this.initLoading("Cadastrando usuário...");
      this.signupLoading.present();
      this.auth.signupUser(this.newUser).then(() => {
        this.signupLoading.dismiss();
        this.alertCtrl.create({
          message: ("Usuário cadastrado com sucesso!"),
          buttons: [{
            text: "Entrar",
            role: 'cancel',
            handler: () => {this.navCtrl.setRoot(HomePage);}
          }]
        }).present();
      }, error => {
        this.signupLoading.dismiss();
        this.initAlert("Falha ao tentar cadastrar o usuário. Tente novamente mais tarde.").present();
        console.log(error);
      });
    });
  }

  next() {
    if(this.step < this.STEP_ADDRESS_DATA)
      this.step++;
  }

  previous() {
    if(this.step > this.STEP_ACCOUNT_DATA)
      this.step--;
  }

  consultarCep() {
    this.addressLoading = this.initLoading("Consultando CEP...");
    this.addressLoading.present();
    this.address.getAddress(this.newUser.address.cep)
      .subscribe(address => {
        this.addressLoading.dismiss();
        if(address.erro) {
          this.limparCep();
          this.initToast("CEP não encontrado.").present();
        }
        else {
          this.newUser.address.uf = address.uf;
          this.newUser.address.municipio = address.localidade;
          this.newUser.address.municipio_id = address.ibge;
          this.newUser.address.bairro = address.bairro;
          this.newUser.address.logradouro = address.logradouro;
          this.cepConsultado = true;
        }
      }, error => {
        this.addressLoading.dismiss();
        this.limparCep();
        this.initToast("Falha ao tentar recuperar o CEP.").present();
        console.log(error);
      });
  }

  limparCep() {
    this.newUser.address = {
      cep: '',
      uf: '',
      municipio: '',
      municipio_id: '',
      bairro: '',
      logradouro: '',
      numero: '',
      complemento: '',
      latitude: '',
      longitude: ''
    };
    this.cepConsultado = false;
  }

  getLatLong(callback: () => any) {
    this.geocodeLoading = this.initLoading("Consultando coordenadas geográficas do endereço...");
    this.geocodeLoading.present();
    this.geocode.getLatLong(this.newUser.address).subscribe(geocode => {
      this.geocodeLoading.dismiss();
      if(geocode.status == "OK") {
        this.newUser.address.latitude = (+geocode.results[0].geometry.location.lat).toFixed(6);
        this.newUser.address.longitude = (+geocode.results[0].geometry.location.lng).toFixed(6);
        callback();
      } else {
        let message = "Falha ao tentar descobrir a latitude e a longitude. ";
        switch (geocode.status) {
          case "ZERO_RESULTS": 
            message += "Endereço não encontrado."; break;
          case "OVER_QUERY_LIMIT": 
            message += "Cota de consulta ultrapassada."; break;
          case "REQUEST_DENIED": 
            message += "Solicitação negada."; break;
          case "INVALID_REQUEST": 
            message += "Solicitação inválida."; break;
          case "UNKNOWN_ERROR": 
            message += "Erro desconhecido."; break;
        }
        this.initToast(message).present();
      }
    }, error => {
      this.geocodeLoading.dismiss();
      this.initToast("Falha ao tentar descobrir a latitude e a longitude. Erro desconhecido.").present();
    });
  }

}