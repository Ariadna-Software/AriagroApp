import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { AriagroDataProvider } from '../../providers/ariagro-data/ariagro-data'; 
import { AriagroMsgProvider } from '../../providers/ariagro-msg/ariagro-msg';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {
 settings: any = {};
  version: string = "ARIAGRO APP V2";
  user: any = {};
  ocultar: boolean = true;
  nroregepa: string = '';
  usaInformes: any;
  informe: any;
  loading: any;
  correo: any;
  ejercicio: any;


  constructor(public navCtrl: NavController,  public msg: AriagroMsgProvider,  public appVersion: AppVersion, public navParams: NavParams,
     public viewCtrl: ViewController,
    public ariagroData: AriagroDataProvider, public localData: LocalDataProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public alertCrtl: AlertController) {
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.viewCtrl.setBackButtonText('');
        if (this.settings.user) {
          this.user = this.settings.user;
          if (this.user.movil) {
            console.log("Movil en contrado")
          } else {
            // AGROAPP-55 Obtener de nuevo el usuariopush logado, le falta el móvil.
            console.log("Buscar el móvil")
            this.ariagroData.login(this.settings.parametros.url, this.user.login, this.user.password)
            .subscribe(
              (data) => {
                this.settings.user = data;
                this.settings.user.movil = data.movil;
                this.user = this.settings.user;
                this.localData.saveSettings(this.settings);
                console.log("Nuevo usuario ", this.settings.user);
              },
              (error) => {
                this.msg.showErrorPersoinalizado("Fallo al actualizar usuario", JSON.stringify(error));
              }
            );
            
          }
          console.log("user", this.user);
          this.ariagroData.login(this.settings.parametros.url, this.user.login, this.user.password)
          .subscribe(
            (data) => {
              if (data.socio && data.socio.nroregepa) this.nroregepa = data.socio.nroregepa;
              delete data.socio;
              this.settings.user = data;
              this.user = this.settings.user;
              this.localData.saveSettings(this.settings);
              this.correo = this.settings.user.email;
              this.ejercicio = moment().year() - 1;
              this.renovarParametros();
            },
            (error) => {
              this.msg.showErrorPersoinalizado("Fallo al actualizar usuario", JSON.stringify(error));
            }
          );
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
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

  goHome(): any {
    this.navCtrl.setRoot('HomePage');
  }

  renovarParametros(): void {
    this.ariagroData.getParametrosCentral(this.settings.parametros.parametroId)
        .subscribe(
          (data) => {
            this.settings.parametros = data;
            this.localData.saveSettings(this.settings);
            if(this.settings.parametros.noComunicarCoop != 1) {
              this.ocultar = false;
            } else { this.ocultar = true; }
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


  cambioDatos(): void {
   this.ariagroData.comprobarHost(this.settings.parametros.url)
   .subscribe(
     (data) => {
      if(data){
        if(!data.smtpConfig.host || data.smtpConfig.host == "") {
          this.msg.showErrorPersoinalizado("ERROR", "Correo no configurado, consulte con su cooperativa");
        }else {
            let modal = this.modalCtrl.create('ModalDatosCambiarPage');
            modal.present();
          }
      }
     },
     (err) => {
      this.msg.showAlert(err);
     }
   )
  }

  comprobarCorreo(): void {
    this.renovarParametros();
    if(!this.settings.parametros.certificadoIRPF || this.settings.parametros.certificadoIRPF == 0) {
      this.msg.showErrorPersoinalizado('', 'Funcionalidad no habilitada, póngase en contacto con su cooperativa');
    }else {
      var mens = "";
      var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   
      if (emailRegex.test(this.correo)) {
        mens = 'Se va a enviar al correo indicado el certificado del periodo. Puede introducir otros valores.';
      } else {
        mens = 'Correo incorrecto, introduzca un correo.';
      }
      this.mostrarCorreo(mens);
    }
  }

  mostrarCorreo(mens) {
    let alert = this.alertCrtl.create({
      title: mens,
      inputs: [
        {
          label: 'Correo:',
          name: 'Correo',
          placeholder: 'Correo...',
          value:  this.correo
        },
        {
          label: 'Ejercicio..',
          type: 'number',
          name: 'Ejercicio',
          placeholder: 'Ejercicio...',
          value:  this.ejercicio
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
            if (data.Ejercicio >= moment().year()) {
              mens = 'Ejercicio incorrecto';
              this.mostrarCorreo(mens);
              return;
            }
            if (emailRegex.test(data.Correo)) {
              this.correo = data.Correo;
              this.loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
              this.loading.present();

              this.ariagroData.solicitarS2(
                this.settings.parametros.url, 
                'ARIAGRO', 
                'CER', 
                this.settings.user.ariagroId + "_" + data.Ejercicio,
                this.correo
              )
              .subscribe(
                (data) => {
                  this.loading.dismiss();

                  this.msg.showErrorPersoinalizado("", 'Su documento ha sido pedido. Gracias.');
                  if( this.settings.user.email == ""){
                    this.correo = null;
                  }
                },
                (error) => {
                  this.msg.showAlert(error);
                  this.loading.dismiss();
                }
              );
                           
              // this.ariagroData.prepararCorreoFactu(this.settings.parametros.url, this.campanya.ariagro, this.anticipo.numfactu, this.informe, this.anticipo.codtipom, this.settings.parametros.parametroId, this.anticipo.fecfactu, 
              //   this.paramCentral)
              // .subscribe(
              //   (data) => {
              //     this.enviarCorreo(data);
              //   },
              //   (error) => {
              //     this.msg.showAlert(error);
              //     this.loading.dismiss();
              //   }
              // );
            }else {
              mens = 'No tenemos un correo por defecto. Escriba uno en la entrada Correo...';
              this.mostrarCorreo(mens);
            }
          }
        }
      ]
    });
    alert.present();
  }


  solicitarCertificado(): void {
    this.comprobarCorreo();
  }

}
