import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
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

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
    public viewCtrl: ViewController,
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

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  

  goFacturaDetalle(factura): void {
    this.navCtrl.push('FacturasTiendaDetallePage',{
      factura: factura
    });
  }

}
