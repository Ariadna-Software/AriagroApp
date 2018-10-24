import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  user: any = {};

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        if (this.settings.user) {
          this.user = this.settings.user;
          this.ariagroData.login(this.settings.parametros.url, this.user.login, this.user.password)
          .subscribe(
            (data) => {
              this.settings.user = data;
              this.user = this.settings.user;
              this.localData.saveSettings(this.settings);
              
            },
            (error) => {
                this.msg.showAlert(error);
            }
          );
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
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

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  cambioDatos(): void {
   this.ariagroData.comprobarHost(this.settings.parametros.url)
   .subscribe(
     (data) => {
      if(data){
        if(!data.smtpConfig.host || data.smtpConfig.host == "") {
          this.showAlert("ERROR", "Opción no disponible, consulte con su coperativa");
        }else {
          let modal = this.modalCtrl.create('ModalDatosCambiarPage');
          modal.present();
        }
      }
     },
     (err) => {
      this.msg.showAlert(err);
     }
   )
  }

}
