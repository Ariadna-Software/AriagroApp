import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; 
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
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
  ocultar: boolean = true;
  iban1: any = "";
  iban: any = "";

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
     public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        if (this.settings.user) {
          this.user = this.settings.user;
          var longitud = this.user.iban.length - 6;
          this.iban1 = this.user.iban.substr(0, longitud);
          this.iban = this.iban1 + "******";

          this.ariagroData.login(this.settings.parametros.url, this.user.login, this.user.password)
          .subscribe(
            (data) => {
              this.settings.user = data;
              this.user = this.settings.user;
              this.localData.saveSettings(this.settings);
              this.renovarParametros();
              
            },
            (error) => {
              this.msg.showErrorPersoinalizado("Fallo al actualizar usuario", JSON.stringify(error));
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

  renovarParametros(): void {
    this.ariagroData.getParametrosCentral(this.settings.parametros.parametroId)
        .subscribe(
          (data) => {
            this.settings.parametros = data;
            this.localData.saveSettings(this.settings);
            if(this.settings.parametros.noComunicarCoop != 1) {
              this.ocultar = false;
            } else { this.ocultar = true; }
          },
          (error) => {
            if (error.status == 404) {
              this.msg.showErrorPersoinalizado("AVISO, Fallo al Actualizar Parametros", "No se ha encontrado ninguna cooperativa con ese número, consulte con su cooperativa");
            } else {
              this.msg.showAlert(error);
            }
          }
        );
}


  cambioDatos(): void {
   this.ariagroData.comprobarHost(this.settings.parametros.url)
   .subscribe(
     (data) => {
      if(data){
        if(!data.smtpConfig.host || data.smtpConfig.host == "") {
          this.msg.showErrorPersoinalizado("ERROR", "Correo no configurado, consulte con su cooperativa");
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
