import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settings: any = {};
  nombreCooperativa: string = "";
  nombreUsuario: string = "";
  nombreCampanya: string = "Campaña actual";
  mensajes: any = [];
  numNoLeidos: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCrtl: AlertController, public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, 
  public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.nombreCooperativa = this.settings.parametros.nombre;
        if (this.settings.user) {
          this.nombreUsuario = this.settings.user.nombre;
          this.nombreCampanya = this.settings.campanya.nomresum;
          this.cargarMensajes();

        } else {
          this.navCtrl.setRoot('LoginPage');
        }
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  cargarMensajes(): void {
    let loading = this.loadingCtrl.create({ content: 'Buscando mensajes...' });
    loading.present();
    this.ariagroData.getMensajesUsuario(this.settings.parametros.url, this.settings.user.usuarioPushId)
    .subscribe(
      (data) => {
        this.numNoLeidos = 0;
        loading.dismiss();
        if(data.length > 0) {
          data.forEach(f => {
            if(f.estado != 'LEIDO') {this.numNoLeidos++;
            }
          });
        this.mensajes = data;
        } 
      },
      (error) => {
        loading.dismiss();
        this.showAlert("ERROR", JSON.stringify(error, null, 4));
      }
    );
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
