import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-anticipos-detalle',
  templateUrl: 'anticipos-detalle.html',
})
export class AnticiposDetallePage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  campanya: any = {};
  user: any = {};
  anticipo: any = {};
  loading: any;
  correo: any;
  usaInformes: any;
  informe: any;

  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
    public alertCrtl: AlertController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider) {

  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        this.user = this.settings.user;
        this.campanya = this.settings.campanya;
        this.anticipo = this.navParams.get('anticipo');
        this.usaInformes = this.settings.parametros.usaInformes;
        //renovar configuración de usuario
        this.ariagroData.login(this.settings.parametros.url, this.user.login, this.user.password)
        .subscribe(
          (data) => {
            delete data.socio;
            this.settings.user = data;
            this.user = this.settings.user;
            this.localData.saveSettings(this.settings);
            this.correo = this.settings.user.email;
            this.renovarParametros();
          },
          (error) => {
            this.msg.showErrorPersoinalizado("Fallo al actualizar usuario", JSON.stringify(error));
          }
        );
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

  renovarParametros(): void {
    this.ariagroData.getParametrosCentral(this.settings.parametros.parametroId)
        .subscribe(
          (data) => {
            this.settings.parametros = data;
            this.localData.saveSettings(this.settings);
          },
          (error) => {
            if (error.status == 404) {
              this.msg.showErrorPersoinalizado("AVISO, Fallo al Actualizar Parametros", "No se ha encontrado ninguna cooperativa con ese número, consulte con su cooperativa");
            } else {
              this.msg.showAlert(error);
            }
          }
        );
  }

  comprobarCorreo(): void {
    if(this.usaInformes == 0) {
      this.msg.showErrorPersoinalizado('', 'Funcionalidad no habilitada, póngase en contacto con su cooperativa');
    }
    else if(this.anticipo.codtipom != "FAA" && this.anticipo.codtipom != 'FAL'){
      this.msg.showErrorPersoinalizado('', 'Tipo de factura no disponible, póngase en contacto con su cooperativa');
    }else {
      var mens = "";
      var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
      if (emailRegex.test(this.correo)) {
        mens = 'Este es el correo al cual se va a enviar la factura. Puede introducir otro.';
      } else {
        mens = 'Correo incorrecto, introduzca un correo.';
      }
      this.mostrarCorreo(mens);
    }
  }

  comprobarPlantillas(){
    if(this.anticipo.codtipom == "FAA") {
      this.informe = this.settings.parametros.infFAA;
    } else {
      this.informe = this.settings.parametros.infFAL;
    }
    
    if(this.informe == "" || this.informe == null){
      this.msg.showErrorPersoinalizado('', 'Plantilla de factura no configurada');
    }else {
      this.comprobarCorreo();
    }
  }

  mostrarCorreo(mens) {
    let alert = this.alertCrtl.create({
      title: mens,
      inputs: [
        {
          name: 'Correo',
          value:  this.correo
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
            if (emailRegex.test(data.Correo)) {
              this.correo = data.Correo;
              this.loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
              this.loading.present();
              
              this.ariagroData.prepararCorreoFactu(this.settings.parametros.url, this.campanya.ariagro, this.anticipo.numfactu, this.informe, this.anticipo.codtipom, this.settings.parametros.parametroId)
              .subscribe(
                (data) => {
                  this.enviarCorreo(data);
                },
                (error) => {
                  this.msg.showAlert(error);
                  this.loading.dismiss();
                }
              );
            }else {
              mens = 'Correo incorrecto, introduzca un correo';
              this.mostrarCorreo(mens);
            }
          }
        }
      ]
    });
    alert.present();
  }

  enviarCorreo(ruta): void {
    this.ariagroData.enviarCorreoFactu(this.settings.parametros.url, this.anticipo.numfactu, this.correo, ruta, this.campanya.nomempre, this.anticipo.codtipom)
      .subscribe(
        (data) => {
          this.loading.dismiss();

          this.msg.showErrorPersoinalizado("", 'MENSAJE ENVIADO');
          if( this.settings.user.email == ""){
            this.correo = null;
          }
          
        },
        (error) => {
          this.msg.showAlert(error);
          this.loading.dismiss();
        }
      );
  }



  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  showAlert(title, subTitle): void {
    let alert = this.alertCrtl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }


}
