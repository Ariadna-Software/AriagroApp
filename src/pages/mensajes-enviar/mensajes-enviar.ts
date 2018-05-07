import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-mensajes-enviar',
  templateUrl: 'mensajes-enviar.html',
})
export class MensajesEnviarPage {

  settings: any = {};
  campanya: any = {};
  user: any = {};
  mensajes: any = [];
  correo: any = {
    texto: ""
  }


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {
  }


  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
      } else {
        this.navCtrl.setRoot('ParametrosPage');
      }
    });
  }

  enviarMensaje(): void {
    this.correo.asunto = "Mensaje de " + this.user.nombre;
    let loading = this.loadingCtrl.create({ content: 'Enviando mensaje...' });
    loading.present();
    this.ariagroData.postCorreo(this.settings.parametros.url, this.correo)
      .subscribe(
        (data) =>{
        loading.dismiss();
        this.showExito("EXITO", "Mensaje eviado");
        
    },
    (error) =>{
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

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

}
