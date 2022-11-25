import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; 
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
//import { OneSignal } from '@ionic-native/onesignal';
import OneSignal from 'onesignal-cordova-plugin';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";ex
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  login: string = "";
  password: string = "";
  nombreCooperativa: string = "LA COOPPP";
  oneSignal = OneSignal;

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider, public appVersion: AppVersion, public navParams: NavParams, public plt: Platform, public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
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
            delete data.socio;
            this.settings.user = data;
            this.ariagroData.getCampanyaActual(this.settings.parametros.url)
            .subscribe(
              (data) => {
                console.log('data:' + data);
                this.settings.campanya = data[0];
                this.localData.saveSettings(this.settings);
                this.pushUser();
                this.navCtrl.setRoot('HomePage');
              },
              (error) => {
                
                this.msg.showAlert(error);
              }
            );
          },
          (error) => {
            this.msg.showErrorLogin(error)
          }
        );
    }
  }

  

  pushUser() {
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

            
              // Registro OneSignal
               OneSignal.setAppId(config.paramPush.appId);

               OneSignal.getDeviceState((state) => {
                console.log(state.userId);
                var myUser = this.settings.user;
            
                //alert(JSON.stringify(ids));
               
            
                  myUser.playerId = state.userId;
                  this.ariagroData.putUsuario(this.settings.parametros.url, myUser.usuarioPushId, myUser)
                    .subscribe((data) => {
                      this.settings.user = data;
                    },
                      (err) => {
                        this.msg.showAlert(err);
                      });
                
              });
             
              },
                (error) => {
                  loading.dismiss();
                  this.msg.showAlert(error);
                });
          },
          (err) => {
            if (err) {
              this.msg.showAlert(err);
            }
          });
  }



  goConexion(): any {
    this.navCtrl.push('ParametrosPage');
  }

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }
}
