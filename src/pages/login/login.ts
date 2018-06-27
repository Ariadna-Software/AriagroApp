import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

import { OneSignal } from '../../providers/onesignal';

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

 

  pushUser = function(user) {
    this.plt.ready(function() {
        // obtener los parámetros
        let loading = this.loadingCtrl.create({ content: 'Buscando mensajes...' });
        loading.present();
        this.ariagroData.getParametros(this.settings.parametros.url)
        .subscribe(
          (data) => {
              loading.dismiss();
              var param = data;
              var config = this.settings;
              config.appId = param.appId;
              config.gcm = param.gcm;
              this.localData.saveSettings(config)
              var notificationOpenedCallback = function(jsonData) {
                  alert("NOTIFICA LOGIN:\n" + JSON.stringify(jsonData));
                  console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
              };
  
              // Registro OneSignal
              var notificationOpenedCallback = function(jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
              };
        
             
             
            
              
              this.oneSignal.init(config.appId, {googleProjectNumber: config.gcm },notificationOpenedCallback);
              this.oneSignal.enableInAppAlertNotification(true);
        
              this.oneSignal.getIds(function(ids) {
                  var myUser = this.settings.user;
                  myUser.playerId = ids.userId;
                  //alert(JSON.stringify(ids));
                  this.putUsuario(myUser).
                  success(function(data) {
                      this.settings.user = data;
                  }).
                  error(function(err, statusCode) {
                    loading.dismiss();
                      if (err) {
                          var msg = err || err.message;
                          this.showAlert(msg);
                         
                      } else {
                        this.showAlert("Error de conexión. Revise disponibilidad de datos y/o configuración");
                      }
                  });
  
              });
          
          },
          (error) => {
            if (error.status == 404) {
              this.showAlert("AVISO", "Usuario o contraseña incorrectos");
            } else {
              this.showAlert("ERROR", JSON.stringify(error, null, 4));
            }
          }
        );
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
