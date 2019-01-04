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
      var title = "ERROR";
      var subtitle =  JSON.stringify(error, null, 4);
    if(error.status == 0) {
      title = "ERROR"
      subtitle = "Fallo al conectar al servidor, reintente operación o revise su conexion"
    } 
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorLogin(error) {
    var title = "ERROR";
    var subtitle =  JSON.stringify(error, null, 4);
    if (error.status == 404) {
      title = "AVISO";
      subtitle = "Usuario o contraseña incorrectos";  
    }
    if(error.status == 0) {
      title = "ERROR"
      subtitle = "Fallo al conectar al servidor, reintente operación o revise su conexion"
    } 
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorPersoinalizado(title, subtitle) {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
