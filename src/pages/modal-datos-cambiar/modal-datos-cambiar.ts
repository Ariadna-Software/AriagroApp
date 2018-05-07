import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';


/**
 * Generated class for the ModalDatosCambiarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-datos-cambiar',
  templateUrl: 'modal-datos-cambiar.html',
})
export class ModalDatosCambiarPage {
  settings: any = {};
  user: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        if (this.settings.user) {
          this.user = this.settings.user;
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  cambioDatos = function() {
            var texto = "Nombre: " + this.user.nombre + "\n";
            texto += "NIF: " + this.user.nif + "\n";
            texto += "Dirección: " + this.user.direccion + "\n";
            texto += "Cod. Postal: " + this.user.codPostal + "\n";
            texto += "Población: " + this.user.problacion + "\n";
            texto += "Provincia: " + this.user.Provincia + "\n";
            texto += "Cod. Postal: " + this.user.codPostal + "\n";
            texto += "Telefono(1): " + this.user.telefono1 + "\n";
            texto += "Teléfono(2): " + this.user.telefono2 + "\n";
            texto += "Correo: " + this.user.email + "\n";
            texto += "IBAN: " + this.user.iban + "\n";
            var asunto = "Solicitud cambio de datos (" + this.user.nombre + ")";
            var correo = {
                asunto: asunto,
                texto: texto
            }
            let loading = this.loadingCtrl.create({ content: 'Buscando mensajes...' });
            loading.present();
            this.ariagroData.postCorreo(this.settings.url, correo)
              .subscribe(
                (data) => {
                  loading.dismiss();
                  this.showExito("EXITO", "Mensaje eviado");
            },
            (error)=>{
                loading.dismiss();
                if (error) {
                  this.showAlert("ERROR", JSON.stringify(error, null, 4));
                  
              } else {
                this.showAlert("ERROR", "Error de conexión. Revise disponibilidad de datos y/o configuración");
              }
            });

  }
  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK'],
    });
    alert.present();
  }
    
  showExito(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text:'OK',
          handler: () => {
            this.navCtrl.pop();
          }
      }
      
      ]
    });
    alert.present();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

}
