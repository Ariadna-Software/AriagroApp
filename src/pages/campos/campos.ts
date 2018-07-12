import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-campos',
  templateUrl: 'campos.html',
})
export class CamposPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  variedades: any = [];

  constructor(public navCtrl: NavController,  public appVersion: AppVersion, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.ariagroData.getCampos(this.settings.parametros.url, this.user.ariagroId, this.campanya.ariagro)
          .subscribe(
            (data) => {
              this.cargarVariedades(data);
            },
            (error) => {
              this.showAlert("ERROR", JSON.stringify(error, null, 4));
            }
          );
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
    try {
      this.appVersion.getVersionNumber().then(vrs => {
        this.version = "ARIAGRO APP V" + vrs;
      },
        error => {
          // NO hacemos nada, en realidad protegemos al estar en debug
          // con el navegador
        });
    } catch (error) {

    }
  }

  cargarVariedades(variedades): void {
    this.variedades = [];
    variedades.forEach(v => {
      v.numkilos = numeral(v.numkilos).format('0,0');
      v.campos.forEach(c => {
        c.kilos = numeral(c.kilos).format('0,0');
      });
      this.variedades.push(v);
    })
  }
  toggleSection(i) {
    this.variedades[i].open = !this.variedades[i].open;
  }

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  goEntradas(campo): void {
    this.navCtrl.push('EntradasPage', {campo: campo});
  }

}
