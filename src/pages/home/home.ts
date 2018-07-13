import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
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
 segundoPlano:boolean = false;
  nombreCooperativa: string = "";
  nombreUsuario: string = "";
  nombreCampanya: string = "Campaña actual";
  mensajes: any = [];
  numNoLeidos: number = 0;
  version: string = "ARIAGRO APP V2";
  segundoPlano: boolean = false;
  primeraCarga = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform,
    public alertCrtl: AlertController, public ariagroData: AriagroDataProvider, public localData: LocalDataProvider,
    public loadingCtrl: LoadingController, public appVersion: AppVersion, public oneSignal: OneSignal) {

  }



  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.segundoPlano = false;
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
          this.showAlert("ERROR", JSON.stringify(error, null, 4));
        }
      );
  }

  regOneSignal(): void {
    this.plt.ready().then(() => {
      this.plt.resume.subscribe(() => {
        this.segundoPlano = true;
        this.primeraCarga = false;
        console.log(this.segundoPlano);
      }); 
      try {
        // Registro OneSignal
        this.oneSignal.startInit(this.settings.paramPush.appId, this.settings.paramPush.gcm);


        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationReceived()
        .subscribe(jsonData => {
          if(this.segundoPlano == false) {
            let alert = this.alertCrtl.create({
              title: '',
              subTitle: 'Mensaje recibido',
              buttons: [
                {
                  text: 'Aceptar',
                  handler: () => {
                    this.ariagroData.getMensajeHttp(this.settings.parametros.url, jsonData.payload.additionalData.mensajeId)
                    .subscribe((data) => {
                      data.fecha = moment(data.fecha).format('DD/MM/YYYY HH:mm:ss');
                      this.navCtrl.push('MensajesDetallePage', {
                        mensaje: data
                      });
                    },
                    (error) => {
                      this.showAlert("ERROR", JSON.stringify(error, null, 4));
                    });
                  }
                }
              ]
            });
            alert.present();
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          }
        });

       this.oneSignal.handleNotificationOpened()
          .subscribe(jsonData => {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            if(this.segundoPlano || this.primeraCarga == true){
              this.ariagroData.getMensajeHttp(this.settings.parametros.url, jsonData.notification.payload.additionalData.mensajeId)
              .subscribe((data) => {
                data.fecha = moment(data.fecha).format('DD/MM/YYYY HH:mm:ss');
                this.navCtrl.push('MensajesDetallePage', {
                  mensaje: data
                });
              },
                (error) => {
                  this.showAlert("ERROR", JSON.stringify(error, null, 4));
                });
            }
          });



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
                  var msg = err || err.message;
                  this.showAlert("ERROR", msg);
                });
          }
        },
          (error) => {
            if (error.status == 404) {
              this.showAlert("AVISO", "Usuario o contraseña incorrectos");
            }
          });
        this.oneSignal.endInit();
      } catch (e) {
        console.log("Error de carga de oneSignal");
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
}
