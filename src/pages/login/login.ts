import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public alertCrtl: AlertController, public viewCtrl: ViewController,
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
  }

  doLogin(): void {
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.ariagroData.login(this.settings.parametros.url, this.login, this.password)
      .subscribe(
        (data)=>{
          this.settings.user = data;
          this.localData.saveSettings(this.settings);
          this.navCtrl.setRoot('HomePage');
        },
        (error)=>{
          if (error.status == 404){
            let alert = this.alertCrtl.create({
              title: "AVISO",
              subTitle: "Usuario o contraseña incorretos.",
              buttons: ['OK']
            });
            alert.present();
          }else{
            let alert = this.alertCrtl.create({
              title: "ERROR",
              subTitle: JSON.stringify(error, null, 4),
              buttons: ['OK']
            });
            alert.present();
          }
        }
      );
    }
  }

  goConexion(): any {
    this.navCtrl.push('ParametrosPage');
  }

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

}
