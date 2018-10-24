import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-parametros',
  templateUrl: 'parametros.html',
})
export class ParametrosPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  parametrosForm: FormGroup;
  submitAttempt: boolean = false;
  numeroCooperativa: string = "";

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
    public formBuilder: FormBuilder, public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
    this.parametrosForm = formBuilder.group({
      numeroCooperativa: ['', Validators.compose([Validators.required])]
    });

  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
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

  doSearch(): void {
    this.submitAttempt = true;
    if (this.parametrosForm.valid) {
      this.ariagroData.getParametrosCentral(this.numeroCooperativa)
        .subscribe(
          (data) => {
            this.settings.parametros = data;
            this.localData.saveSettings(this.settings);
            this.navCtrl.setRoot('LoginPage');
          },
          (error) => {
            if (error.status == 404) {
              let alert = this.alertCrtl.create({
                title: "AVISO",
                subTitle: "No se ha encontrado ninguna cooperativa con ese número",
                buttons: ['OK']
              });
              alert.present();
            } else {
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

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }
}
