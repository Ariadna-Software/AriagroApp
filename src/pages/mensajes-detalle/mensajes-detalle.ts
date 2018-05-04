import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the MensajesDetallePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mensajes-detalle',
  templateUrl: 'mensajes-detalle.html',
})
export class MensajesDetallePage {

  settings: any = {};
  campanya: any = {};
  user: any = {};
  mensaje: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
  }


  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.mensaje = this.navParams.get('mensaje');
        this.ariagroData.putMensajeUsuario(this.settings.parametros.url, this.user.usuarioPushId, this.mensaje.mensajeId, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        .subscribe(
          (data) => {
          },
          (error) => {
            this.showAlert("ERROR", JSON.stringify(error, null, 4));
          }
        );
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
      
    });

  }

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}

