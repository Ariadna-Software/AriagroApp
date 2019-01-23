import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-mensajes',
  templateUrl: 'mensajes.html',
})
export class MensajesPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  mensajes: any = [];
  ocultar: boolean = false;

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
    public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
  }


  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.cargarMensajes();
        this.renovarParametros();

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

  renovarParametros(): void {
    this.ariagroData.getParametrosCentral(this.settings.parametros.parametroId)
        .subscribe(
          (data) => {
            this.settings.parametros = data;
            this.localData.saveSettings(this.settings);
            if(this.settings.parametros.noComunicarCoop != 1) {
              this.ocultar = true;
            } else { this.ocultar = false; }
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

  cargarMensajes(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando mensajes...' });
    loading.present();
    this.ariagroData.getMensajesUsuario(this.settings.parametros.url, this.settings.user.usuarioPushId)
    .subscribe(
      (data) => {
        
        loading.dismiss();
        if(data.length > 0) {
          data.forEach(f => {
            f.fecha = moment(f.fecha).format('DD/MM/YYYY HH:mm:ss');
            
          });
         
        this.mensajes = data;
        } 
      },
      (error) => {
        loading.dismiss();
        this.msg.showAlert(error);
      }
    );
  }

  

  goMensajeDetalle(mensaje): void {
    this.navCtrl.push('MensajesDetallePage', {
      mensaje: mensaje
    });
  }

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  crearMensaje(): void {
    this.navCtrl.push('MensajesEnviarPage', {
    });
  }
}
