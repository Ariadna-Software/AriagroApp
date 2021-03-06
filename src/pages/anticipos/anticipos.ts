import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; 
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as numeral from 'numeral';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-anticipos',
  templateUrl: 'anticipos.html',
})
export class AnticiposPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  anticipos: any = [];

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
        this.ariagroData.getAnticipos(this.settings.parametros.url, this.user.ariagroId, this.campanya.ariagro)
          .subscribe(
            (data) => {
              this.cargarAnticipos(data);
            },
            (error) => {
              this.msg.showAlert(error);
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

  cargarAnticipos(anticipos): void {
    anticipos.forEach(a => {
      a.fecfactuFormat = moment(a.fecfactu).format('DD/MM/YYYY');
      a.fecfactu = moment(a.fecfactu).format('YYYY-MM-DD');
      a.baseimpo = numeral(a.baseimpo).format('0,0.00');
      a.imporiva = numeral(a.imporiva).format('0,0.00');
      a.impreten = numeral(a.impreten).format('0,0.00');
      a.totalfac = numeral(a.totalfac).format('0,0.00');
      a.lineas.forEach(l => {
        l.kilosnet = numeral(l.kilosnet).format('0,0');
        l.imporvar = numeral(l.imporvar).format('0,0.00');
      });
    });
    this.anticipos = anticipos;
  }


  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  

  goAnticipo(anticipo): void {
    this.navCtrl.push('AnticiposDetallePage',{
      anticipo: anticipo
    });
  }

}
