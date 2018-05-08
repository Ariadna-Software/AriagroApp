import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, LoadingController } from 'ionic-angular';
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
  user: any = {}
  userCopia: any = {
    nombre: "",
    direccion: "",
    codPostal: "",
    poblacion: "",
    provincia: "",
    telefono1: "",
    telefono2: "",
    email: "",
    iban: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public modalCtrl: ModalController, 
  public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        if (this.settings.user) {
          this.reemplazaNull(this.settings.user);
          this.user = this.settings.user;
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }


  reemplazaNull(user): void {
    for (var propiedad in user){
      console.log(propiedad," ",user[propiedad]);
      if(user[propiedad] === null) {
        user[propiedad] = " "
      }
      
  }
    this.user = user;
    this.userCopia = JSON.parse( JSON.stringify(user));//realizamos una copia del objeto user
  }

  cambioDatos = function() {
            var texto = " Datos antes de la modificación \n";
            texto += "Nombre: " + this.userCopia.nombre + "\n";
            texto += "NIF: " + this.userCopia.nif + "\n";
            texto += "Dirección: " + this.userCopia.direccion + "\n";
            texto += "Cod. Postal: " + this.userCopia.codPostal + "\n";
            texto += "Población: " + this.userCopia.poblacion + "\n";
            texto += "Provincia: " + this.userCopia.provincia + "\n";
            texto += "Cod. Postal: " + this.userCopia.codPostal + "\n";
            texto += "Telefono(1): " + this.userCopia.telefono1 + "\n";
            texto += "Teléfono(2): " + this.userCopia.telefono2 + "\n";
            texto += "Correo: " + this.userCopia.email + "\n";
            texto += "IBAN: " + this.userCopia.iban + "\n";

            texto += " Datos después de la modificación \n";
            texto += "Nombre: " + this.user.nombre + "\n";
            texto += "NIF: " + this.user.nif + "\n";
            texto += "Dirección: " + this.user.direccion + "\n";
            texto += "Cod. Postal: " + this.user.codPostal + "\n";
            texto += "Población: " + this.user.poblacion + "\n";
            texto += "Provincia: " + this.user.provincia + "\n";
            texto += "Cod. Postal: " + this.user.codPostal + "\n";
            texto += "Telefono(1): " + this.user.telefono1 + "\n";
            texto += "Teléfono(2): " + this.user.telefono2 + "\n";
            texto += "Correo: " + this.user.email + "\n";
            texto += "IBAN: " + this.user.iban + "\n";


            var asunto = "Solicitud cambio de datos (" + this.userCopia.nombre + ")";
            var correo = {
                asunto: asunto,
                texto: texto
            }
            let loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
            loading.present();
            this.ariagroData.postCorreo(this.settings.parametros.url, correo)
              .subscribe(
                (data) => {
                  loading.dismiss();
                  this.showExito("EXITO", "Correo eviado");
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
