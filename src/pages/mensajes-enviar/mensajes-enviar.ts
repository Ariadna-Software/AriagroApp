import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-mensajes-enviar',
  templateUrl: 'mensajes-enviar.html',
})
export class MensajesEnviarPage {

 settings: any = {};
 segundoPlano:boolean = false;
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  mensajes: any = [];
  correo: any = {
    texto: ""
  }
  texto: string = "";
  mensForm: FormGroup;
  submitAttempt: boolean = false;


  constructor(public navCtrl: NavController,  public appVersion: AppVersion, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public formBuilder: FormBuilder) {

      this.mensForm = formBuilder.group({
        texto: ['', Validators.compose([Validators.required])]
      });
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

  enviarMensaje(): void {
    this.submitAttempt = true;
    if(this.mensForm.valid){
      this.correo.texto = this.texto
      this.correo.asunto = "Mensaje de " + this.user.nombre;
      let loading = this.loadingCtrl.create({ content: 'Enviando mensaje...' });
      loading.present();
      this.ariagroData.postCorreo(this.settings.parametros.url, this.correo)
        .subscribe(
          (data) =>{
          loading.dismiss();
          this.showExito("", "Mensaje enviado con exito");
        
      },
      (error) =>{
        loading.dismiss();
        if (error) {
            this.showAlert("ERROR", JSON.stringify(error, null, 4));
            
        } else {
          this.showAlert("ERROR", "Error de conexión. Revise disponibilidad de datos y/o configuración");
        }
      });
    } else {
      this.showAlert("ERROR", "No se puede enviar un mensaje sin texto");
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

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

}
