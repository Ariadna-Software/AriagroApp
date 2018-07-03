import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

import { OneSignal, OSNotificationPayload } from '../../providers/onesignal';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  settings: any = {};
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  login: string = "";
  password: string = "";
  nombreCooperativa: string = "LA COOPPP";

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public loadingCtrl: LoadingController, 
    public formBuilder: FormBuilder, public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public oneSignal: OneSignal) {
    this.loginForm = formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.nombreCooperativa = this.settings.parametros.nombre;
        this.viewCtrl.setBackButtonText('');
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  doLogin(): void {
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.ariagroData.login(this.settings.parametros.url, this.login, this.password)
        .subscribe(
          (data) => {
            this.settings.user = data;
            this.settings.campanya = {
              codempre: 0,
              nomresum: 'Campaña actual',
              ariagro: 'ariagro'
            }
            this.localData.saveSettings(this.settings);
            this.pushUser(this.settings.user);
            this.navCtrl.setRoot('HomePage');
          },
          (error) => {
            if (error.status == 404) {
              this.showAlert("AVISO", "Usuario o contraseña incorrectos");
            } else {
              this.showAlert("ERROR", JSON.stringify(error, null, 4));
            }
          }
        );
    }
  }

 

  pushUser(user) {
        this.plt.ready().then( () => {
            // obtener los parámetros
        let loading = this.loadingCtrl.create({ content: 'Buscando mensajes...' });
        loading.present();
        this.ariagroData.getParametros(this.settings.parametros.url)
        .subscribe(
          (data) => {
              loading.dismiss();
              
              var config = this.settings;
              config.paramPush = data
              
              this.localData.saveSettings(config)

              var notificationOpenedCallback = function(jsonData) {
                alert("NOTIFICA LOGIN:\n" + JSON.stringify(jsonData));
                console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            };

              
            try{
              // Registro OneSignal
              this.oneSignal.startInit(config.paramPush.appId,  config.paramPush.gcm );
              
                            
                            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

                            this.oneSignal.handleNotificationReceived()
                            .subscribe(jsonData => {
                             
                            });
                            

                            this.oneSignal.handleNotificationOpened()
                            .subscribe(jsonData => {
                              this.navCtrl.push('MensajesPage');
                            });

                            this.oneSignal.getIds().then( (ids) =>{
                              var myUser = this.settings.user;
                                
                                //alert(JSON.stringify(ids));
                                if(config.user.playerId != ids.userId) {
                                 
                                  myUser.playerId = ids.userId;
                                  this.ariagroData.putUsuario(this.settings.parametros.url, myUser.usuarioPushId ,myUser)
                                  .subscribe((data) => {
                                      this.settings.user = data;
                                  },
                                  (err) => {
                                    loading.dismiss();
                                    console.log("PUT usuario error");
                                  }); 
                                }
                            },
                            (error) => {
                              if (error.status == 404) {
                                this.showAlert("AVISO", "Usuario o contraseña incorrectos");
                              } else {
                                this.showAlert("ERROR", JSON.stringify(error, null, 4));
                              }
                            });
                            this.oneSignal.endInit();
            }  catch(e) {
              console.log("Error de carga de oneSignal");
            }
              
          },
          (err) => {
            loading.dismiss();
            if (err) {
                var msg = err || err.message;
                this.showAlert("ERROR", msg);
            } 
          });
        });
  }


  goConexion(): any {
    this.navCtrl.push('ParametrosPage');
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

  

}
