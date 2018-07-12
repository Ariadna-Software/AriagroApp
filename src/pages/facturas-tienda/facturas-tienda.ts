import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-facturas-tienda',
  templateUrl: 'facturas-tienda.html',
})
export class FacturasTiendaPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  facturas: any = [];
  numfacturas: number = 0;

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
        this.facturas = this.navParams.get('facturas');
        this.numfacturas = this.facturas.length;
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
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

  goFacturaDetalle(factura): void {
    this.navCtrl.push('FacturasTiendaDetallePage',{
      factura: factura
    });
  }

}
