import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settings: any = {};
  nombreCooperativa: string = "";
  nombreUsuario: string = "";
  nombreCampanya: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCrtl: AlertController, public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {

  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.nombreCooperativa = this.settings.parametros.nombre;
        if (this.settings.user) {
          this.nombreUsuario = this.settings.user.nombre;
          this.nombreCampanya = "Campaña actual";
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  goLogin(): void {
    this.navCtrl.setRoot('LoginPage');
  }
}
