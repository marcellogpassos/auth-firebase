import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CpfValidator } from "../../validators/cpf";
import { EmailValidator } from "../../validators/email";
import { PasswordValidator } from "../../validators/password";

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  name: 'signup'
})
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
      latitude: 0,
      longitude: 0
    }   
  };

  passwordConfirmation;

  accountDataForm: FormGroup;
  personalDataForm: FormGroup;
  addressDataForm: FormGroup;

  maxDate: String = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.accountDataForm = formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      sobrenome: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.compose([Validators.required])],
    }, {validator: PasswordValidator.MatchPassword});
    this.personalDataForm = formBuilder.group({
      sexo: ['', Validators.compose([Validators.required])],
      data_nascimento: ['', Validators.compose([Validators.required])],
      cpf: ['', Validators.compose([Validators.required, CpfValidator.isValid])],
      telefone: ['', Validators.compose([Validators.required, Validators.minLength(10), , Validators.maxLength(11)])],
    });
    this.addressDataForm = formBuilder.group({
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signupUser() {
    console.log(this.newUser);
  }

  next() {
    if(this.step < this.STEP_ADDRESS_DATA)
      this.step++;
  }

  previous() {
    if(this.step > this.STEP_ACCOUNT_DATA)
      this.step--;
  }

}
