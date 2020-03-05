import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { OneSignal } from '@ionic-native/onesignal';

import * as moment from 'moment';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 settings: any = {};
  nombreCooperativa: string = "";
  nombreUsuario: string = "";
  nombreCampanya: string;
  mensajes: any = [];
  numNoLeidos: number = 0;
  version: string = "ARIAGRO APP V2";
  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider, public navParams: NavParams, public plt: Platform,
     public ariagroData: AriagroDataProvider, public localData: LocalDataProvider,
    public loadingCtrl: LoadingController, public appVersion: AppVersion, public oneSignal: OneSignal) {

  }



  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.nombreCooperativa = this.settings.parametros.nombre;
        if (this.settings.user) {
          this.nombreUsuario = this.settings.user.nombre;
          this.nombreCampanya = this.settings.campanya.nomresum;
          this.cargarMensajes();
          if (this.settings.paramPush && this.settings.paramPush.appId && this.settings.paramPush.gcm) {
            this.regOneSignal();
          }

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

  cargarMensajes(): void {
    this.numNoLeidos = 0;
    this.ariagroData.getMensajesUsuario(this.settings.parametros.url, this.settings.user.usuarioPushId)
      .subscribe(
        (data) => {
          this.numNoLeidos = 0;
          if (data.length > 0) {
            data.forEach(f => {
              f.fecha = moment(f.fecha).format('DD/MM/YYYY HH:mm:ss');
              if (f.estado != 'LEIDO') {
                this.numNoLeidos++;
              }
            });
            this.mensajes = data;
          }
        },
        (error) => {
          this.msg.showAlert(error);
        }
      );
  }

  regOneSignal(): void {
    this.plt.ready().then(() => {
      try {
        // Registro OneSignal
        this.oneSignal.startInit(this.settings.paramPush.appId, this.settings.paramPush.gcm);


        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

       this.oneSignal.handleNotificationOpened()
        .subscribe(jsonData => {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            this.ariagroData.getMensajeHttp(this.settings.parametros.url, jsonData.notification.payload.additionalData.mensajeId)
              .subscribe(
                (data) => {
                  data.fecha = moment(data.fecha).format('DD/MM/YYYY HH:mm:ss');
                  this.navCtrl.push('MensajesDetallePage', {
                  mensaje: data
                });
                },
                (error) => {
                  this.msg.showAlert(error);
                });
        });

       /*this.oneSignal.handleNotificationReceived()
          .subscribe(jsonData => {
            this.cont = 1;
           
              console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
              this.mostrarAlert(jsonData);
          
          });*/



        this.oneSignal.getIds().then((ids) => {
          var myUser = this.settings.user;

          //alert(JSON.stringify(ids));
          if (this.settings.user.playerId != ids.userId) {

            myUser.playerId = ids.userId;
            this.ariagroData.putUsuario(this.settings.parametros.url, myUser.usuarioPushId, myUser)
              .subscribe((data) => {
                this.settings.user = data;
              },
                (err) => {
                  this.msg.showAlert(err);
                });
          }
        },
          (error) => {
           
              this.msg.showErrorLogin(error);
            
          });
        this.oneSignal.endInit();
      } catch (e) {
        console.log("Error de carga de oneSignal");
      }
    });
  }

  goLogin(): void {
    this.navCtrl.push('LoginPage');
  }

  goCampanyas(): void {
    this.navCtrl.push('CampanyasPage');
  }

  goDatos(): void {
    this.navCtrl.push('DatosPage');
  }

  goCampos(): void {
    this.navCtrl.push('CamposPage');
  }

  goAnticipos(): void {
    this.navCtrl.push('AnticiposPage');
  }

  goFacturas(): void {
    this.navCtrl.push('FacturasPage');
  }

  goMensajes(): void {
    this.navCtrl.push('MensajesPage', {
      mensajes: this.mensajes
    });
  }

  goEnlaces(): void {
    this.navCtrl.push('EnlacesPage', {
      mensajes: this.mensajes
    });
  }
}
