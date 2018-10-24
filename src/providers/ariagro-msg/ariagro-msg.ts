import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  AlertController } from 'ionic-angular'

/*
  Generated class for the AriagroMsgProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AriagroMsgProvider {

  constructor(public http: HttpClient, public alertCrtl: AlertController) {
   
  }

  showAlert(error): void {
    var title;
    var subtitle;
    if(error.status == 404) {
      title = "AVISO";
      subtitle = "Recurso no encontrado";
    }
    else if(error.status == 0) {
      title = "ERROR"
      subtitle = "Fallo al conectar al servidor, reintente operación o revise su conexion"
    } else {
      title = "ERROR";
      subtitle =  JSON.stringify(error, null, 4);
    }
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorLogin() {
    var title = "AVISO";
    var subtitle = "Usuario o contraseña incorrectos";
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
