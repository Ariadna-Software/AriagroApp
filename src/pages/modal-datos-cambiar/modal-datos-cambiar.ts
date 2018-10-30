import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
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

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider, public navParams: NavParams,
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
            var label;
            var contador = 0;

            for (var propiedad in this.user){
              
              if(this.user[propiedad] != this.userCopia[propiedad]) {
                label = propiedad.toString();
                texto += label + ": " + this.userCopia[propiedad] + "\n";
                contador ++;
              }
            }

           

            texto += " Datos después de la modificación \n";

            for (var propiedad_dos in this.user){
              
              if(this.user[propiedad_dos] != this.userCopia[propiedad_dos]) {
                label = propiedad_dos.toString();
                texto += label + ": " + this.user[propiedad_dos] + "\n";
              }
            }

            if(contador > 0) {
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
                    this.showExito("", "Mensaje enviado correctamente");
                  },
                  (error)=>{
                    loading.dismiss();
                  if (error) {
                    this.msg.showAlert(error);
                  } else {
                    this.showAlert("ERROR", "Error de conexión. Revise disponibilidad de datos y/o configuración");
                  }
                });

            } else {
              this.showAlert("", "No se ha cambiado ningún dato");
            }
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
