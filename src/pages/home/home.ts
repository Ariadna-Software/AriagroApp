import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { OneSignal } from '@ionic-native/onesignal';
import OneSignal from 'onesignal-cordova-plugin';

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
  oneSignal = OneSignal
  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider, public navParams: NavParams, public plt: Platform,
     public ariagroData: AriagroDataProvider, public localData: LocalDataProvider,
    public loadingCtrl: LoadingController, public appVersion: AppVersion) {

  }



  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.nombreCooperativa = this.settings.parametros.nombre;
        if (this.settings.user) {
          this.nombreUsuario = this.settings.user.nombre;
          this.nombreCampanya = this.settings.campanya.nomresum;
          this.renovarParametros();

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
          if (this.settings.paramPush && this.settings.paramPush.appId && this.settings.paramPush.gcm) {
            //this.regOneSignal();
            this.OneSignalInit(this.settings.paramPush.appId)
          }
        },
        (error) => {
          this.msg.showAlert(error);
        }
      );
  }
  


  OneSignalInit(appId): void {
    this.plt.ready().then(() => {
      try{
                // Uncomment to set OneSignal device logging to VERBOSE  
      //OneSignal.setLogLevel(6, 0);
  
      // NOTE: Update the setAppId value below with your OneSignal AppId.
      //this.msg.showAlert("AppId: " + appId);
      OneSignal.setAppId(appId);
      //OneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
     

      OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
        //this.msg.showAlert("OneSignal: notification will show in foreground:" + notifReceivedEvent);
        let notif = notifReceivedEvent.getNotification();
        notifReceivedEvent.complete(notif);
    });
  
      OneSignal.getDeviceState((state) => {
        console.log(state.userId);
        //this.msg.showAlert("UsuarioId:" + state.userId);
        var myUser = this.settings.user;
        if (myUser.playerId != state.userId) { 
          myUser.playerId = state.userId;
          this.ariagroData.putUsuario(this.settings.parametros.url, myUser.usuarioPushId, myUser)
            .subscribe((data) => {
              this.settings.user = data;
            },
              (err) => {
                this.msg.showAlert(err);
              });
        }
      });
     /*  OneSignal.setNotificationOpenedHandler(function(jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      });
    
      // Prompts the user for notification permissions.
      //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
      OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          console.log("User accepted notifications: " + accepted);
      }); */
    
      OneSignal.setNotificationOpenedHandler( jsonData =>{
        //this.msg(jsonData);
        this.ariagroData.getMensajeHttp(this.settings.parametros.url, jsonData.notification.additionalData["mensajeId"])
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
      })
      } catch(e) {
        console.log('Fallo carga oneSignal');
      }
      
    });     
  }


  
 /*  regOneSignal(): void {
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
 */
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

  renovarParametros(): void {
    this.ariagroData.getParametrosCentral(this.settings.parametros.parametroId)
        .subscribe(
          (data) => {
            console.log('Parametros', data);
            this.settings.parametros = data;
            this.ariagroData.getParametros(this.settings.parametros.url)
            .subscribe(
              (data2) => {
                this.settings.paramPush = data2
    
                this.localData.saveSettings(this.settings);
                this.cargarMensajes();
                  },
                    (error) => {
                      this.msg.showAlert(error);
                    });
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
}
