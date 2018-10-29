import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; 
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-campanyas',
  templateUrl: 'campanyas.html',
})
export class CampanyasPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanyas: any = [];

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
     public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.ariagroData.getCampanyas(this.settings.parametros.url)
          .subscribe(
            (data) => {
              this.cargarCampanyas(data);
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

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  cargarCampanyas(campanyas): void {
   
    campanyas.forEach(c => this.campanyas.push(c));
  }

  setCampanya(campanya): void {
    this.settings.campanya = campanya;
    this.localData.saveSettings(this.settings);
    this.navCtrl.setRoot('HomePage');
  }

}
