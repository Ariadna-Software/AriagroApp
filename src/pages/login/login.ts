import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  login: string = "";
  password: string = "";
  nombreCooperativa: string = "LA COOPPP";

  constructor(public navCtrl: NavController,  public appVersion: AppVersion, public navParams: NavParams, public plt: Platform, public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder, public viewCtrl: ViewController, public msg: AriagroMsgProvider,
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

  doLogin(): void {
    
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.ariagroData.login(this.settings.parametros.url, this.login, this.password)
        .subscribe(
          (data) => {
            console.log('datos:' + data)
            this.settings.user = data;
            this.ariagroData.getCampanyaActual(this.settings.parametros.url)
            .subscribe(
              (data) => {
               
                console.log('data:' + data);
                this.settings.campanya = data[0];
                this.localData.saveSettings(this.settings);
                this.pushUser(this.settings.user);
                this.navCtrl.setRoot('HomePage');
              },
              (error) => {
                
                this.msg.showAlert(error);
              }
            );
          },
          (error) => {
            console.log('error:' + error);
            this.msg.showErrorLogin()
          }
        );
    }
  }

  

  pushUser(user) {
    this.plt.ready().then(() => {
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

            try {
              // Registro OneSignal
              this.oneSignal.startInit(config.paramPush.appId, config.paramPush.gcm);
              this.oneSignal.getIds().then((ids) => {
                var myUser = this.settings.user;

                //alert(JSON.stringify(ids));
                if (config.user.playerId != ids.userId) {

                  myUser.playerId = ids.userId;
                  this.ariagroData.putUsuario(this.settings.parametros.url, myUser.usuarioPushId, myUser)
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
                  this.msg.showAlert(error);
                });
              this.oneSignal.endInit();
            } catch (e) {
              console.log("Error de carga de oneSignal");
            }

          },
          (err) => {
            loading.dismiss();
            if (err) {
              this.msg.showAlert(err);
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
}
